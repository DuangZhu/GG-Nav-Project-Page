import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    target: "es2022",
    sourcemap: true,
    outDir: "dist-optimized",
    rollupOptions: {
      input: resolve(import.meta.dirname, "optimized.html"),
    },
  },
});
