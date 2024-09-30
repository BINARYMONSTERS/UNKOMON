import { resolve } from "path";

export default {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: resolve("dist"),
    library: "unkomonLibrary",
    libraryTarget: "umd",
    umdNamedDefine: true,
    globalObject: "this",
  },
  resolve: {
    fallback: {
      fs: false, // Prevent bundling fs for the browser
    },
  },
  target: "web",
  mode: "development",
};
