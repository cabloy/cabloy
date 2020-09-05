module.exports = app => {

  class IO extends app.Service {

    async subscribe({ subscribes, socketId, user }) {
      return await this.ctx.bean.io.subscribe({ subscribes, socketId, user });
    }

    async unsubscribe({ subscribes, user }) {
      return await this.ctx.bean.io.unsubscribe({ subscribes, user });
    }

    async queueSaveMessage({ path, options, message, messageClass }) {
      return await this.ctx.bean.io.queueSaveMessage({ path, options, message, messageClass });
    }

    async queueProcess({ path, options, message, messageClass }) {
      return await this.ctx.bean.io.queueProcess({ path, options, message, messageClass });
    }

    async queueDelivery({ path, options, message, messageSyncs, messageClass }) {
      return await this.ctx.bean.io.queueDelivery({ path, options, message, messageSyncs, messageClass });
    }

    async queuePush({ options, message, messageSyncs, messageSync, messageClass }) {
      return await this.ctx.bean.io.queuePush({ options, message, messageSyncs, messageSync, messageClass });
    }

    async queuePushDirect({ options, content, channel }) {
      return await this.ctx.bean.io.queuePushDirect({ options, content, channel });
    }

  }

  return IO;
};
