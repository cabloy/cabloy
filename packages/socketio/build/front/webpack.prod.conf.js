const utils = require('./utils');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfigFn = require('./webpack.base.conf');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (config) {
  const env = config.build.env;

  const plugins = [
    new webpack.DefinePlugin({
      'process.env': env,
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('[name].css'),
    }),
  ];

  return merge(baseWebpackConfigFn(config), {
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
      minimize: config.build.uglify,
    },
  });
};
