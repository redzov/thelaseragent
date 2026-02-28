import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.thelaseragent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "spcdn.shortpixel.ai",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/contact-us-2",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/sell-a-laser-new",
        destination: "/sell-a-laser",
        permanent: true,
      },
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/customer-education",
        destination: "/laser-faqs",
        permanent: true,
      },
      {
        source: "/videos",
        destination: "/",
        permanent: true,
      },
      {
        source: "/medical-laser-supplies",
        destination: "/laser-machines-for-sale",
        permanent: true,
      },
      {
        source: "/training",
        destination: "/",
        permanent: true,
      },
      {
        source: "/financing",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
