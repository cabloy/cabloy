module.exports = app => {

  class IO extends app.Service {

    async subscribe({ subscribes, socketId, user }) {
      return await this.ctx.bean.io.subscribe({ subscribes, socketId, user });
    }

    async unsubscribe({ subscribes, user }) {
      return await this.ctx.bean.io.unsubscribe({ subscribes, user });
    }

  }

  return IO;
};
