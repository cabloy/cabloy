const StartCommand = require('egg-scripts').StartCommand;
const utils = require('../utils.js');

class BackendStartCommand extends StartCommand {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-scripts backend-start';
  }

  * run(context) {

    if (context.argv.sticky === undefined) context.argv.sticky = true;

    if (!context.argv._ || context.argv._.length === 0) context.argv._ = [ 'src/backend' ];

    utils.versionCheck('cabloy', 'start').then(data => {
      utils.versionPrompt('cabloy', data);
    });

    yield super.run(context);

  }

  description() {
    return 'backend start';
  }

}

module.exports = BackendStartCommand;
