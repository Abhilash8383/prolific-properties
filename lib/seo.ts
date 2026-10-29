import type { Metadata } from "next";

export const SITE_URL = "https://www.prolificproperties.in";
export const DEFAULT_DESCRIPTION =
  "Explore verified apartments, villas, duplex homes and plots in Bhubaneswar with local guidance from Prolific Properties.";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function seoMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const fullTitle = `${title} | Prolific Properties`;
  const images = [{ url: image ? absoluteUrl(image) : absoluteUrl("/opengraph-image"), alt: title }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      siteName: "Prolific Properties",
      locale: "en_IN",
      images,
      ...(type === "article" && { publishedTime, modifiedTime }),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: images.map((item) => item.url) },
  };
}
