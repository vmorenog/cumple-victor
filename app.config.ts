import { defineConfig } from "@tanstack/react-start/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  tsr: {
    appDirectory: "app",
    routesDirectory: "./app/routes",
    generatedRouteTree: "./app/routeTree.gen.ts",
  },
  vite: {
    plugins: [
      tsconfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
  server: {
    // Cambia por "cloudflare-pages", "vercel", "node-server", etc.
    preset: "netlify",
  },
});
