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

    const args = [];
    if (argv.scene) args.push(`--scene=${argv.scene}`);

    yield this.helper.forkNode(build, args, ops);
  }

  description() {
    return 'front build';
  }
}

module.exports = FrontBuildCommand;
