const chalk = require('chalk');
const enquirer = require('enquirer');
const eggBornUtils = require('egg-born-utils');
const Command = require('@zhennann/egg-bin').Command;

class TokenAddCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin token-add';
    this.options = {
      name: {
        description: 'name',
        type: 'string',
      },
      host: {
        description: 'host',
        type: 'string',
      },
      clientID: {
        description: 'clientID',
        type: 'string',
      },
      clientSecret: {
        description: 'clientSecret',
        type: 'string',
      },
    };
    this.questions = {
      name: {
        type: 'input',
        message: 'name',
      },
      host: {
        type: 'input',
        message: 'host',
        default: 'https://portal.cabloy.com',
      },
      clientID: {
        type: 'input',
        message: 'clientID',
      },
      clientSecret: {
        type: 'input',
        message: 'clientSecret',
      },
    };
  }

  *run({ cwd, argv }) {
    console.log('run token add at %s', cwd);

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
      const res = yield enquirer.prompt(varsWant);
      Object.assign(varsReady, res);
    }

    // load
    const { fileName, config } = yield eggBornUtils.openAuthConfig.load();
    config.tokens[varsReady.name] = {
      host: varsReady.host,
      clientID: varsReady.clientID,
      clientSecret: varsReady.clientSecret,
    };
    // save
    yield eggBornUtils.openAuthConfig.save({ config });

    // chalk
    console.log(chalk.cyan(`\n  ${fileName}\n`));

    // done
    console.log(chalk.cyan('  token-add successfully!'));
  }

  description() {
    return 'token add';
  }
}

module.exports = TokenAddCommand;
