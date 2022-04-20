const chalk = require('chalk');
const enquirer = require('enquirer');
const { NodeVM } = require('vm2');
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
    // check
    const check = this._checkGroupCondition({ group, argv });
    if (!check) return;
    // prepare
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
    if (varsWant.length === 0) return;
    // log description
    if (group.description) {
      console.log('===>', group.description);
    }
    // prompt
    const res = yield enquirer.prompt(varsWant);
    Object.assign(argv, res);
  }

  _checkGroupCondition({ group, argv }) {
    const expression = group.condition && group.condition.expression;
    if (!expression) return true;
    return this.evaluateExpression({ expression, globals: argv });
  }

  evaluateExpression({ expression, globals, wrapper }) {
    if (!wrapper) {
      wrapper = 'none';
    } else if (wrapper === true) {
      wrapper = 'commonjs';
    }
    const vm = new NodeVM({
      console: 'inherit',
      sandbox: globals || {},
      require: false,
      nesting: true,
      wrapper,
    });
    const script = wrapper === 'none' ? `return (${expression})` : expression;
    return vm.run(script);
  }

  description() {
    return 'cli';
  }
}

module.exports = CliCommand;
