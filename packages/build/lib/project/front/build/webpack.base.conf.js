const path = require('path');
const toolsFn = require('../../../common/tools.js');

module.exports = context => {
  const tools = toolsFn(context);
  // loaderRulesResource
  const loaderRulesResource = tools.loaderRulesResource();

  return {
    entry: {
      app: path.join(context.config.frontPath, 'src/main.js'),
    },
    output: {
      path: context.config.build.assetsRoot,
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      publicPath:
        process.env.NODE_ENV === 'production'
          ? context.config.build.assetsPublicPath
          : context.config.dev.assetsPublicPath,
    },
    resolve: {
      symlinks: true,
      extensions: ['.js', '.vue', '.json'],
      alias: {},
    },
    module: {
      parser: {
        javascript: {
          // commonjsMagicComments: true,
        },
      },
      rules: [
        {
          test: /\.vue$/,
          use: [
            // { loader: 'thread-loader', options: {} },
            {
              loader: 'vue-loader',
            },
          ],
        },
        {
          test: /\.jsx$/,
          use: [
            // { loader: 'thread-loader', options: {} },
            {
              loader: 'babel-loader',
              options: context.utils.babelLoaderOptions(),
            },
          ],
        },
        ...loaderRulesResource,
      ],
    },
  };
};
