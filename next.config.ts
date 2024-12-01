import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/,
      use: "raw-loader",
    });
    return config;
  },
};

export default nextConfig;
