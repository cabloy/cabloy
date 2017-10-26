const utils = require('./utils');
const webpack = require('webpack');
const config = require('./config.js');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const env = config.build.env;

const plugins = [
  // http://vuejs.github.io/vue-loader/en/workflow/production.html
  new webpack.DefinePlugin({
    'process.env': env,
  }),
  // extract css into its own file
  new ExtractTextPlugin({
    filename: '[name].css',
  }),
  // Compress extracted CSS. We are using this plugin so that possible
  // duplicated CSS from different components can be deduped.
  new OptimizeCSSPlugin(),
];

if (config.build.uglify) {
  plugins.push(
    new UglifyJSPlugin({
      sourceMap: config.build.productionSourceMap,
      uglifyOptions: {
        output: {
          comments: false,
          beautify: false,
        },
        compress: {
          warnings: false,
        },
        warnings: false,
      },
    })
  );
}

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
    }),
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  plugins,
});

module.exports = webpackConfig;
