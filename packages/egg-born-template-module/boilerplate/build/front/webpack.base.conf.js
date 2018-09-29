const path = require('path');
const utils = require('./utils');
const config = require('./config.js');

function resolve(dir) {
  return path.join(__dirname, '../../front', dir);
}

module.exports = {
  entry: {
    front: resolve('src/main.js'),
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: config.build.assetsPublicPath,
    library: 'front',
    libraryTarget: 'commonjs2',
  },
  externals: {
    vue: 'vue',
  },
  resolve: {
    extensions: [ '.js', '.vue', '.json' ],
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
        include: [ resolve('src') ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: utils.assetsPath('img/[name].[hash].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: utils.assetsPath('fonts/[name].[hash].[ext]'),
        },
      },
    ],
  },
};
