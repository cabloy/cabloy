const chalk = require('chalk');
const enquirer = require('enquirer');
const eggBornUtils = require('egg-born-utils');
const BaseCommand = require('@zhennann/common-bin');
const IOFn = require('@zhennann/socketio').default;
const AdapterFn = require('../adapter.js');

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
    let { cwd, argv } = context;
    // argv
    argv = Object.assign({}, argv, this.__argv);
    // log start
    console.log(`npm run cli ${argv.cliFullName} at %s`, cwd);
    // prompt
    yield this._promptGroups({ argv, groups: this.__groups });
    console.log(argv);
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
    return new Promise((resolve, reject) => {
      let counter = 0;
      let subscribeId = null;
      const subscribePath = `/a/progress/update/${progressId}`;
      // io
      const io = this._getIOInstance();
      // onMessage
      function onMessage({ message }) {
        const item = JSON.parse(message.content);
        checking(item);
      }
      // onSubscribed
      function onSubscribed() {
        this.openAuth
          .post({
            path: '/a/progress/progress/check',
            body: {
              progressId,
              counter,
            },
          })
          .then(item => {
            checking(item);
          })
          .catch(() => {
            // donothing
          });
      }
      //
      function checking(item) {
        if (!item) return;
        if (item.counter <= counter) {
          // old message
          return;
        }
        counter = item.counter;
        // data
        const data = item.data ? (typeof item.data === 'string' ? JSON.parse(item.data) : item.data) : {};
        // handle
        if (item.done === 0) {
          setProgresses(data);
        } else if (item.done === -1) {
          // done:1 error:-1
          // force close and destroy
          onDestroy()
            .then(() => {
              // reject
              reject(data);
            })
            .catch(() => {
              reject(data);
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
          .map(item => prefix + item)
          .join('\n');
      }
      //
      async function onDestroy() {
        // unsubscribe
        if (subscribeId) {
          io.unsubscribe(subscribeId);
          subscribeId = null;
        }
        // delete progress
        await this.openAuth.post({
          path: '/a/progress/progress/delete',
          body: {
            progressId,
          },
        });
      }
      // subscribe
      subscribeId = io.subscribe(subscribePath, onMessage, onSubscribed);
    });
  }

  _getIOInstance() {
    return IOFn(AdapterFn({ openAuth: this.__openAuth }));
  }
}

module.exports = CliCommand;
