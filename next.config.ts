import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: { bodySizeLimit: "4mb" },
    proxyClientMaxBodySize: "4mb",
  },
  images: {
    remotePatterns: [
      new URL("https://images.unsplash.com/**"),
      ...(process.env.CLOUDINARY_CLOUD_NAME
        ? [new URL(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/**`)]
        : []),
    ],
    qualities: [75],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
