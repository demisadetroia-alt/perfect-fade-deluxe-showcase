// Static build config for GitHub Pages.
// nitro preset "static" prerenders HTML at build time.
// prerender routes cast to any because the wrapper's TS types are conservative,
// but nitro accepts the option at runtime.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "static",
    // @ts-expect-error nitro accepts prerender at runtime; wrapper types don't expose it
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
