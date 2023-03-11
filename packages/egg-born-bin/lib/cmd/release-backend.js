const ReleaseCommand = require('./release.js');

class ReleaseBackendCommand extends ReleaseCommand {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin release-backend';
  }

  *run({ cwd, argv }) {
    argv.type = 'backend';
    yield super.run({ cwd, argv });
  }

  description() {
    return 'release backend';
  }
}

module.exports = ReleaseBackendCommand;
