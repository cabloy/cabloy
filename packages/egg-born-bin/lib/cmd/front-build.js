const path = require('path');
const Command = require('egg-bin').Command;

class FrontBuildCommand extends Command {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin front-build';
  }

  * run({ cwd, argv }) {
    console.log('run front build at %s', cwd);

    const build = require.resolve('egg-born-front/build/build.js');

    const ops = { cwd };

    const args = [];
    if (argv.scene) args.push(`--scene=${argv.scene}`);

    yield this.helper.forkNode(build, args, ops);
  }

  description() {
    return 'front build';
  }
}

module.exports = FrontBuildCommand;
