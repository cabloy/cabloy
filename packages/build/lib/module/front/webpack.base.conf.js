const path = require('path');

module.exports = context => {

  const moduleInfo = context.utils.parseInfoFromPackage();
  const libraryName = moduleInfo.relativeName;

  return {
    entry: {
      front: path.join(context.modulePath, 'front/src/main.js'),
    },
    output: {
      path: context.config.build.assetsRoot,
      filename: '[name].js',
      publicPath: context.config.build.assetsPublicPath,
      library: libraryName,
      libraryTarget: 'window',
    },
    externals: {
      vue: 'Vue',
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
          include: [ path.join(context.modulePath, 'front/src') ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            limit: 1000,
            name: context.utils.assetsPath('img/[name].[contenthash].[ext]'),
            esModule: false,
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            limit: 1000,
            name: context.utils.assetsPath('fonts/[name].[contenthash].[ext]'),
            esModule: false,
          },
        },
      ],
    },
  };

};

