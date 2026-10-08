import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/shop", destination: "/products", permanent: true },
      { source: "/register", destination: "/signup", permanent: true },
    ];
  },
};

export default nextConfig;
