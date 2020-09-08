const Command = require('egg-bin').Command;

class FrontBuildCommand extends Command {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin front-build-module';
  }

  * run({ cwd }) {
    console.log('run front build at %s', cwd);

    const modulePath = cwd;

    const build = require('@zhennann/build');
    build.module.front.build({
      modulePath,
    });
  }

  description() {
    return 'front build';
  }
}

module.exports = FrontBuildCommand;
