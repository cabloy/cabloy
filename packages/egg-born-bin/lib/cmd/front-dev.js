/*
* @Author: zhennann
* @Date:   2017-09-09 11:39:56
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-10 18:45:25
*/

const path = require('path');
const Command = require('egg-bin').Command;

class FrontDevCommand extends Command {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin front-dev';
  }

  * run({ cwd, argv }) {
    console.log('run front dev at %s', cwd);

    const devServer = path.join(cwd, 'node_modules/egg-born-front/build/dev-server.js');
    const ops = {
      cwd: path.join(cwd, 'node_modules/egg-born-front'),
    };

    yield this.helper.forkNode(devServer, [], ops);
  }

  description() {
    return 'front dev';
  }
}

module.exports = FrontDevCommand;
