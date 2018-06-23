const webpack = require('webpack');
const config = require('./config.js');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const env = config.build.env;

const plugins = [
  new webpack.DefinePlugin({
    'process.env': env,
  }),
];

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: config.build.productionSourceMap ? 'source-map' : false,
  plugins,
  optimization: {
    runtimeChunk: false,
    splitChunks: false,
    minimize: config.build.uglify,
  },
});

module.exports = webpackConfig;
