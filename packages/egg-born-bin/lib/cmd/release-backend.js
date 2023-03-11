const ReleaseCommand = require('./release.js');

class ReleaseBackendCommand extends ReleaseCommand {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin release-backend';
    this.type = 'backend';
  }

  description() {
    return 'release backend';
  }
}

module.exports = ReleaseBackendCommand;
