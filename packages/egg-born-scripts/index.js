const path = require('path');
const Command = require('egg-bin').Command;

class EggBornBinCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin [command] [options]';

    // load directory
    this.load(path.join(__dirname, 'lib/cmd'));
  }
}

module.exports = EggBornBinCommand;
