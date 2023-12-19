import { resolve } from "path";
import { defineConfig } from "vite";
import { generateParserDts } from "./utils/gen_dts_signatures";

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/main.ts"),
      name: "MarkIn",
      // the proper extensions will be added
      fileName: "markin",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      // see https://vitejs.dev/guide/build#library-mode
      external: [],
    },
  },
  plugins: [
    {
      name: "postbuild-commands", // the name of your custom plugin. Could be anything.
      closeBundle: () => {
        generateParserDts();
      },
    },
  ],
});
