const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    port: 3000,
    historyApiFallback: {
    disableDotRule: true, // allows static file paths with dots (like .json)
  },
  static: {
    directory: path.join(__dirname, 'public'),
  },
  },
  output: {
    publicPath: "http://localhost:3000/",
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        tickets: "tickets@http://localhost:3001/remoteEntry.js",
      },
      exposes: {
        "./store": "./src/store/store.js", 
        "./authSlice": "./src/store/authSlice.js",
       }, 
      shared: {
        react: { singleton: true, requiredVersion: "^18.3.1" },
        "react-dom": { singleton: true, requiredVersion: "^18.3.1" },
        "react-redux": { singleton: true, requiredVersion: "^9.2.0" },
        "@reduxjs/toolkit": { singleton: true, requiredVersion: "^2.8.2" },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyPlugin({
      patterns: [
        { from: "public", to: ".", globOptions: { ignore: ["**/index.html"] } }, // copies everything from public/
      ],
    }),
  ],
};
