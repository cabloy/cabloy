// const path = require('path');
const chalk = require('chalk');
// const fse = require('fs-extra');
const Command = require('@zhennann/egg-bin').Command;

class ReleaseCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin release';
  }

  *run({ cwd, argv }) {
    console.log('run release at %s', cwd);

    console.log(argv);
    const files = argv._;
    for (const file of files) {
      console.log(file);
    }
    // done
    console.log(chalk.cyan('  release successfully!'));
  }

  description() {
    return 'release';
  }
}

module.exports = ReleaseCommand;
