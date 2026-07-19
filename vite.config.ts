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
    proxy: {
      "^/": {
        target: "https://paste.service.silvenga.com",
        changeOrigin: true,
        bypass: (req) => {
          const accept =
            req.method === "POST" ||
            req.method === "DELETE" ||
            req.url === "/list" ||
            req.url === "/version";
          if (!accept) {
            return req.url;
          }
          console.log("[proxy]", req.method, req.url);
          return undefined;
        },
      },
    },
  },
});
