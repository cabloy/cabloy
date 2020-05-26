module.exports = app => {

  class MessageClass extends app.Service {

    async queueRegister({ module, messageClassName }) {
      return await this.ctx.meta.io.messageClass.queueRegister({ module, messageClassName });
    }

    async messageClass({ messageClass }) {
      return await this.ctx.meta.io.messageClass.get(messageClass);
    }

  }

  return MessageClass;
};
