import { lstatSync, existsSync } from "node:fs";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), viteSingleFile({ removeViteModuleLoader: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      ignored: (path) => {
        if (!existsSync(path)) {
          return false;
        }
        const stat = lstatSync(path);
        if (stat.isFile()) {
          return !/\.(json|ts|tsx|html)$/.test(path);
        }
        return false;
      },
    },
    proxy: {
      "^/": {
        target: "http://localhost:5174",
        changeOrigin: true,
        bypass: (req) => {
          const isGetLike = req.method === "GET" || req.method === "HEAD";
          if (!isGetLike) {
            console.log("[proxy]", req.method, req.url);
            return undefined;
          }
          if (req.url === "/" || req.url === "/index.html") {
            return req.url;
          }
          if (
            req.url?.startsWith("/@") ||
            req.url?.startsWith("/src/") ||
            req.url?.startsWith("/node_modules/")
          ) {
            return req.url;
          }
          console.log("[proxy]", req.method, req.url);
          return undefined;
        },
      },
    },
  },
});
