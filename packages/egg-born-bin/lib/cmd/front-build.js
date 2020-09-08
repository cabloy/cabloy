const path = require('path');
const Command = require('egg-bin').Command;

class FrontBuildCommand extends Command {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin front-build';
  }

  * run({ cwd, argv }) {
    console.log('run front build at %s', cwd);

    const frontFile = require.resolve('egg-born-front/package.json');
    const frontPath = path.dirname(frontFile);
    const projectPath = cwd;
    const scene = argv.scene;

    const build = require('@zhennann/build');
    build.project.front.build({
      frontPath, projectPath, scene,
    });
  }

  description() {
    return 'front build';
  }
}

module.exports = FrontBuildCommand;
