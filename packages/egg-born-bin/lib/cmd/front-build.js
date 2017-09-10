/*
* @Author: zhennann
* @Date:   2017-09-09 12:01:49
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-10 18:45:09
*/

const path = require('path');
const Command = require('egg-bin').Command;

class FrontBuildCommand extends Command {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin front-build';
  }

  * run({ cwd, argv }) {
    console.log('run front build at %s', cwd);

    const build = path.join(cwd, 'node_modules/egg-born-front/build/build.js');
    const ops = {
      cwd: path.join(cwd, 'node_modules/egg-born-front'),
    };

    yield this.helper.forkNode(build, [], ops);
  }

  description() {
    return 'front build';
  }
}

module.exports = FrontBuildCommand;
