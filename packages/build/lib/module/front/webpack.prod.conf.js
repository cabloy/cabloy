const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfigFn = require('./webpack.base.conf');
const { VueLoaderPlugin } = require('vue-loader');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = context => {

  const env = context.config.build.env;

  const plugins = [
    new webpack.DefinePlugin({
      'process.env': env,
    }),
    new VueLoaderPlugin(),
  // new MiniCssExtractPlugin({
  //   filename: '[name].css',
  // }),
  // new OptimizeCssAssetsPlugin({
  //   cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
  // }),
  ];

  return merge(baseWebpackConfigFn(context), {
    mode: 'production',
    module: {
      rules: context.utils.styleLoaders({
        sourceMap: context.config.build.productionSourceMap,
        extract: false,
      }),
    },
    devtool: context.config.build.productionSourceMap ? 'source-map' : false,
    plugins,
    optimization: {
      runtimeChunk: false,
      splitChunks: false,
      minimize: context.config.build.uglify,
    },
  });
};
