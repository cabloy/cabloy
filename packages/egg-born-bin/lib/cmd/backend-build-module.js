const Command = require('egg-bin').Command;

class BackendBuildCommand extends Command {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin backend-build-module';
  }

  * run({ cwd }) {
    console.log('run backend build at %s', cwd);

    const modulePath = cwd;

    const build = require('@zhennann/build');
    build.module.backend.build({
      modulePath,
    });
  }

  description() {
    return 'backend build';
  }
}

module.exports = BackendBuildCommand;
