const modelMailFn = require('../../../model/mail.js');

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Mail {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._modelMail = null;
    }

    // other module's mail
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get modelMail() {
      if (!this._modelMail) this._modelMail = new (modelMailFn(ctx.app))(ctx);
      return this._modelMail;
    }

    // send
    async send({ scene, message }) {
      // save to db
      await this.modelMail.insert({
        scene,
        status: 0,
        mailto: message.to,
        mailSubject: message.subject,
        message: JSON.stringify(message),
      });
      // queue not async
      await ctx.dbMeta.next(async () => {
        await ctx.app.meta.queue.push({
          subdomain: ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'send',
          data: null,
        });
      });
    }
  }
  return Mail;
};
