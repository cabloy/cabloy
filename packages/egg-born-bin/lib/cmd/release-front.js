const ReleaseCommand = require('./release.js');

class ReleaseFrontCommand extends ReleaseCommand {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin release-front';
    this.type = 'front';
  }

  description() {
    return 'release front';
  }
}

module.exports = ReleaseFrontCommand;
