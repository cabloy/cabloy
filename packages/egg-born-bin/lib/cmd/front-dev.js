const path = require('path');
const Command = require('egg-bin').Command;

class FrontDevCommand extends Command {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin front-dev';
  }

  * run({ cwd, argv }) {
    console.log('run front dev at %s', cwd);

    const frontFile = require.resolve('egg-born-front/package.json');
    const frontPath = path.dirname(frontFile);
    const projectPath = cwd;
    const scene = argv.scene;

    const build = require('@zhennann/build');
    build.project.front.dev({
      frontPath, projectPath, scene,
    });
  }

  description() {
    return 'front dev';
  }
}

module.exports = FrontDevCommand;
