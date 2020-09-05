module.exports = app => {

  class MessageClass extends app.Service {

    async queueRegister({ module, messageClassName }) {
      return await this.ctx.bean.io.messageClass.queueRegister({ module, messageClassName });
    }

    async messageClass({ messageClass }) {
      return await this.ctx.bean.io.messageClass.get(messageClass);
    }

  }

  return MessageClass;
};
