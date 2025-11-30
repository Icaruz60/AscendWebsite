/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // puts final site in ./out
  images: { unoptimized: true }, // disable Image Optimization for static export
  // trailingSlash: true, // optional if you need strict static hosting behavior
};
export default nextConfig;
