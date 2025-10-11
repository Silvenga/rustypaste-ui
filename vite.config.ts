import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
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
          const accept = req.method === "POST" || req.url === "/list";
          if (!accept) {
            return req.url;
          }
          console.log("[proxy] ", req.method, req.url);
          return false;
        },
      },
    },
  },
});
