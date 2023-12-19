import { resolve } from "path";
import { defineConfig } from "vite";

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
});
