const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const initialMessage = require('initial-webpack-message');
require('dotenv').config();

module.exports = {
  entry: './app/index.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env'] },
      },
    ],
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'app/'),
    port: process.env.WEBPACK_PORT,
    publicPath: `http://localhost:${process.env.WEBPACK_PORT}/dist`,
    hot: true,
    quiet: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      clearConsole: true,
      compilationSuccessInfo: {
        messages: initialMessage(process.env.WEBPACK_PORT, []),
      },
    }),
  ],
};