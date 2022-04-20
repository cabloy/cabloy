const chalk = require('chalk');
const inquirer = require('inquirer');
const BaseCommand = require('@zhennann/common-bin');

class CliCommand extends BaseCommand {
  constructor(rawArgv, { meta }) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin cli';
    this.version = '2.0.0';
    this.options = {};
    this.questions = {
      // name: {
      //   type: 'input',
      //   message: 'name',
      // },
    };
  }

  *run({ cwd, argv }) {
    console.log('run cli at %s', cwd);

    console.log(argv);

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
    console.log(varsReady);

    // done
    console.log(chalk.cyan('  cli successfully!'));
  }

  description() {
    return 'cli';
  }
}

module.exports = CliCommand;
