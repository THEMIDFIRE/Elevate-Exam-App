import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://exam-app.elevate-bootcamp.cloud/storage/entities/**'),
    ]
  }
};
export default nextConfig;