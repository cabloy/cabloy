const chalk = require('chalk');
const inquirer = require('inquirer');
const Command = require('@zhennann/egg-bin').Command;

class CliCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin cli';
    this.options = {};
  }

  *run({ cwd, argv }) {
    console.log('run cli at %s', cwd);

    const varsReady = {};
    const varsWant = [];
    for (const key in this.questions) {
      const value = argv[key];
      if (value !== undefined) {
        varsReady[key] = value;
      } else {
        const question = this.questions[key];
        varsWant.push({
          name: key,
          ...question,
        });
      }
    }
    if (varsWant.length > 0) {
      const res = yield inquirer.prompt(varsWant);
      Object.assign(varsReady, res);
    }

    // done
    console.log(chalk.cyan('  cli successfully!'));
  }

  description() {
    return 'cli';
  }
}

module.exports = CliCommand;
