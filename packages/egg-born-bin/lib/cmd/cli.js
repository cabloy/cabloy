const chalk = require('chalk');
const enquirer = require('enquirer');
const eggBornUtils = require('egg-born-utils');
const BaseCommand = require('@zhennann/common-bin');

class CliCommand extends BaseCommand {
  constructor(rawArgv, { meta, argv, openAuth, locale }) {
    super(rawArgv);
    this.usage = meta.info.usage;
    this.version = meta.info.version;
    this.options = meta.options;
    this.__groups = meta.groups;
    this.__argv = argv;
    this.__openAuth = openAuth;
    this.__locale = locale;
  }

  *run(context) {
    console.log(context);
    let { cwd, argv } = context;
    // argv
    argv = Object.assign({}, argv, this.__argv);
    // log start
    console.log(`npm run cli ${argv.cliFullName} at %s`, cwd);
    // prompt
    yield this._promptGroups({ argv, groups: this.__groups });
    // execute
    const res = yield this.__openAuth.post({
      path: '/a/cli/cli/execute',
      body: {
        context: {
          argv,
          cwd,
          env: context.env,
          rawArgv: context.rawArgv,
        },
      },
    });
    // progress
    const progressId = res.progressId;
    // progressbar
    yield this._progressbar({ progressId });
    // done
    console.log(chalk.cyan('  cli successfully!'));
  }

  *_promptGroups({ argv, groups }) {
    for (const groupName in groups) {
      const group = groups[groupName];
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
    return eggBornUtils.tools.evaluateExpression({ expression, scope: argv });
  }

  _progressbar({ progressId }) {
    return new Promise((resolve, reject) => {});
  }

  _getIOInstance() {
    _io = IOFn(adapter);
    const _subscribe = _io.subscribe;
    _io.subscribe = function (path, cbMessage, cbSubscribed, options) {
      options = options || {};
      if (options.scene === undefined) {
        options.scene = Vue.prototype.$meta.store.state.auth.clientId;
      }
      return _subscribe.call(_io, path, cbMessage, cbSubscribed, options);
    };
  }
}

module.exports = CliCommand;
