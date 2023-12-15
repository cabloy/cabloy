const _cacheMessageClassesUniform = {};

// const moduleInfo = module.info;
module.exports = class Message extends module.meta.class.BeanModuleBase {
  async group(/* {  options, user }*/) {
    const items = this.messageClassesUniform();
    return items;
  }

  messageClassesUniform() {
    if (!_cacheMessageClassesUniform[this.ctx.locale]) {
      _cacheMessageClassesUniform[this.ctx.locale] = this._prepareMessageClassesUniform();
    }
    return _cacheMessageClassesUniform[this.ctx.locale];
  }

  _prepareMessageClassesUniform() {
    const messageClasses = this.ctx.bean.io.messageClass.messageClasses();
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
};
