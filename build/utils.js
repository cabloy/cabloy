const path = require('path');
const config = require('../config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');
const bb = require('bluebird');
const fse = require('fs-extra');
const chalk = require('chalk');
const mparse = require('egg-born-mparse').default;

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
      sourceMap: options.sourceMap,
      esModule: false,
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

// copy modules
exports.copyModules = async function() {

  const modulesLocal = {};
  const modulesGlobal = {};

  // path
  const projectPath = path.join(__dirname, '../../..');
  const nodeModulesPath = path.join(__dirname, '../..');

  // clear
  fse.emptyDirSync(path.join(__dirname, '__runtime'));
  fse.emptyDirSync(path.join(__dirname, '__runtime/modules'));

  // local modules
  let files = await bb.fromCallback(cb => {
    glob(`${projectPath}/src/module/*`, cb);
  });
  files.forEach(modulePath => {
    const moduleName = modulePath.substr(projectPath.length + '/src/module/'.length);
    const moduleInfo = mparse.parseInfo(moduleName);
    modulesLocal[moduleInfo.relativeName] = true;
  });

  // global modules
  files = await bb.fromCallback(cb => {
    glob(`${nodeModulesPath}/egg-born-module-*`, cb);
  });
  files.forEach(modulePath => {
    const moduleName = modulePath.substr(nodeModulesPath.length + '/egg-born-module-'.length);
    const moduleInfo = mparse.parseInfo(moduleName);
    if (!modulesLocal[moduleInfo.relativeName]) {
      modulesGlobal[moduleInfo.relativeName] = true;
      // copy js
      let fileSrc = `${modulePath}/dist/front.js`;
      let fileDest = path.join(__dirname, '__runtime/modules', modulePath.substr(nodeModulesPath.length + '/egg-born-module-'.length) + '/dist/front.js');
      fse.copySync(fileSrc, fileDest);
      // copy static
      fileSrc = `${modulePath}/dist/static`;
      fileDest = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);
      if (fse.existsSync(fileSrc)) fse.copySync(fileSrc, fileDest);
      fileDest = path.join(__dirname, '__runtime/modules', modulePath.substr(nodeModulesPath.length + '/egg-born-module-'.length) + '/dist/static');
      if (fse.existsSync(fileSrc)) fse.copySync(fileSrc, fileDest);
    }
  });

  // save to modules.js
  const modulesJS =
`export default {
  modulesLocal: ${JSON.stringify(modulesLocal)},
  modulesGlobal: ${JSON.stringify(modulesGlobal)},
}
`;
  fse.outputFileSync(path.join(__dirname, '__runtime/modules.js'), modulesJS);

  // log
  console.log(chalk.yellow('\n=== Local Modules ==='));
  for (const key in modulesLocal) {
    console.log(chalk.cyan('> ' + key));
  }
  console.log(chalk.yellow('\n=== Global Modules ==='));
  for (const key in modulesGlobal) {
    console.log(chalk.cyan('> ' + key));
  }
  console.log('\n');

};

// get index.ejs
exports.getIndexPath = function() {
  const index = path.join(__dirname, '../../../src/front/index.ejs');
  if (fse.existsSync(index)) return index;
  return path.join(__dirname, '../index.ejs');
};
