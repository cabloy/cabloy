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

    const args = [];
    if (argv.scene) args.push(`--scene=${argv.scene}`);

    yield this.helper.forkNode(devServer, args, ops);
  }

  description() {
    return 'front dev';
  }
}

module.exports = FrontDevCommand;
