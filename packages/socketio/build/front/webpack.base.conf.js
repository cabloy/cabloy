const path = require('path');
const utils = require('./utils');

function resolve(dir) {
  return path.join(__dirname, '../..', dir);
}

module.exports = function (config) {
  return {
    entry: {
      socketio: resolve('src/main.js'),
    },
    output: {
      path: config.build.assetsRoot,
      filename: config.build.filename,
      publicPath: config.build.assetsPublicPath,
      library: config.build.library,
      libraryTarget: config.build.libraryTarget,
    },
    externals: {
      vue: 'vue',
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
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
          test: /\.esm\.js$/,
          loader: 'babel-loader',
        },
        {
          test: /\.esm\.bundle\.js$/,
          loader: 'babel-loader',
        },
        {
          test: /\.module\.js$/,
          loader: 'babel-loader',
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolve('src')],
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash].[ext]'),
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash].[ext]'),
          },
        },
      ],
    },
  };
};
