import { defineConfig } from "vite";
import liveReload from "vite-plugin-live-reload";
import multiInput from "rollup-plugin-multi-input";

export default defineConfig(({ mode }) => {
  return {
    plugins: [multiInput(), liveReload(["*.theme", "templates/**/*.twig"])],
    base:
      mode === "production"
        ? "/themes/custom/visualize/dist/"
        : "/themes/custom/visualize/",
    build: {
      manifest: true,
      rollupOptions: {
        input: ["scss/**/*.scss", "!scss/**/_*.scss", "js/*.js", "js/*.ts"],
      },
    },
    optimizeDeps: {
      include: [],
    },
    server: {
      host: true,
      port: process.env.VITE_PORT || 12321,
      strictPort: true,
    },
  };
});
