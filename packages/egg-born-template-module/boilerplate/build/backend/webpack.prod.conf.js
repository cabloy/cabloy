const webpack = require('webpack');
const config = require('./config.js');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const env = config.build.env;

const plugins = [
// http://vuejs.github.io/vue-loader/en/workflow/production.html
  new webpack.DefinePlugin({
    'process.env': env,
  }),
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
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  plugins,
});

module.exports = webpackConfig;
