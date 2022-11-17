const is = require('is-type-of');
const chalk = require('chalk');
const enquirer = require('enquirer');
const uuid = require('uuid');
const eggBornUtils = require('egg-born-utils');
const BaseCommand = require('@zhennann/common-bin');
const SocketIO = require('@zhennann/socketio').default;
const AdapterFn = require('../adapter.js');

const __envFields = ['TERM', 'TERM_PROGRAM', 'TERM_PROGRAM_VERSION', 'SHELL', 'COLOR', 'LANG', 'npm_config_registry'];

class CliCommand extends BaseCommand {
  constructor(rawArgv, { meta, argv, openAuthClient }) {
    super(rawArgv);
    this.usage = meta.info.usage;
    this.version = meta.info.version;
    this.options = meta.options;
    this.__meta = meta;
    this.__groups = meta.groups;
    this.__argv = argv;
    this.__openAuthClient = openAuthClient;
    this.__cabloyConfig = null;
    this.cabloyConfig = null;
  }

  *run({ argv, cwd, env, rawArgv }) {
    // argv
    argv = Object.assign({}, argv, this.__argv);
    delete argv.t;
    delete argv.token;
    delete argv.$0;
    // context
    const context = { argv, cwd, env: this._adjustEnv({ env }), rawArgv };
    // log start
    console.log(`npm run cli ${chalk.cyan(argv.cliFullName)} at %s\n`, cwd);
    // cabloy config
    yield this._loadCabloyConfig();
    // log meta welcomes
    this._logMetaWelcomes();
    // prompt
    yield this._promptGroups({ context, groups: this.__groups });
    // execute
    const progressId = uuid.v4().replace(/-/g, '');
    // progressbar
    yield this._progressbar({ progressId, context });
    // done
    console.log(chalk.cyan('\n  cli successfully!\n'));
  }

  *_loadCabloyConfig() {
    this.__cabloyConfig = eggBornUtils.cabloyConfig;
    yield this.__cabloyConfig.load({ projectPath: this.__argv.projectPath });
    this.cabloyConfig = this.__cabloyConfig.get();
  }

  _getMetaWelcomes() {
    let welcomes = this.__meta.info.welcomes;
    if (!welcomes) return null;
    if (!Array.isArray(welcomes)) welcomes = [welcomes];
    if (welcomes.length === 0) return null;
    return welcomes;
  }

  _logMetaWelcomes() {
    const welcomes = this._getMetaWelcomes();
    if (!welcomes) return;
    for (const welcome of welcomes) {
      console.log(welcome);
      console.log('');
    }
  }

  _adjustEnv({ env }) {
    const res = {};
    for (const field of __envFields) {
      if (env[field]) res[field] = env[field];
    }
    return res;
  }

  *_promptGroups({ context, groups }) {
    for (const groupName in groups) {
      const group = groups[groupName];
      yield this._promptGroup({ group, context });
    }
  }

  *_promptGroup({ group, context }) {
    const { argv } = context;
    // check
    const check = this._checkGroupCondition({ group, context });
    if (!check) return;
    // prepare
    const varsWant = [];
    for (const key in group.questions) {
      const value = argv[key];
      if (value !== undefined) continue;
      const question = group.questions[key];
      const varWant = this._prepareQuestion({ group, question, key, context });
      if (varWant) {
        varsWant.push(varWant);
      }
    }
    if (varsWant.length === 0) return;
    // log description
    if (group.description) {
      console.log('===>', group.description);
    }
    // prompt
    yield enquirer.prompt(varsWant);
  }

  _prepareQuestionPropertyExpression({ group, question, key, context, propName }) {
    // expression
    const expression = question[propName] && question[propName].expression;
    if (!expression) return null;
    return function (value) {
      return eggBornUtils.tools.evaluateExpression({ expression, scope: { value, group, question, key, context } });
    };
  }

  _prepareQuestion({ group, question, key, context }) {
    const { argv } = context;
    // want
    const varWant = {
      name: key,
      ...question,
    };
    // message/skip/initial/format/validate
    for (const propName of ['message', 'skip', 'initial', 'format', 'validate']) {
      const propFunction = this._prepareQuestionPropertyExpression({ group, question, key, context, propName });
      if (propFunction) {
        varWant[propName] = propFunction;
      }
    }
    // result
    varWant.result = value => {
      const propFunction = this._prepareQuestionPropertyExpression({
        group,
        question,
        key,
        context,
        propName: 'result',
      });
      if (propFunction) {
        value = propFunction(value);
      }
      argv[key] = value;
      return value;
    };
    // required
    if (question.required) {
      varWant.validate = value => {
        if (!value) return 'Required';
        return true;
      };
    }
    // silent
    if (question.silent) {
      let initial = varWant.initial;
      if (is.function(initial)) {
        initial = initial();
      }
      argv[key] = initial;
      return null;
    }
    // ok
    return varWant;
  }

  _checkGroupCondition({ group, context }) {
    const expression = group.condition && group.condition.expression;
    if (!expression) return true;
    return eggBornUtils.tools.evaluateExpression({ expression, scope: { group, context } });
  }

  _progressbar({ progressId, context }) {
    const self = this;
    return new Promise((resolve, reject) => {
      let executing = false;
      // io
      const io = self._getIOInstance();
      // io progress
      //   options
      const options = {
        onSubscribed,
        onProgress,
      };
      const ioProgress = SocketIO.progress(io, options);
      // subscribe
      ioProgress.subscribe({ progressId });
      // onSubscribed
      async function onSubscribed() {
        try {
          // execute
          if (!executing) {
            executing = true;
            await self.__openAuthClient.post({
              path: '/a/cli/cli/execute',
              body: {
                progressId,
                context,
              },
            });
            return true;
          }
          return false;
        } catch (err) {
          // force close and destroy
          onDestroy()
            .then(() => {
              // reject
              reject(err);
            })
            .catch(() => {
              reject(err);
            });
          return true;
        }
      }
      // onProgress
      function onProgress({ item, data }) {
        // handle
        if (item.done === 0) {
          setProgresses(data);
        } else if (item.done === -1) {
          // done:1 error:-1
          // force close and destroy
          onDestroy()
            .then(() => {
              // reject
              reject(new Error(data.message));
            })
            .catch(() => {
              reject(new Error(data.message));
            });
        } else if (item.done === 1) {
          onDestroy()
            .then(() => {
              // resolve: should after the dialog closed
              resolve(data);
            })
            .catch(() => {
              // resolve: should after the dialog closed
              resolve(data);
            });
        }
      }
      // setProgresses
      function setProgresses(list) {
        // setProgress
        const length = list.length;
        let text = '';
        for (let progressNo = 0; progressNo < length; progressNo++) {
          const item = list[progressNo];
          const progressValid = item.progress >= 0;
          text += `(${progressValid ? item.progress + 1 : '-'}/${item.total})`;
          if (progressNo === length - 1) {
            if (!progressValid) {
              text = item.text;
            } else {
              text = adjustText(`${text}=> `, item.text);
            }
          }
        }
        console.log(text);
      }
      function adjustText(prefix, text) {
        return String(text)
          .split('\n')
          .map(item => (item ? prefix + item : item))
          .join('\n');
      }
      //
      async function onDestroy() {
        // unsubscribe
        ioProgress.unsubscribe();
        // delete progress
        await self.__openAuthClient.post({
          path: '/a/progress/progress/delete',
          body: {
            progressId,
          },
        });
      }
    });
  }

  _getIOInstance() {
    return SocketIO.io(AdapterFn({ openAuthClient: this.__openAuthClient }));
  }
}

module.exports = CliCommand;
