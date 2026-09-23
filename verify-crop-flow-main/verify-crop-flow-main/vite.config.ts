import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    optimizeDeps: {
      include: ["use-sync-external-store/shim/with-selector.js"],
    },
    resolve: {
      alias: {
        "use-sync-external-store/shim/with-selector": "use-sync-external-store/shim/with-selector.js",
      },
    },
  },
});
