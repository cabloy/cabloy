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
    // yield this._promptGroups({ argv, groups: this.__groups });
    // console.log(argv);
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
          // alert
          const progress = { total: 0, progress: 100, text: data.message };
          setProgresses([progress]);
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
        for (const progressNo in list) {
          const _item = list[progressNo];
          setProgress({
            progressNo,
            total: _item.total,
            progress: _item.progress,
            text: _item.text,
          });
        }
      }
      // setProgress
      function setProgress({ progressNo = 0, total = 0, progress = 0, text = '' }) {
        console.log(progressNo, total, progress, text);
        // // setProgress
        // const _progress = total > 0 ? parseInt((progress * 100) / total) : progress;
        // app.progressbar.set(progressbar.find('.progressbar'), _progress);
        // // set text
        // const _text = total > 0 ? `(${progress + 1}/${total}) ${text}` : text;
        // const $textEl = progressbar.find('.progressbar-text');
        // $textEl.text(_text);
      }
      //
      function* onDestroy() {
        // unsubscribe
        if (subscribeId) {
          io.unsubscribe(subscribeId);
          subscribeId = null;
        }
        // delete progress
        yield this.openAuth.post({
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
