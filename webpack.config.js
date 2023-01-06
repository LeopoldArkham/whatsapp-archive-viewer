const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const initialMessage = require('initial-webpack-message');
require('dotenv').config();

module.exports = {
  entry: './app/index.tsx',
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'source-map-loader',
        options: { presets: ['@babel/env'] },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  resolve: { extensions: ['*', '.js', '.jsx', '.ts', '.tsx'] },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: process.env.WEBPACK_PORT,
    // publicPath: `http://localhost:${process.env.WEBPACK_PORT}/dist`,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'app/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      clearConsole: true,
      compilationSuccessInfo: {
        messages: initialMessage(process.env.WEBPACK_PORT, []),
      },
    }),
  ],
};
