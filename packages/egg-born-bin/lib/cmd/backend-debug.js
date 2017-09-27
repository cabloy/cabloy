/*
* @Author: zhennann
* @Date:   2017-09-16 21:08:09
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-16 21:10:33
*/

const DebugCommand = require('egg-bin').DebugCommand;

class BackendDebugCommand extends DebugCommand {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin backend-debug';
  }

  * run(context) {

    if (!context.argv.baseDir) context.argv.baseDir = 'src/backend';

    yield super.run(context);

  }

  description() {
    return 'backend debug';
  }

}

module.exports = BackendDebugCommand;
