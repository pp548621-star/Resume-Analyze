/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  outputFileTracingIncludes: {
    "/api/analyze": [
      "./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
      "./node_modules/tesseract.js/src/worker-script/node/index.js",
      "./node_modules/tesseract.js-core/tesseract-core*.js",
      "./node_modules/tesseract.js-core/tesseract-core*.wasm",
      "./node_modules/tesseract.js-core/tesseract-core*.wasm.js",
    ],
  },
};
export default nextConfig;
