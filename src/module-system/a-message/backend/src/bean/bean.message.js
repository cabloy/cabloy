const __PATH_MESSAGE_UNIFORM = '/a/message/uniform';

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

  }
  return Message;
};
