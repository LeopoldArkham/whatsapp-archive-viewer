const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './app/index.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: { presets: ["@babel/env"] },
      },
    ],
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "app/"),
    port: 3000,
    publicPath: "http://localhost:3000/dist",
    hot: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};