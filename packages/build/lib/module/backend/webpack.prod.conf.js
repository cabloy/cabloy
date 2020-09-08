const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfigFn = require('./webpack.base.conf');

module.exports = context => {

  const env = context.config.build.env;

  const plugins = [
    new webpack.DefinePlugin({
      'process.env': env,
    }),
  ];

  return merge(baseWebpackConfigFn(context), {
    mode: 'production',
    devtool: context.config.build.productionSourceMap ? 'source-map' : false,
    plugins,
    optimization: {
      runtimeChunk: false,
      splitChunks: false,
      minimize: context.config.build.uglify,
    },
  });

};

