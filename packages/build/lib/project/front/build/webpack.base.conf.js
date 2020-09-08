const path = require('path');
const fse = require('fs-extra');

module.exports = context => {

  function hasHash(file) {
    const name = path.basename(file);
    return name.split('.').length - 1 > 1;
  }

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
      publicPath: process.env.NODE_ENV === 'production'
        ? context.config.build.assetsPublicPath
        : context.config.dev.assetsPublicPath,
    },
    resolve: {
      symlinks: false,
      extensions: [ '.js', '.vue', '.json' ],
      alias: {
        vue: vueModulePath,
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
              return hasHash(file) ? context.utils.assetsPath('img/[name].[ext]') : context.utils.assetsPath('img/[name].[contenthash].[ext]');
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
              return hasHash(file) ? context.utils.assetsPath('font/[name].[ext]') : context.utils.assetsPath('font/[name].[contenthash].[ext]');
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
              return hasHash(file) ? context.utils.assetsPath('file/[name].[ext]') : context.utils.assetsPath('file/[name].[contenthash].[ext]');
            },
            esModule: false,
          },
        },
      ],
    },
  };

};
