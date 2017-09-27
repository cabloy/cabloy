/*
* @Author: zhennann
* @Date:   2017-09-15 22:51:21
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-16 21:08:27
*/

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
