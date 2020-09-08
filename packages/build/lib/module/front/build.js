const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const configFn = require('./config.js');
const webpackConfigFn = require('./webpack.prod.conf');
const utilsFn = require('./utils.js');

module.exports = ({ modulePath }) => {

  // context
  const context = {
    modulePath,
  };
  // config
  context.config = configFn(context);
  // utils
  context.utils = utilsFn(context);

  process.env.NODE_ENV = 'production';

  const spinner = ora('building for production...');
  spinner.start();

  const destPath = context.config.build.assetsRoot;

  rm(path.join(destPath, 'front.*'), err => {
    if (err) throw err;

    rm(path.join(destPath, context.config.build.assetsSubDirectory), err => {
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

        console.log(chalk.cyan('  Build complete.\n'));
      });
    });

  });

};

