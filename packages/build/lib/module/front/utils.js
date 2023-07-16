const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const mparse = require('egg-born-mparse').default;

module.exports = context => {
  return {
    assetsPath(_path) {
      return path.join(context.config.build.assetsSubDirectory, _path);
    },
    cssLoaders(options) {
      options = options || {};

      const cssLoader = {
        loader: 'css-loader',
        options: {
          sourceMap: options.sourceMap,
          esModule: false,
        },
      };

      // generate loader string to be used with extract text plugin
      function generateLoaders(loader, loaderOptions) {
        const loaders = [cssLoader];
        if (loader) {
          loaders.push({
            loader: loader + '-loader',
            options: Object.assign({}, loaderOptions, {
              sourceMap: options.sourceMap,
            }),
          });
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        // if (options.extract) {
        //   return [ MiniCssExtractPlugin.loader ].concat(loaders);
        // }
        const vueStyleLoader = {
          loader: '@zhennann/vue-style-loader',
          // options: {
          //   isGlobal: false,
          // },
        };
        return [vueStyleLoader].concat(loaders);
      }

      // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
      return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less', { lessOptions: { javascriptEnabled: true } }),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus'),
      };
    },

    // Generate loaders for standalone style files (outside of .vue)
    styleLoaders(options) {
      const output = [];
      const loaders = this.cssLoaders(options);
      for (const extension in loaders) {
        const loader = loaders[extension];
        output.push({
          test: new RegExp('\\.' + extension + '$'),
          use: loader,
        });
      }
      return output;
    },
    parseInfoFromPackage() {
      const pkg = require(path.join(context.modulePath, 'package.json'));
      return mparse.parseInfo(mparse.parseName(pkg.name));
    },
    babelLoaderOptions() {
      return {
        babelrc: false,
        presets: [
          '@vue/babel-preset-jsx',
          [
            '@babel/preset-env',
            {
              modules: false,
              useBuiltIns: false,
            },
          ],
        ],
        plugins: ['@babel/plugin-syntax-dynamic-import', 'jsx-v-model'],
      };
    },
  };
};
