const DevCommand = require('egg-bin').DevCommand;
const utils = require('../utils.js');

class BackendDevCommand extends DevCommand {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin backend-dev';
  }

  * run(context) {

    if (!context.argv.baseDir) context.argv.baseDir = 'src/backend';

    utils.versionCheck('cabloy', 'dev').then(data => {
      utils.versionPrompt('cabloy', data);
    });

    yield super.run(context);

  }

  description() {
    return 'backend dev';
  }

}

module.exports = BackendDevCommand;
