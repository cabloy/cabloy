const uuid = require('uuid');
const chalk = require('chalk');
const eventMessengerCall = 'eb:event:messengerCall';

module.exports = function(loader, modules) {

  class Messenger {
    constructor() {
      this._providers = {};
      this._pids = null;
      this.init();
    }

    init() {
      // wait for call
      loader.app.messenger.on(eventMessengerCall, async info => {
        const provider = this._providers[info.name];
        let data;
        let err;
        try {
          data = await provider.handler(info.data);
        } catch (error) {
          console.log(chalk.red(error));
          err = { code: error.code, message: error.message };
        }
        if (info.echo) {
          if (loader.app.meta.inApp) {
            this.sendAgent(info.echo, { err, data });
          } else {
            this.sendTo(info.pid, info.echo, { err, data });
          }
        }
      });

      // in agent
      if (loader.app.meta.inAgent) {
        // get pids
        loader.app.messenger.on('egg-pids', data => {
          this._pids = data;
        });
      }
    }

    callAgent(info, cb) {
      info.pid = process.pid;
      this._call(null, info, cb);
    }

    callRandom(info, cb) {
      this._call(null, info, cb);
    }

    callTo(pid, info, cb) {
      this._call(pid, info, cb);
    }

    callAll(info) {
      this.sendToApp(eventMessengerCall, info);
    }

    // info: { name, data }
    _call(pid, info, cb) {
      if (cb) {
        info.echo = uuid.v1();
        loader.app.messenger.once(info.echo, info => {
          return cb(info);
        });
      }
      if (loader.app.meta.inApp) {
        this.sendAgent(eventMessengerCall, info);
      } else {
        if (pid) {
          this.sendTo(pid, eventMessengerCall, info);
        } else {
          this.sendRandom(eventMessengerCall, info);
        }
      }
    }

    sendToApp(eventName, info) {
      loader.app.messenger.sendToApp(eventName, info);
    }
    sendTo(pid, eventName, info) {
      if (loader.app.meta.isTest || !this._pids) { // support init:backend
        loader.app.messenger.sendToApp(eventName, info);
      } else {
        loader.app.messenger.sendTo(pid, eventName, info);
      }
    }
    sendRandom(eventName, info) {
      if (loader.app.meta.isTest || !this._pids) { // support init:backend
        loader.app.messenger.sendToApp(eventName, info);
      } else {
        loader.app.messenger.sendRandom(eventName, info);
      }
    }
    sendAgent(eventName, info) {
      loader.app.messenger.sendToAgent(eventName, info);
    }

    addProvider(provider) {
      this._providers[provider.name] = provider;
    }
  }

  // messenger
  loader.app.meta.messenger = new Messenger();

};
