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
          loader: 'vue-loader',
        },
        {
          test: /\.jsx$/,
          use: {
            loader: 'babel-loader',
            options: context.utils.babelLoaderOptions(),
          },
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
