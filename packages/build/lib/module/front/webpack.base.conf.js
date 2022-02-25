const path = require('path');
const toolsFn = require('../../common/tools.js');

module.exports = context => {
  const tools = toolsFn(context);
  const moduleInfo = context.utils.parseInfoFromPackage();
  const libraryName = moduleInfo.relativeName;
  // loaderRulesResource
  const loaderRulesResource = tools.loaderRulesResource();

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
        ...loaderRulesResource,
      ],
    },
  };
};
