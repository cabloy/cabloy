const StartCommand = require('egg-scripts').StartCommand;

class BackendStartCommand extends StartCommand {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-scripts backend-start';
  }

  * run(context) {

    if (!context.argv._ || context.argv._.length === 0) context.argv._ = [ 'src/backend' ];

    yield super.run(context);

  }

  description() {
    return 'backend start';
  }

}

module.exports = BackendStartCommand;
