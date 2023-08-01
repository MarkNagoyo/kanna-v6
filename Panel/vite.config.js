import { defineConfig, build } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// // https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],

  build: {
    emptyOutDir: true,
    outDir: path.resolve(__dirname, "../../Release/Panel"),
  },
});

// await build({
//   base: "./",
//   plugins: [react()],

//   build: {
//     emptyOutDir: true,
//     outDir: path.resolve(__dirname, "../../Release/Panel"),
//   },
// });

// await build({
//   rollupOptions: {
//     input: {
//       Background: path.resolve(__dirname, "src/Background/Background.js"),
//     },
//   },

//   build: {
//     outDir: path.resolve(__dirname, "../../Release/Panel"),
//   },
// });
