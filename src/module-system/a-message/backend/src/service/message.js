module.exports = app => {

  class Message extends app.Service {

    async group({ options, user }) {
      return await this.ctx.bean.message.group({ options, user });
    }

  }
  return Message;
};

