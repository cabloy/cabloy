const modelMessageClassFn = require('../../../model/messageClass.js');

const _cacheAtomClasses = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class MessageClass {

    constructor() {
      this._modelMessageClass = null;
    }

    get modelMessageClass() {
      if (!this._modelMessageClass) this._modelMessageClass = new (modelMessageClassFn(ctx.app))(ctx);
      return this._modelMessageClass;
    }

    async getMessageClassId({ id, module, messageClassName }) {
      if (id) return id;
      const messageClass = await this.get({ module, messageClassName });
      return messageClass.id;
    }

    async get({ id, module, messageClassName }) {
      const data = id ? { id } : { module, messageClassName };
      const res = await this.modelMessageClass.get(data);
      if (res) return res;
      if (!module || !messageClassName) throw new Error('Invalid arguments');
      // queue
      return await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'registerMessageClass',
        data: { module, messageClassName },
      });
    }

    async queueRegister({ module, messageClassName }) {
      // get
      const res = await this.modelMessageClass.get({ module, messageClassName });
      if (res) return res;
      // data
      const messageClass = this.messageClass({ module, messageClassName });
      if (!messageClass) throw new Error(`messageClass ${module}:${messageClassName} not found!`);
      const data = {
        module,
        messageClassName,
      };
      // insert
      const res2 = await this.modelMessageClass.insert(data);
      data.id = res2.insertId;
      return data;
    }

    messageClasses() {
      if (!_cacheAtomClasses[ctx.locale]) {
        _cacheAtomClasses[ctx.locale] = this._prepareMessageClasses();
      }
      return _cacheAtomClasses[ctx.locale];
    }

    messageClass({ module, messageClassName }) {
      const _messageClasses = this.messageClasses();
      return _messageClasses[module] && _messageClasses[module][messageClassName];
    }

    _prepareMessageClasses() {
      const messageClasses = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.socketio && module.main.meta.socketio.messages) {
          const res = this._prepareMessageClassesModule(module, module.main.meta.socketio.messages);
          if (Object.keys(res).length > 0) {
            messageClasses[relativeName] = res;
          }
        }
      }
      return messageClasses;
    }

    _prepareMessageClassesModule(module, _messages) {
      const messageClasses = {};
      for (const key in _messages) {
        const _message = _messages[key];
        // titleLocale
        _message.info.titleLocale = ctx.text(_message.info.title);
        // ok
        messageClasses[key] = _message;
      }
      return messageClasses;
    }


  }
  return MessageClass;
};
