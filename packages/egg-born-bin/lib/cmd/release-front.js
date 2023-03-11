const ReleaseCommand = require('./release.js');

class ReleaseFrontCommand extends ReleaseCommand {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin release-front';
  }

  *run({ cwd, argv }) {
    argv.type = 'front';
    yield super.run({ cwd, argv });
  }

  description() {
    return 'release front';
  }
}

module.exports = ReleaseFrontCommand;
