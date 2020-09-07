const ora = require('ora');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const configFn = require('../config');
const webpackConfigFn = require('./webpack.prod.conf');
const utilsFn = require('./utils.js');
const fse = require('fs-extra');

process.env.NODE_ENV = 'production';

module.exports = ({ projectPath, frontPath, scene }) => {

  // context
  const context = {
    projectPath,
    frontPath,
    scene,
  };
  // config
  context.config = configFn(context);
  // utils
  context.utils = utilsFn(context);

  const spinner = ora('building for production...');
  spinner.start();

  fse.removeSync(context.config.build.assetsRoot);
  fse.ensureDirSync(context.config.build.assetsRoot);

  context.utils.copyModules();

  webpack(webpackConfigFn(context), function(err, stats) {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    }) + '\n\n');

    const sceneValue = JSON.parse(context.config.build.env.SCENE);
    const dest = path.join(context.config.projectPath, `dist${sceneValue ? '/' + sceneValue : ''}`);
    fse.removeSync(path.join(dest, 'index.html'));
    fse.removeSync(path.join(dest, 'static'));
    fse.copySync(context.config.build.assetsRoot, dest);

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ));
  });
};
