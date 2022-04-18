const path = require('path');
const chalk = require('chalk');
const babel = require('@babel/core');
const UglifyJS = require('uglify-js');
const fse = require('fs-extra');
const inquirer = require('inquirer');
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
        default: 'https://admin.cabloy.com',
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
      const res = yield inquirer.prompt(varsWant);
      Object.assign(varsReady, res);
    }

    console.log(varsReady);

    // done
    console.log(chalk.cyan('  token-add successfully!'));
  }

  description() {
    return 'token add';
  }
}

module.exports = TokenAddCommand;
