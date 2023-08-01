import { defineConfig, build } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { obfuscator } from "rollup-obfuscator";

// // https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    obfuscator({
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: false,
      debugProtectionInterval: 0,
      disableConsoleOutput: false,
      identifierNamesGenerator: "hexadecimal",
      log: false,
      numbersToExpressions: true,
      renameGlobals: false,
      selfDefending: true,
      simplify: true,
      splitStrings: true,
      splitStringsChunkLength: 10,
      stringArray: true,
      stringArrayCallsTransform: true,
      stringArrayCallsTransformThreshold: 0.75,
      stringArrayEncoding: ["base64"],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 2,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 4,
      stringArrayWrappersType: "function",
      stringArrayThreshold: 0.75,
      transformObjectKeys: true,
      unicodeEscapeSequence: true,
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        Background: path.resolve(__dirname, "./src/Background/Background.js"),
      },

      output: {
        dir: path.resolve(__dirname, "../../Release/Background/"),
        entryFileNames: "[name].js",
      },
    },

    emptyOutDir: true,
  },
});
