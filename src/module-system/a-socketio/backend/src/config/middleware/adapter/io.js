// const modelMailFn = require('../../../model/mail.js');

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IO {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      // this._modelMail = null;
    }

    // other module's io
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    // get modelMail() {
    //   if (!this._modelMail) this._modelMail = new (modelMailFn(ctx.app))(ctx);
    //   return this._modelMail;
    // }

    get clientId() {
      return ctx.user.op.anonymous ? ctx.meta.user.anonymousId() : ctx.user.op.id;
    }

  }
  return IO;
};
