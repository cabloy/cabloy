module.exports = app => {

  class IO extends app.Service {

    async subscribe({ subscribes, socketId, user }) {
      return await this.ctx.meta.io.subscribe({ subscribes, socketId, user });
    }

    async unsubscribe({ subscribes, user }) {
      return await this.ctx.meta.io.unsubscribe({ subscribes, user });
    }

    async publish({ path, message, messageClass, options, user }) {
      return await this.ctx.meta.io.publish({ path, message, messageClass, options, user });
    }

  }

  return IO;
};
