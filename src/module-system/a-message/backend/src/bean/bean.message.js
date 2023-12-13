const _cacheMessageClassesUniform = {};

module.exports = ctx => {
  // const moduleInfo = module.info;
  class Message extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'message');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    async group(/* {  options, user }*/) {
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
