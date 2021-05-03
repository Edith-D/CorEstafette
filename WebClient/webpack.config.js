const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("./node_modules/clean-webpack-plugin/dist/clean-webpack-plugin");
module.exports = {
  entry: "./src/site.ts",
  output: {
    path: path.resolve(__dirname, "wwwroot/js/"),
    filename: "main.js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".ts"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css"
    }),
    new CleanWebpackPlugin(),
  ]
};