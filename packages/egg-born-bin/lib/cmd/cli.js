const chalk = require('chalk');
const inquirer = require('inquirer');
const BaseCommand = require('@zhennann/common-bin');

class CliCommand extends BaseCommand {
  constructor(rawArgv, { meta, argv }) {
    super(rawArgv);
    this.usage = meta.info.usage;
    this.version = meta.info.version;
    this.options = meta.options;
    this.groups = meta.groups;
    this.__argv = argv;
  }

  *run(context) {
    let { cwd, argv } = context;
    // argv
    argv = Object.assign({}, argv, this.__argv);
    // log start
    console.log(`npm run cli ${argv.cliFullName} at %s`, cwd);
    // prompt
    yield this._promptGroups({ argv });
    console.log(argv);

    // done
    console.log(chalk.cyan('  cli successfully!'));
  }

  *_promptGroups({ argv }) {
    for (const groupName in this.groups) {
      const group = this.groups[groupName];
      yield this._promptGroup({ group, argv });
    }
  }

  *_promptGroup({ group, argv }) {
    const varsWant = [];
    for (const key in group.questions) {
      const value = argv[key];
      if (value !== undefined) continue;
      const question = group.questions[key];
      varsWant.push({
        name: key,
        ...question,
      });
    }
    if (varsWant.length > 0) {
      const res = yield inquirer.prompt(varsWant);
      Object.assign(argv, res);
    }
  }

  description() {
    return 'cli';
  }
}

module.exports = CliCommand;
