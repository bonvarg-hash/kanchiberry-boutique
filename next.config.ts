import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a static site (for GitHub Pages); PAGES_BASE_PATH is the
// sub-path it is served from, e.g. "/kanchiberry-boutique".
const staticExport = !!process.env.STATIC_EXPORT;
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(staticExport ? { output: "export", trailingSlash: true, basePath, images: { unoptimized: true } } : {}),
};

export default nextConfig;
