module.exports = app => {

  class MessageClass extends app.Service {

    async messageClass({ messageClass }) {
      return await this.ctx.bean.io.messageClass.get(messageClass);
    }

  }

  return MessageClass;
};
