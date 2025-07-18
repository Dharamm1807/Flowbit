const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {
    port: 3001,
    historyApiFallback: true,
  },
  output: {
    publicPath: 'http://localhost:3001/',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'tickets',
      filename: 'remoteEntry.js',
      exposes: {
        "./SupportTicketsApp": "./src/SupportTicketsApp.jsx",
      },
      remotes: {
            shell: "shell@http://localhost:3000/remoteEntry.js", // 👈 match Shell's dev server
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.3.1" },
        "react-dom": { singleton: true, requiredVersion: "^18.3.1" },
        "react-redux": { singleton: true, requiredVersion: "^9.2.0" },
        "@reduxjs/toolkit": { singleton: true, requiredVersion: "^2.8.2" },
      },
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};