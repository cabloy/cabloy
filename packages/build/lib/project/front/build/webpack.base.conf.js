const path = require('path');
const fse = require('fs-extra');
const toolsFn = require('../../../common/tools.js');

module.exports = context => {
  const tools = toolsFn(context);
  // vue module path
  let vueModulePath = path.join(context.config.projectPath, 'node_modules/@zhennann/vue/dist/vue.esm.js');
  if (!fse.existsSync(vueModulePath)) {
    vueModulePath = path.join(context.config.frontPath, 'node_modules/@zhennann/vue/dist/vue.esm.js');
  }
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
      symlinks: false,
      extensions: ['.js', '.vue', '.json'],
      alias: {
        vue: vueModulePath,
      },
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
