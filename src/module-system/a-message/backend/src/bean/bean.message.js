module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends ctx.app.meta.BeanModuleBase {

    constructor(moduleName) {
      super(ctx, 'message');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // publish
    async publish({ message, messageClass, options }) {
      //
    }

  }
  return Message;
};
