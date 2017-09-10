const path = require('path');
const config = require('../config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob');
const fse = require('fs-extra');

exports.assetsPath = function(_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
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
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
      });
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


// copy modules
exports.copyModules = function() {
  const nodeModulesPath = path.join(__dirname, '../../node_modules');
  if (!fse.existsSync(nodeModulesPath)) {
    return console.warn('\nnot found egg-born modules.');
  }

  console.log('\ncopy modules start.');

  // copy js css
  glob(`${nodeModulesPath}/egg-born-module-*/dist/front.{js,css}`, (err, files) => {
    files.forEach(file => {
      const dest = path.join(__dirname, '__module', file.substr(nodeModulesPath.length));
      fse.copySync(file, dest);
    });
  });

  // copy static
  glob(`${nodeModulesPath}/egg-born-module-*/dist/static`, (err, files) => {
    files.forEach(file => {
      const dest = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);
      fse.copySync(file, dest);
    });
  });

  console.log('copy modules end.');
};
