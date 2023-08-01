import { defineConfig } from "vite";
import path from "path";
import commonjs from "@rollup/plugin-commonjs"; // Add this line
import { crx } from "@crxjs/vite-plugin";
import manifest from "../manifest.json";

export default defineConfig({
  plugins: [crx({ manifest })],

  build: {
    minify: true,
  },

  // build: {
  //   emptyOutDir: false,
  //   rollupOptions: {
  //     input: {
  //       ViewMap: path.resolve(__dirname, "Map/View/ViewMap.js"), // Set the entry point for "Logic1"
  //       ChangeMap: path.resolve(__dirname, "Map/Change/changeMap.js"), // Set the entry point for "Logic1"
  //       AttackEnemy: path.resolve(__dirname, "Enemies/Attack/attackEnemy.js"), // Set the entry point for "Logic1"
  //       // logic2: path.resolve(__dirname, "main.js"), // Set the entry point for "Logic1"
  //     },
  //     output: {
  //       dir: path.resolve(__dirname, "../../Release/"),
  //       entryFileNames: "[name].js",
  //       // format: "iife", // Use IIFE format to avoid using import/require
  //       // inlineDynamicImports: true, // Enables dynamic imports for loading modules at runtime
  //     },
  //   },
  // },
});
