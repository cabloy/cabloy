module.exports = app => {

  class Message extends app.Service {

    async offset({ messageClass, options, user }) {
      return await this.ctx.bean.io.message.offset({ messageClass, options, user });
    }

    async select({ messageClass, options, user }) {
      return await this.ctx.bean.io.message.select({ messageClass, options, user });
    }

    async count({ messageClass, options, user }) {
      return await this.ctx.bean.io.message.count({ messageClass, options, user });
    }

    async setRead({ messageIds, user }) {
      return await this.ctx.bean.io.message.setRead({ messageIds, user });
    }

    async delete({ messageIds, user }) {
      return await this.ctx.bean.io.message.delete({ messageIds, user });
    }

  }

  return Message;
};
