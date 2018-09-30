const DevCommand = require('egg-bin').DevCommand;

class BackendDevCommand extends DevCommand {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin backend-dev';
  }

  * run(context) {

    if (!context.argv.baseDir) context.argv.baseDir = 'src/backend';

    yield super.run(context);

  }

  description() {
    return 'backend dev';
  }

}

module.exports = BackendDevCommand;
