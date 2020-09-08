const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const fse = require('fs-extra');
const configFn = require('./config.js');
const webpackConfigFn = require('./webpack.prod.conf');

module.exports = ({ modulePath }) => {

  // context
  const context = {
    modulePath,
  };
  // config
  context.config = configFn(context);

  process.env.NODE_ENV = 'production';

  const spinner = ora('building for production...');
  spinner.start();

  const destPath = context.config.build.assetsRoot;

  rm(path.join(destPath, 'backend.*'), err => {
    if (err) throw err;
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

      const srcStatic = path.join(context.modulePath, 'backend/src/static');
      if (fse.existsSync(srcStatic)) {
        const destStatic = path.join(destPath, context.config.build.assetsSubDirectory);
        fse.removeSync(destStatic);
        fse.copySync(srcStatic, destStatic);
      }

      console.log(chalk.cyan('  Build complete.\n'));
    });
  });

};
