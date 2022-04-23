const chalk = require('chalk');
const inquirer = require('inquirer');
const eggBornUtils = require('egg-born-utils');
const Command = require('@zhennann/egg-bin').Command;

class TokenDeleteCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin token-delete';
    this.options = {
      name: {
        description: 'name',
        type: 'string',
      },
    };
    this.questions = {
      name: {
        type: 'input',
        message: 'name',
      },
    };
  }

  *run({ cwd, argv }) {
    console.log('run token delete at %s', cwd);

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

    // load
    const { fileName, config } = yield eggBornUtils.openAuthConfig.load();
    if (config.tokens[varsReady.name]) {
      delete config.tokens[varsReady.name];
      // save
      yield eggBornUtils.openAuthConfig.save({ config });
    }

    // chalk
    console.log(chalk.cyan(`\n  ${fileName}\n`));

    // done
    console.log(chalk.cyan('  token-delete successfully!'));
  }

  description() {
    return 'token delete';
  }
}

module.exports = TokenDeleteCommand;
