module.exports = ctx => {
  const moduleInfo = module.info;
  class Mail extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'mail');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get modelMail() {
      return ctx.model.module(moduleInfo.relativeName).mail;
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
        await ctx.bean.io.publish({
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
