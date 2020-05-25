module.exports = app => {

  class MessageClass extends app.Service {

    async register({ module, messageClassName }) {
      return await this.ctx.meta.io.messageClass.register({ module, messageClassName });
    }

    async messageClass({ messageClass }) {
      return await this.ctx.meta.io.messageClass.get(messageClass);
    }

  }

  return MessageClass;
};
