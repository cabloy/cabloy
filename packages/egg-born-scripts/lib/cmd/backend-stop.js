const StopCommand = require('egg-scripts').StopCommand;

class BackendStopCommand extends StopCommand {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-scripts backend-stop';
  }

  * run(context) {

    if (!context.argv._ || context.argv._.length === 0) context.argv._ = [ 'src/backend' ];

    yield super.run(context);

  }

  description() {
    return 'backend stop';
  }

}

module.exports = BackendStopCommand;
