import "server-only";
import { ObjectId } from "mongodb";
import { collection, serialize } from "./db";
import { requireAdmin } from "./auth";
import type { Enquiry, Job, Post, Property, Testimonial } from "./types";

async function list<T>(name: string, sort: Record<string, 1 | -1>, filter = {}) {
  await requireAdmin();
  const docs = await (await collection(name)).find(filter).sort(sort).toArray();
  return docs.map((d) => serialize<T>(d));
}

async function one<T>(name: string, id: string) {
  await requireAdmin();
  if (!ObjectId.isValid(id)) return undefined;
  const doc = await (await collection(name)).findOne({ _id: new ObjectId(id) });
  return doc ? serialize<T>(doc) : undefined;
}

export const adminProperties = () => list<Property>("properties", { createdAt: -1 });
export const adminProperty = (id: string) => one<Property>("properties", id);
export const adminPosts = () => list<Post>("posts", { publishedAt: -1 });
export const adminPost = (id: string) => one<Post>("posts", id);
export const adminTestimonials = () => list<Testimonial>("testimonials", { order: 1 });
export const adminJobs = () => list<Job>("jobs", { title: 1 });
export const adminEnquiries = (status?: string) => list<Enquiry>("enquiries", { createdAt: -1 }, status ? { status } : {});

export async function adminCounts() {
  await requireAdmin();
  const count = async (name: string, filter = {}) => (await collection(name)).countDocuments(filter);
  const [properties, published, posts, enquiries, newEnquiries] = await Promise.all([
    count("properties"),
    count("properties", { published: true }),
    count("posts"),
    count("enquiries"),
    count("enquiries", { status: "new" }),
  ]);
  return { properties, published, posts, enquiries, newEnquiries };
}

export async function adminAccount() {
  const session = await requireAdmin();
  const doc = await (await collection("admins")).findOne({ _id: new ObjectId(session.adminId) }, { projection: { passwordHash: 0 } });
  return { email: String(doc?.email ?? session.email), name: String(doc?.name ?? "Admin") };
}
