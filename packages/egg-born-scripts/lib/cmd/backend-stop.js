const StopCommand = require('@zhennann/egg-scripts').StopCommand;
const utils = require('../utils.js');

class BackendStopCommand extends StopCommand {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-scripts backend-stop';
  }

  *run(context) {
    if (!context.argv.framework) {
      context.argv.framework = utils.getModulePath('egg-born-backend');
    }

    if (!context.argv._ || context.argv._.length === 0) context.argv._ = ['src/backend'];

    yield super.run(context);
  }

  description() {
    return 'backend stop';
  }
}

module.exports = BackendStopCommand;
