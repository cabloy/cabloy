const path = require('path');
const fse = require('fs-extra');
const utils = require('./utils');
const config = require('../config');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

function hasHash(file) {
  const name = path.basename(file);
  return name.split('.').length - 1 > 1;
}

// vue module path
let vueModulePath = resolve('../@zhennann/vue/dist/vue.esm.js');
if (!fse.existsSync(vueModulePath)) {
  vueModulePath = resolve('node_modules/@zhennann/vue/dist/vue.esm.js');
}

module.exports = {
  entry: {
    app: resolve('src/main.js'),
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
  },
  resolve: {
    extensions: [ '.js', '.vue', '.json' ],
    alias: {
      vue: vueModulePath,
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name(file) {
            return hasHash(file) ? utils.assetsPath('img/[name].[ext]') : utils.assetsPath('img/[name].[hash].[ext]');
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name(file) {
            return hasHash(file) ? utils.assetsPath('fonts/[name].[ext]') : utils.assetsPath('fonts/[name].[hash].[ext]');
          },
        },
      },
    ],
  },
};
