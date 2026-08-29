import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { getPlugin } from "./src/services/gammaApi.js";

export default defineConfig({
  base: "/polymarket-extractor/",
  plugins: [react(), getPlugin()],
  build: {
    outDir: "dist",
  },
});
