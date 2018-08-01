const utils = require('./utils');
const webpack = require('webpack');
const config = require('./config.js');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const env = config.build.env;

const plugins = [
  new webpack.DefinePlugin({
    'process.env': env,
  }),
  new VueLoaderPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name].css',
  }),
  new OptimizeCssAssetsPlugin({
    cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
  }),
];

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
    }),
  },
  devtool: config.build.productionSourceMap ? 'source-map' : false,
  plugins,
  optimization: {
    runtimeChunk: false,
    splitChunks: false,
    minimize: config.build.uglify,
  },
});

module.exports = webpackConfig;
