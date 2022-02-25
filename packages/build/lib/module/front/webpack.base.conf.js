const path = require('path');
const toolsFn = require('../../common/tools.js');

module.exports = context => {
  const tools = toolsFn(context);
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
      extensions: ['.js', '.vue', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.esm\.js$/,
          use: {
            loader: 'babel-loader',
            options: context.utils.babelLoaderOptions(),
          },
        },
        {
          test: /\.esm\.bundle\.js$/,
          use: {
            loader: 'babel-loader',
            options: context.utils.babelLoaderOptions(),
          },
        },
        {
          test: /\.module\.js$/,
          use: {
            loader: 'babel-loader',
            options: context.utils.babelLoaderOptions(),
          },
        },
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: context.utils.babelLoaderOptions(),
          },
          include: [path.join(context.modulePath, 'front/src')],
        },
        {
          test: /\.jsx$/,
          use: {
            loader: 'babel-loader',
            options: context.utils.babelLoaderOptions(),
          },
          include: [path.join(context.modulePath, 'front/src')],
        },
        {
          test: /\.svg(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: false,
            name(file) {
              return tools.combineSvgFileName(file);
            },
            esModule: false,
          },
        },
        {
          test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 1000,
            name(file) {
              return tools.combineHashFileName(file, 'img');
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
              return tools.combineHashFileName(file, 'font');
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
              return tools.combineHashFileName(file, 'file');
            },
            esModule: false,
          },
        },
      ],
    },
  };
};
