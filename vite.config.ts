// Static build config for GitHub Pages.
// - nitro preset "static" prerenders HTML at build time.
// - prerender crawls "/" so index.html is generated.
// - after build, static files live in .output/public and are copied to /dist by the GH Actions workflow.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "static",
    prerender: {
      crawlLinks: true,
      routes: ["/"],
    },
  },
  vite: {
    server: {
      host: "0.0.0.0",
      port: 5000,
      allowedHosts: true,
    },
  },
});
