const StartCommand = require('egg-scripts').StartCommand;
const utils = require('../utils.js');

class BackendStartCommand extends StartCommand {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-scripts backend-start';
  }

  *run(context) {
    if (!context.argv.framework) {
      context.argv.framework = utils.getModulePath('egg-born-backend');
    }

    // need not sticky
    // if (context.argv.sticky === undefined) context.argv.sticky = true;

    if (!context.argv._ || context.argv._.length === 0) context.argv._ = ['src/backend'];

    if (!context.argv.title) {
      context.argv.title = `cabloy-server-${utils.getAppPackage().name}`;
    }

    utils.versionCheckCabloy({ scene: 'start' }).then(() => {});

    yield super.run(context);
  }

  description() {
    return 'backend start';
  }
}

module.exports = BackendStartCommand;
