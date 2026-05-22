/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["pdf-parse", "tesseract.js", "tesseract.js-core"],
  outputFileTracingIncludes: {
    "/api/analyze": [
      "./node_modules/tesseract.js/src/worker-script/node/index.js",
      "./node_modules/tesseract.js-core/tesseract-core*.js",
      "./node_modules/tesseract.js-core/tesseract-core*.wasm",
      "./node_modules/tesseract.js-core/tesseract-core*.wasm.js",
    ],
  },
};
export default nextConfig;
