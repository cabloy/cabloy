const path = require('path');
const chalk = require('chalk');
const mock = require('egg-mock');
const TestCommand = require('@zhennann/egg-bin').TestCommand;
const utils = require('../utils.js');

class BackendDbResetCommand extends TestCommand {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin backend-db-reset';
  }

  *run(context) {
    if (context.argv.timeout === undefined) context.argv.timeout = 3600 * 1000;

    if (!context.env.EGG_BASE_DIR) context.env.EGG_BASE_DIR = path.join(process.cwd(), 'src/backend');
    if (!context.env.EGG_FRAMEWORK) context.env.EGG_FRAMEWORK = utils.getModulePath('egg-born-backend');

    // options
    const options = {};
    options.baseDir = context.env.EGG_BASE_DIR;
    options.framework = context.env.EGG_FRAMEWORK;

    // check dev server
    const devServerRunning = yield utils.checkIfDevServerRunning({
      warnWhenRunning: true,
    });
    if (devServerRunning) return;

    // env
    mock.env('unittest');
    // app
    const app = mock.app(options);
    yield app.ready();

    // check app ready
    yield app.meta.checkAppReady();

    // done
    console.log(chalk.cyan('  backend-db-reset successfully!'));
    process.exit(0);
  }

  description() {
    return 'backend db reset';
  }
}

module.exports = BackendDbResetCommand;
