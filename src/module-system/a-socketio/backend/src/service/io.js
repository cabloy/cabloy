module.exports = app => {

  class IO extends app.Service {

    async subscribe({ subscribes, socketId, clientId }) {
      return await this.ctx.meta.io.subscribe({ subscribes, socketId, clientId });
    }

    async unsubscribe({ subscribes, clientId }) {
      return await this.ctx.meta.io.unsubscribe({ subscribes, clientId });
    }

  }

  return IO;
};
