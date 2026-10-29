import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getPosts, getProperties } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const [properties, posts] = await Promise.all([getProperties(), getPosts()]);
  const staticPaths = ["/", "/properties", "/services", "/about", "/contact", "/blog", "/career", "/privacy-policy", "/terms"];
  return [
    ...staticPaths.map((path) => ({ url: absoluteUrl(path) })),
    ...properties.map((property) => ({
      url: absoluteUrl(`/properties/${property.slug}`),
      lastModified: property.updatedAt || property.createdAt,
      images: property.images.slice(0, 3).map(absoluteUrl),
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt || post.publishedAt,
      images: post.coverImage ? [absoluteUrl(post.coverImage)] : [],
    })),
  ];
}
