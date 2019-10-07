const path = require("path")

module.exports = {
  mode: "production",
  cache: false,
  entry: "./src/index.js",
  output: {
    library: "ipfslib",
    path: path.resolve(__dirname, "dist"),
    filename: "ipfslib.js"
  }
}
