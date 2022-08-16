import liveReload from "vite-plugin-live-reload";
import path from "path";

const fs = require("fs");
let files = fs.readdirSync("./js").map((file) => `./js/${file}`);
files = files.concat(["/scss/styles.scss"]);

export default {
  plugins: [liveReload(__dirname + "/**/*.(php|inc|theme|twig|scss)")],
  base: "/themes/custom/visualize/dist/",
  build: {
    // generate manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: files,
      // Remove the [hash] since Drupal will take care of that.
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `chunks/[name].[hash].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },

  server: {
    // required to load scripts from custom host
    cors: true,

    // we need a strict port to match on PHP side
    // change freely, but update on PHP to match the same port
    strictPort: true,
    port: 12321,

    hmr: {
      host: "localhost",
    },
  },

  resolve: {
    alias: {
      jquery: "/js/jquery.module.js",
    },
  },
};
