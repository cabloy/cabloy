const path = require('path');
const config = require('./config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const mparse = require('egg-born-mparse').default;
const fse = require('fs-extra');

exports.assetsPath = function(_path) {
  return path.join(config.build.assetsSubDirectory, _path);
};

exports.cssLoaders = function(options) {
  options = options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap,
    },
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = [ cssLoader ];
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
    if (options.extract) {
      return [ MiniCssExtractPlugin.loader ].concat(loaders);
    }
    return [ 'vue-style-loader' ].concat(loaders);
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus'),
  };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
  const output = [];
  const loaders = exports.cssLoaders(options);
  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader,
    });
  }
  return output;
};

exports.parseInfoFromPackage = function(dir) {
  const file = lookupPackage(dir);
  if (!file) return null;
  const pkg = require(file);
  return mparse.parseInfo(mparse.parseName(pkg.name));
};

function lookupPackage(dir) {
  let _dir = dir;
  // eslint-disable-next-line
    while (true) {
    const file = path.join(_dir, 'package.json');
    if (file === '/package.json') return null;
    if (fse.existsSync(file)) return file;
    _dir = path.join(_dir, '../');
  }
}
