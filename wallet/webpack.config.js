import { resolve } from "path";

export default {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: resolve("dist"),
  },
  resolve: {
    fallback: {
      fs: false, // Prevent bundling fs for the browser
    },
  },
  mode: "development",
};
