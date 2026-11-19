import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Hide the round Next.js "N" badge in development (errors still show).
  devIndicators: false,
  // Old static admin URL from v1
  async redirects() {
    return [{ source: "/admin.html", destination: "/admin", permanent: true }];
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
