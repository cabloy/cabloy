const chalk = require('chalk');
const inquirer = require('inquirer');
const Table = require('cli-table3');
const eggBornUtils = require('egg-born-utils');
const Command = require('@zhennann/egg-bin').Command;

class TokenListCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin token-list';
    this.options = {};
  }

  *run({ cwd }) {
    console.log('run token list at %s', cwd);

    // load
    const { fileName, config } = yield eggBornUtils.openAuthConfig.load();
    // print
    const table = new Table({
      head: ['Token Name', 'Host'],
      colWidths: [30, 50],
    });
    for (const tokenName in config.tokens) {
      const token = config.tokens[tokenName];
      table.push([tokenName, token.host]);
    }
    console.log(table.toString());

    // chalk
    console.log(chalk.cyan(`\n  ${fileName}\n`));

    // done
    console.log(chalk.cyan('  token-list successfully!'));
  }

  description() {
    return 'token list';
  }
}

module.exports = TokenListCommand;
