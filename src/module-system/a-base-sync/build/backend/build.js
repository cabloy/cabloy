process.env.NODE_ENV = 'production';

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const fse = require('fs-extra');
const config = require('./config.js');
const webpackConfig = require('./webpack.prod.conf');

function resolve(dir) {
  return path.join(__dirname, '../../backend', dir);
}

const spinner = ora('building for production...');
spinner.start();

const destPath = config.build.assetsRoot;

rm(path.join(destPath, 'backend.*'), err => {
  if (err) throw err;
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

    const destStatic = path.join(destPath, config.build.assetsSubDirectory);
    fse.removeSync(destStatic);
    fse.copySync(resolve('src/static'), destStatic);

    console.log(chalk.cyan('  Build complete.\n'));
  });
});
