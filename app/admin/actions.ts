"use server";

import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { ObjectId } from "mongodb";
import { refresh, revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { collection } from "@/lib/db";
import { createSession, destroySession, requireAdmin } from "@/lib/auth";
import { TAGS } from "@/lib/data";
import { priceToRupees, slugify } from "@/lib/format";
import { variantPrice } from "@/lib/variants";
import { MAX_UPLOAD_BYTES, isAcceptedImageType } from "@/lib/upload";
import { allowRequest } from "@/lib/rate-limit";
import { CATEGORIES, ENQUIRY_STATUSES, FEATURE_GROUPS, LISTING_TYPES, PLACEMENTS, STATUSES, type Placement, type PropertyVariant } from "@/lib/types";

export type FormState = { ok?: boolean; error?: string; message?: string } | null;

function bustPublic(tag: string) {
  updateTag(tag);
}

function bustAdmin(...paths: string[]) {
  for (const path of paths) {
    if (path.includes("[")) revalidatePath(path, "page");
    else revalidatePath(path);
  }
  refresh();
}

const str = (f: FormData, k: string, max = 5000) => String(f.get(k) ?? "").trim().slice(0, max);
const num = (f: FormData, k: string) => {
  const value = Number(f.get(k));
  return Number.isFinite(value) ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, value)) : 0;
};
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

async function uploadImages(f: FormData, key: string, folder: "properties" | "blog-post") {
  const files = f.getAll(key).filter((x): x is File => x instanceof File && x.size > 0);
  if (files.reduce((size, file) => size + file.size, 0) > MAX_UPLOAD_BYTES) {
    throw new Error("Photos must total no more than 3.5 MB per save");
  }
  for (const file of files) {
    if (!isAcceptedImageType(file.type)) throw new Error(`${file.name} must be a JPG, PNG or WebP image`);
  }
  const validated = await Promise.all(files.map(async (file) => {
    const data = Buffer.from(await file.arrayBuffer());
    const jpeg = data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
    const png = data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const webp = data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP";
    const valid = file.type === "image/jpeg" ? jpeg : file.type === "image/png" ? png : webp;
    if (!valid) throw new Error(`${file.name} is not a valid ${file.type.slice(6).toUpperCase()} image`);
    return data;
  }));
  if (!validated.length) return [];
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary credentials are not configured");
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  const urls: string[] = [];
  for (const data of validated) {
    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `prolific-properties/${folder}`, resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else if (result?.secure_url) resolve(result.secure_url);
          else reject(new Error("Cloudinary did not return an image URL"));
        },
      );
      stream.end(data);
    });
    urls.push(url);
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
  if (!(await allowRequest("admin-login", 12))) {
    return { error: "Too many sign-in attempts. Please try again in 15 minutes." };
  }
  const email = str(f, "email", 200).toLowerCase();
  const password = String(f.get("password") ?? "");
  const admin = await (await collection("admins")).findOne({ email });
  if (!admin || !(await bcrypt.compare(password, String(admin.passwordHash)))) {
    await new Promise((r) => setTimeout(r, 500));
    return { error: "Incorrect email or password" };
  }
  await createSession({ adminId: admin._id.toString(), email, version: Number(admin.sessionVersion ?? 0) });
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
    {
      $set: { email, name: str(f, "name", 100) || "Admin", ...(password && { passwordHash: await bcrypt.hash(password, 12) }) },
      ...(password && { $inc: { sessionVersion: 1 } }),
    },
  );
  await createSession({ adminId: session.adminId, email, version: session.version + (password ? 1 : 0) });
  return { ok: true, message: "Account updated" };
}

/* ---------- Properties ---------- */

export async function saveProperty(_prev: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await guard(async () => {
    const id = str(f, "id") ? oid(str(f, "id")) : undefined;
    const title = str(f, "title", 200);
    if (!title) throw new Error("Title is required");
    const variantCount = Number(str(f, "variantCount", 3));
    if (!Number.isInteger(variantCount) || variantCount < 1 || variantCount > 30) throw new Error("Add between 1 and 30 configurations");
    const variants: PropertyVariant[] = Array.from({ length: variantCount }, (_, index) => {
      const key = `variants.${index}`;
      const name = str(f, `${key}.name`, 100);
      const price = str(f, `${key}.price`, 100);
      const basePrice = str(f, `${key}.basePrice`, 100);
      if (!name) throw new Error(`Configuration ${index + 1} needs a name`);
      if (!price) throw new Error(`${name} needs a final price`);
      const unitsInput = str(f, `${key}.units`, 20);
      const units = unitsInput === "" ? null : Number(unitsInput);
      if (units !== null && (!/^\d+$/.test(unitsInput) || !Number.isSafeInteger(units))) throw new Error(`${name}: units available must be a whole number of 0 or more`);
      const sqft = num(f, `${key}.sqft`);
      const sqftMax = num(f, `${key}.sqftMax`);
      if (sqftMax < sqft) throw new Error(`${name}: maximum size must be at least the minimum size`);
      const planCount = Number(str(f, `${key}.planCount`, 3));
      if (!Number.isInteger(planCount) || planCount < 0 || planCount > 30) throw new Error(`${name}: add no more than 30 floor plans`);
      const floorPlans = Array.from({ length: planCount }, (_, planIndex) => {
        const planKey = `${key}.plans.${planIndex}`;
        const planName = str(f, `${planKey}.name`, 100);
        const planSqft = num(f, `${planKey}.sqft`);
        const planPrice = str(f, `${planKey}.price`, 100);
        if (!planName || !planPrice || !planSqft) throw new Error(`${name}: each floor plan needs a name, size and price`);
        if (planSqft < sqft || planSqft > sqftMax) throw new Error(`${name}: ${planName} must be within the size range`);
        return { name: planName, sqft: planSqft, price: planPrice };
      });
      return {
        name, basePrice, price, units, soldOut: f.get(`${key}.soldOut`) === "on" || units === 0,
        bedrooms: num(f, `${key}.bedrooms`),
        bathrooms: num(f, `${key}.bathrooms`),
        sqft, sqftMax, floorPlans,
        parking: num(f, `${key}.parking`),
        status: oneOf(str(f, `${key}.status`), STATUSES),
        availableFrom: str(f, `${key}.availableFrom`, 100),
        description: str(f, `${key}.description`, 3000),
        features: Object.fromEntries(FEATURE_GROUPS.map((g) => [g, csv(f, `${key}.features.${g}`)])) as PropertyVariant["features"],
      };
    });
    const primary = variants[0];
    const images = [...lines(f, "images"), ...(await uploadImages(f, "uploads", "properties"))];
    const doc = {
      title,
      slug: await uniqueSlug("properties", str(f, "slug") || title, id),
      developer: str(f, "developer", 200),
      category: oneOf(str(f, "category"), CATEGORIES),
      listingType: oneOf(str(f, "listingType"), LISTING_TYPES),
      status: primary.status,
      placements: f.getAll("placements").filter((v): v is Placement => typeof v === "string" && v in PLACEMENTS),
      published: f.get("published") === "on",
      price: variantPrice(primary),
      units: primary.units,
      configurations: variants.map((v) => v.name).join(", "),
      area: str(f, "area", 200),
      city: str(f, "city", 100) || "Bhubaneswar",
      state: str(f, "state", 100) || "Odisha",
      bedrooms: primary.bedrooms,
      bathrooms: primary.bathrooms,
      sqft: primary.sqft,
      parking: primary.parking,
      availableFrom: primary.availableFrom,
      rera: str(f, "rera", 100),
      summary: str(f, "summary", 500),
      description: str(f, "description", 20000)
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      images,
      features: primary.features,
      floorPlans: variants.flatMap((v) => v.floorPlans?.length
        ? v.floorPlans.map((plan) => ({ name: `${v.name} · ${plan.name}`, sqft: plan.sqft, price: priceToRupees(plan.price) ?? 0 }))
        : [{ name: v.name, sqft: v.sqft, price: priceToRupees(v.price) ?? 0 }]),
      variants,
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
  bustPublic(TAGS.properties);
  bustAdmin("/admin", "/admin/properties", "/admin/properties/[id]");
  redirect("/admin/properties");
}

export async function deleteProperty(id: string) {
  await requireAdmin();
  await (await collection("properties")).deleteOne({ _id: oid(id) });
  bustPublic(TAGS.properties);
  bustAdmin("/admin", "/admin/properties", "/admin/properties/[id]");
}

export async function togglePropertyField(id: string, field: "published", value: boolean) {
  await requireAdmin();
  await (await collection("properties")).updateOne({ _id: oid(id) }, { $set: { [field]: value, updatedAt: new Date() } });
  bustPublic(TAGS.properties);
  bustAdmin("/admin", "/admin/properties", "/admin/properties/[id]");
}

export async function togglePlacement(id: string, placement: Placement, on: boolean) {
  await requireAdmin();
  if (!(placement in PLACEMENTS)) return;
  await (await collection("properties")).updateOne(
    { _id: oid(id) },
    { [on ? "$addToSet" : "$pull"]: { placements: placement }, $set: { updatedAt: new Date() } },
  );
  bustPublic(TAGS.properties);
  bustAdmin("/admin", "/admin/properties", "/admin/properties/[id]");
}

/* ---------- Blog ---------- */

export async function savePost(_prev: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await guard(async () => {
    const id = str(f, "id") ? oid(str(f, "id")) : undefined;
    const title = str(f, "title", 200);
    if (!title) throw new Error("Title is required");
    const [uploaded] = await uploadImages(f, "coverUpload", "blog-post");
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
