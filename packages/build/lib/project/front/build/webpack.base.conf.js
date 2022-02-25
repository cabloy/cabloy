const path = require('path');
const fse = require('fs-extra');

module.exports = context => {
  const svg_pattern1 = /\/([^\/]+)\/front\/src\/assets\/icons\/groups\/([^\/]+)\.svg/;
  const svg_pattern2 = /icon\/([^\/]+)_([^\/]+)\.svg/;
  function hasHash(file) {
    file = file.replace(/\\/g, '/');
    const name = path.basename(file);
    return name.split('.').length - 1 > 1;
  }
  function combineHashFileName(file, dirname) {
    return hasHash(file)
      ? context.utils.assetsPath(`${dirname}/[name].[ext]`)
      : context.utils.assetsPath(`${dirname}/[name].[contenthash].[ext]`);
  }
  function combineSvgFileName(file) {
    file = file.replace(/\\/g, '/');
    let match = file.match(svg_pattern1);
    if (!match) {
      match = file.match(svg_pattern2);
    }
    if (match) {
      return `icon/${match[1]}_${match[2]}.svg`;
    }
    // default is img
    return combineHashFileName(file, 'img');
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
              return combineSvgFileName(file);
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
              return combineHashFileName(file, 'img');
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
              return combineHashFileName(file, 'font');
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
              return combineHashFileName(file, 'file');
            },
            esModule: false,
          },
        },
      ],
    },
  };
};
