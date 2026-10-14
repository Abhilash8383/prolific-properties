import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { collection, serialize } from "./db";
import type { Job, Post, Property, Settings, Testimonial } from "./types";

export const TAGS = {
  settings: "settings",
  properties: "properties",
  posts: "posts",
  testimonials: "testimonials",
  jobs: "jobs",
} as const;

export const defaultSettings: Settings = {
  siteName: "Prolific Properties",
  tagline: "Homes worth living for",
  description: "",
  phone: "",
  whatsapp: "",
  email: "",
  hrEmail: "",
  address: "",
  hours: "",
  rera: "",
  social: { facebook: "", instagram: "", linkedin: "", youtube: "" },
  hero: { title: "Find a home that's", highlight: "truly yours.", subtitle: "" },
  stats: [],
  developers: [],
  founder: { name: "", title: "", message: "" },
};

export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.settings);
  const doc = await (await collection<Partial<Settings> & { _id: string }>("settings")).findOne(
    { _id: "site" },
    { projection: { _id: 0 } },
  );
  return { ...defaultSettings, ...doc };
}

export async function getProperties(): Promise<Property[]> {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.properties);
  const docs = await (await collection("properties")).find({ published: true }).sort({ createdAt: -1 }).toArray();
  return docs.map((d) => serialize<Property>(d));
}

export async function getProperty(slug: string): Promise<Property | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.properties);
  const doc = await (await collection("properties")).findOne({ slug, published: true });
  return doc ? serialize<Property>(doc) : undefined;
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.posts);
  const docs = await (await collection("posts")).find({ published: true }).sort({ publishedAt: -1 }).toArray();
  return docs.map((d) => serialize<Post>(d));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.posts);
  const doc = await (await collection("posts")).findOne({ slug, published: true });
  return doc ? serialize<Post>(doc) : undefined;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.testimonials);
  const docs = await (await collection("testimonials")).find().sort({ order: 1 }).toArray();
  return docs.map((d) => serialize<Testimonial>(d));
}

export async function getJobs(): Promise<Job[]> {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.jobs);
  const docs = await (await collection("jobs")).find({ open: true }).toArray();
  return docs.map((d) => serialize<Job>(d));
}
