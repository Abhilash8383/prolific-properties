"use server";

import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { collection, imageBucket } from "@/lib/db";
import { createSession, destroySession, requireAdmin } from "@/lib/auth";
import { TAGS } from "@/lib/data";
import { slugify } from "@/lib/format";
import { CATEGORIES, ENQUIRY_STATUSES, FEATURE_GROUPS, LISTING_TYPES, PLACEMENTS, STATUSES, type Placement } from "@/lib/types";

export type FormState = { ok?: boolean; error?: string; message?: string } | null;

const str = (f: FormData, k: string, max = 5000) => String(f.get(k) ?? "").trim().slice(0, max);
const num = (f: FormData, k: string) => Math.max(0, Number(f.get(k)) || 0);
const lines = (f: FormData, k: string) =>
  str(f, k, 20000)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
const csv = (f: FormData, k: string) =>
  str(f, k)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
const oneOf = <T extends string>(v: string, list: readonly T[]) => (list.includes(v as T) ? (v as T) : list[0]);
const oid = (id: string) => {
  if (!ObjectId.isValid(id)) throw new Error("Invalid id");
  return new ObjectId(id);
};

async function uploadImages(f: FormData, key: string) {
  const files = f.getAll(key).filter((x): x is File => x instanceof File && x.size > 0);
  const bucket = await imageBucket();
  const urls: string[] = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) throw new Error(`${file.name} is not an image`);
    if (file.size > 8 * 1024 * 1024) throw new Error(`${file.name} is larger than 8 MB`);
    const data = Buffer.from(await file.arrayBuffer());
    const upload = bucket.openUploadStream(file.name, { metadata: { contentType: file.type } });
    await new Promise<void>((resolve, reject) => {
      upload.on("finish", () => resolve());
      upload.on("error", reject);
      upload.end(data);
    });
    urls.push(`/api/images/${upload.id.toString()}`);
  }
  return urls;
}

async function uniqueSlug(name: string, wanted: string, id?: ObjectId) {
  const base = slugify(wanted) || "item";
  const col = await collection(name);
  for (let i = 0; ; i++) {
    const slug = i ? `${base}-${i + 1}` : base;
    if (!(await col.findOne({ slug, ...(id && { _id: { $ne: id } }) }))) return slug;
  }
}

async function guard<T>(fn: () => Promise<T>): Promise<T | { error: string }> {
  try {
    return await fn();
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Something went wrong" };
  }
}

/* ---------- Auth ---------- */

export async function login(_prev: FormState, f: FormData): Promise<FormState> {
  const email = str(f, "email", 200).toLowerCase();
  const password = String(f.get("password") ?? "");
  const admin = await (await collection("admins")).findOne({ email });
  if (!admin || !(await bcrypt.compare(password, String(admin.passwordHash)))) {
    await new Promise((r) => setTimeout(r, 500));
    return { error: "Incorrect email or password" };
  }
  await createSession({ adminId: admin._id.toString(), email });
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function updateAccount(_prev: FormState, f: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const admins = await collection("admins");
  const admin = await admins.findOne({ _id: oid(session.adminId) });
  if (!admin || !(await bcrypt.compare(String(f.get("current") ?? ""), String(admin.passwordHash)))) {
    return { error: "Current password is incorrect" };
  }
  const email = str(f, "email", 200).toLowerCase();
  const password = String(f.get("password") ?? "");
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email" };
  if (password && password.length < 8) return { error: "New password must be at least 8 characters" };
  if (password !== String(f.get("confirm") ?? "")) return { error: "New passwords don't match" };
  if (email !== admin.email && (await admins.findOne({ email }))) return { error: "That email is already in use" };

  await admins.updateOne(
    { _id: admin._id },
    { $set: { email, name: str(f, "name", 100) || "Admin", ...(password && { passwordHash: await bcrypt.hash(password, 12) }) } },
  );
  await createSession({ adminId: session.adminId, email });
  return { ok: true, message: "Account updated" };
}

/* ---------- Properties ---------- */

export async function saveProperty(_prev: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await guard(async () => {
    const id = str(f, "id") ? oid(str(f, "id")) : undefined;
    const title = str(f, "title", 200);
    if (!title) throw new Error("Title is required");
    const images = [...lines(f, "images"), ...(await uploadImages(f, "uploads"))];
    const doc = {
      title,
      slug: await uniqueSlug("properties", str(f, "slug") || title, id),
      developer: str(f, "developer", 200),
      category: oneOf(str(f, "category"), CATEGORIES),
      listingType: oneOf(str(f, "listingType"), LISTING_TYPES),
      status: oneOf(str(f, "status"), STATUSES),
      placements: f.getAll("placements").filter((v): v is Placement => typeof v === "string" && v in PLACEMENTS),
      published: f.get("published") === "on",
      price: num(f, "price"),
      configurations: str(f, "configurations", 200),
      area: str(f, "area", 200),
      city: str(f, "city", 100) || "Bhubaneswar",
      state: str(f, "state", 100) || "Odisha",
      bedrooms: num(f, "bedrooms"),
      bathrooms: num(f, "bathrooms"),
      sqft: num(f, "sqft"),
      parking: num(f, "parking"),
      availableFrom: str(f, "availableFrom", 100),
      rera: str(f, "rera", 100),
      summary: str(f, "summary", 500),
      description: str(f, "description", 20000)
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      images,
      features: Object.fromEntries(FEATURE_GROUPS.map((g) => [g, csv(f, `features.${g}`)])),
      floorPlans: lines(f, "floorPlans").map((l) => {
        const [name, sqft, price] = l.split("|").map((s) => s.trim());
        return { name, sqft: Number(sqft?.replace(/\D/g, "")) || 0, price: Number(price?.replace(/\D/g, "")) || 0 };
      }),
      updatedAt: new Date(),
    };
    const col = await collection("properties");
    if (id) await col.updateOne({ _id: id }, { $set: doc });
    else {
      const last = await col.find().sort({ ref: -1 }).limit(1).next();
      await col.insertOne({ ...doc, ref: (Number(last?.ref) || 22542) + 1, createdAt: new Date() });
    }
    return { ok: true };
  });
  if ("error" in result) return result;
  updateTag(TAGS.properties);
  redirect("/admin/properties");
}

export async function deleteProperty(id: string) {
  await requireAdmin();
  await (await collection("properties")).deleteOne({ _id: oid(id) });
  updateTag(TAGS.properties);
}

export async function togglePropertyField(id: string, field: "published", value: boolean) {
  await requireAdmin();
  await (await collection("properties")).updateOne({ _id: oid(id) }, { $set: { [field]: value, updatedAt: new Date() } });
  updateTag(TAGS.properties);
}

export async function togglePlacement(id: string, placement: Placement, on: boolean) {
  await requireAdmin();
  if (!(placement in PLACEMENTS)) return;
  await (await collection("properties")).updateOne(
    { _id: oid(id) },
    { [on ? "$addToSet" : "$pull"]: { placements: placement }, $set: { updatedAt: new Date() } },
  );
  updateTag(TAGS.properties);
}

/* ---------- Blog ---------- */

export async function savePost(_prev: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await guard(async () => {
    const id = str(f, "id") ? oid(str(f, "id")) : undefined;
    const title = str(f, "title", 200);
    if (!title) throw new Error("Title is required");
    const [uploaded] = await uploadImages(f, "coverUpload");
    const publishedAt = str(f, "publishedAt") ? new Date(str(f, "publishedAt")) : new Date();
    const doc = {
      title,
      slug: await uniqueSlug("posts", str(f, "slug") || title, id),
      excerpt: str(f, "excerpt", 500),
      coverImage: uploaded ?? str(f, "coverImage", 500),
      content: str(f, "content", 100000),
      author: str(f, "author", 100) || "Prolific Properties Team",
      category: str(f, "category", 100) || "General",
      published: f.get("published") === "on",
      publishedAt: isNaN(+publishedAt) ? new Date() : publishedAt,
      updatedAt: new Date(),
    };
    const col = await collection("posts");
    if (id) await col.updateOne({ _id: id }, { $set: doc });
    else await col.insertOne(doc);
    return { ok: true };
  });
  if ("error" in result) return result;
  updateTag(TAGS.posts);
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  await requireAdmin();
  await (await collection("posts")).deleteOne({ _id: oid(id) });
  updateTag(TAGS.posts);
}

/* ---------- Testimonials & jobs ---------- */

export async function saveTestimonial(_prev: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const doc = { name: str(f, "name", 100), role: str(f, "role", 100), text: str(f, "text", 1000), order: num(f, "order") };
  if (!doc.name || !doc.text) return { error: "Name and testimonial text are required" };
  const col = await collection("testimonials");
  const id = str(f, "id");
  if (id) await col.updateOne({ _id: oid(id) }, { $set: doc });
  else await col.insertOne(doc);
  updateTag(TAGS.testimonials);
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await (await collection("testimonials")).deleteOne({ _id: oid(id) });
  updateTag(TAGS.testimonials);
}

export async function saveJob(_prev: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const doc = {
    title: str(f, "title", 100),
    type: str(f, "type", 50) || "Full-time",
    location: str(f, "location", 100),
    text: str(f, "text", 2000),
    open: f.get("open") === "on",
  };
  if (!doc.title) return { error: "Job title is required" };
  const col = await collection("jobs");
  const id = str(f, "id");
  if (id) await col.updateOne({ _id: oid(id) }, { $set: doc });
  else await col.insertOne(doc);
  updateTag(TAGS.jobs);
  redirect("/admin/jobs");
}

export async function deleteJob(id: string) {
  await requireAdmin();
  await (await collection("jobs")).deleteOne({ _id: oid(id) });
  updateTag(TAGS.jobs);
}

/* ---------- Enquiries ---------- */

export async function setEnquiryStatus(id: string, status: string) {
  await requireAdmin();
  await (await collection("enquiries")).updateOne({ _id: oid(id) }, { $set: { status: oneOf(status, ENQUIRY_STATUSES) } });
}

export async function deleteEnquiry(id: string) {
  await requireAdmin();
  await (await collection("enquiries")).deleteOne({ _id: oid(id) });
}

/* ---------- Settings ---------- */

export async function saveSettings(_prev: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const settings = {
    siteName: str(f, "siteName", 100) || "Prolific Properties",
    tagline: str(f, "tagline", 200),
    description: str(f, "description", 1000),
    phone: str(f, "phone", 50),
    whatsapp: str(f, "whatsapp", 20).replace(/\D/g, ""),
    email: str(f, "email", 200),
    hrEmail: str(f, "hrEmail", 200),
    address: str(f, "address", 500),
    hours: str(f, "hours", 200),
    rera: str(f, "rera", 200),
    social: {
      facebook: str(f, "social.facebook", 300),
      instagram: str(f, "social.instagram", 300),
      linkedin: str(f, "social.linkedin", 300),
      youtube: str(f, "social.youtube", 300),
    },
    hero: { title: str(f, "hero.title", 200), highlight: str(f, "hero.highlight", 200), subtitle: str(f, "hero.subtitle", 500) },
    stats: lines(f, "stats")
      .map((l) => {
        const [value, ...label] = l.split("|");
        return { value: value.trim(), label: label.join("|").trim() };
      })
      .filter((s) => s.value && s.label),
    developers: lines(f, "developers"),
    founder: { name: str(f, "founder.name", 100), title: str(f, "founder.title", 100), message: str(f, "founder.message", 5000) },
  };
  await (await collection<{ _id: string }>("settings")).updateOne({ _id: "site" }, { $set: settings }, { upsert: true });
  updateTag(TAGS.settings);
  return { ok: true, message: "Settings saved" };
}
