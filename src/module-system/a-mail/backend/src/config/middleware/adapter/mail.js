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
      const res = await this.modelMail.insert({
        scene,
        status: 0,
        mailto: message.to,
        mailSubject: message.subject,
        message: JSON.stringify(message),
      });
      const mailId = res.insertId;
      // publish
      ctx.tail(async () => {
        await ctx.meta.io.publish({
          message: {
            content: { mailId },
          },
          messageClass: {
            module: moduleInfo.relativeName,
            messageClassName: 'mail',
          },
        });
      });
    }
  }
  return Mail;
};
