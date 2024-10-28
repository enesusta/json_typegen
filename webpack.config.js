const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    enabledWasmLoadingTypes: ['fetch'],
  },
  target: 'node',
  node: {
    __dirname: true,
    __filename: false,
  },

  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  resolve: {
    alias: {
      root: path.resolve(__dirname, 'src/'),
    },
    extensions: ['', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)?$/,
        use: 'swc-loader',
        exclude: /node_modules/,
      },
      { test: /\.(png|jpg|jpeg|woff|woff2|ttf)$/, type: 'asset/resource' },
      { test: /\.json$/, type: 'json' },
    ],
  },
  plugins: [
    new Dotenv({
      path: `./.env.${process.env.NODE_ENV}`,
    }),
    new NodemonPlugin(),
  ],
};
