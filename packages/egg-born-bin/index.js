/*
* @Author: zhennann
* @Date:   2017-09-09 11:30:04
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-09 11:37:51
*/

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
