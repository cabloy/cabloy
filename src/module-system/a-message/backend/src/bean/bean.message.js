const __PATH_MESSAGE_UNIFORM = '/a/message/uniform';

const _cacheMessageClassesUniform = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends ctx.app.meta.BeanModuleBase {

    constructor(moduleName) {
      super(ctx, 'message');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // publish
    async publishUniform({ message, messageClass, options }) {
      // todo: will be removed
      if (ctx.config.module(moduleInfo.relativeName).message.disabled) return;
      // messageClass
      messageClass.module = messageClass.module || this.moduleName;
      // publish
      return await ctx.bean.io.publish({
        path: __PATH_MESSAGE_UNIFORM,
        message,
        messageClass,
        options,
      });
    }

    async group({ /* options, user */}) {
      const items = this.messageClassesUniform();
      return items;
    }

    messageClassesUniform() {
      if (!_cacheMessageClassesUniform[ctx.locale]) {
        _cacheMessageClassesUniform[ctx.locale] = this._prepareMessageClassesUniform();
      }
      return _cacheMessageClassesUniform[ctx.locale];
    }

    _prepareMessageClassesUniform() {
      const messageClasses = ctx.bean.io.messageClass.messageClasses();
      const items = [];
      for (const relativeName in messageClasses) {
        const _module = messageClasses[relativeName];
        for (const messageClassName in _module) {
          const messageClass = _module[messageClassName];
          if (messageClass.info.uniform) {
            items.push({
              module: relativeName,
              messageClassName,
              messageClass,
            });
          }
        }
      }
      return items;
    }

  }
  return Message;
};
