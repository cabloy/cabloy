require('./check-versions')();

process.env.NODE_ENV = 'production';

const ora = require('ora');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');
const utils = require('./utils.js');
const fse = require('fs-extra');

const spinner = ora('building for production...');
spinner.start();

fse.removeSync(config.build.assetsRoot);
fse.ensureDirSync(config.build.assetsRoot);

utils.copyModules().then(() => {
  webpack(webpackConfig, function(err, stats) {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    }) + '\n\n');

    const sceneValue = JSON.parse(config.build.env.SCENE);
    const dest = path.join(config.projectPath, `dist${sceneValue ? '/' + sceneValue : ''}`);
    fse.removeSync(path.join(dest, 'index.html'));
    fse.removeSync(path.join(dest, 'static'));
    fse.copySync(config.build.assetsRoot, dest);

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ));
  });
});

