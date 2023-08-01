import path from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";
import WebpackObfuscator from "webpack-obfuscator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  plugins: [
    new WebpackObfuscator(
      {
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
      },
      ["excluded_bundle_name.js"]
    ),
  ],

  mode: "development",
  devtool: "inline-source-map",

  entry: {
    "Background.js-6443a262": path.resolve(
      __dirname,
      "../dist/assets/Background.js-6443a262.js"
    ), // Set the entry point for "Logic1"
  },

  output: {
    path: path.resolve(__dirname, "../../BackgroundObfuscated/"),
    filename: "[name].js",
  },
};
