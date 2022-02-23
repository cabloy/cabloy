const chalk = require('chalk');
const Command = require('@zhennann/egg-bin').Command;

class ToolsIconsCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin tools-icons';
  }

  *run({ cwd, argv }) {
    console.log('run tools icons at %s', cwd);

    const modules = argv._;
    for (const module of modules) {
      console.log(module);
    }
    // done
    console.log(chalk.cyan('  tools-icons successfully!'));
  }

  description() {
    return 'tools icons';
  }
}

module.exports = ToolsIconsCommand;
