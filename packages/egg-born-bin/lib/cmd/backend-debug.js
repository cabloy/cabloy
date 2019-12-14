const DebugCommand = require('egg-bin').DebugCommand;
const utils = require('../utils.js');

class BackendDebugCommand extends DebugCommand {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin backend-debug';
  }

  * run(context) {

    if (!context.argv.baseDir) context.argv.baseDir = 'src/backend';

    utils.versionCheck('cabloy', 'debug').then(data => {
      utils.versionPrompt('cabloy', data);
    });

    yield super.run(context);

  }

  description() {
    return 'backend debug';
  }

}

module.exports = BackendDebugCommand;
