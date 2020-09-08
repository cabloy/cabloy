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
let vueModulePath = path.join(config.projectPath, 'node_modules/@zhennann/vue/dist/vue.esm.js');
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
    symlinks: false,
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
            return hasHash(file) ? utils.assetsPath('img/[name].[ext]') : utils.assetsPath('img/[name].[contenthash].[ext]');
          },
          esModule: false,
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name(file) {
            return hasHash(file) ? utils.assetsPath('fonts/[name].[ext]') : utils.assetsPath('fonts/[name].[contenthash].[ext]');
          },
          esModule: false,
        },
      },
      {
        test: /\.(doc|docx|xlsx?|odt|pdf|mp3|wma|wav|iso|ppt|pptx|csv|apk|exe|rar|zip|tar\.gz)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: false,
          name(file) {
            return hasHash(file) ? utils.assetsPath('file/[name].[ext]') : utils.assetsPath('file/[name].[contenthash].[ext]');
          },
          esModule: false,
        },
      },
    ],
  },
};
