import type { NextConfig } from "next";

const backendApiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/backend-api/:path*", destination: `${backendApiUrl}/:path*` }];
  },
};

export default nextConfig;
