const path = require("path")

module.exports = {
  devtool: "source-map",
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
}