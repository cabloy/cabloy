module.exports = app => {
  class IOController extends app.Controller {

    async subscribe() {
      const res = await this.service.io.subscribe({
        subscribes: this.ctx.request.body.subscribes,
        socketId: this.ctx.request.body.socketId,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async unsubscribe() {
      const res = await this.service.io.unsubscribe({
        subscribes: this.ctx.request.body.subscribes,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async queueSaveMessage() {
      const res = await this.service.io.queueSaveMessage({
        path: this.ctx.request.body.path,
        options: this.ctx.request.body.options,
        message: this.ctx.request.body.message,
        messageClass: this.ctx.request.body.messageClass,
      });
      this.ctx.success(res);
    }

    async queueProcess() {
      const res = await this.service.io.queueProcess({
        path: this.ctx.request.body.path,
        options: this.ctx.request.body.options,
        message: this.ctx.request.body.message,
        messageClass: this.ctx.request.body.messageClass,
      });
      this.ctx.success(res);
    }

    async queueDelivery() {
      const res = await this.service.io.queueDelivery({
        path: this.ctx.request.body.path,
        options: this.ctx.request.body.options,
        message: this.ctx.request.body.message,
        messageSyncs: this.ctx.request.body.messageSyncs,
        messageClass: this.ctx.request.body.messageClass,
      });
      this.ctx.success(res);
    }

    async queuePush() {
      // messageSyncs/messageSync
      const res = await this.service.io.queuePush({
        options: this.ctx.request.body.options,
        message: this.ctx.request.body.message,
        messageSyncs: this.ctx.request.body.messageSyncs,
        messageSync: this.ctx.request.body.messageSync,
        messageClass: this.ctx.request.body.messageClass,
      });
      this.ctx.success(res);
    }

    async queuePushDirect() {
      const res = await this.service.io.queuePushDirect({
        options: this.ctx.request.body.options,
        content: this.ctx.request.body.content,
        channel: this.ctx.request.body.channel,
      });
      this.ctx.success(res);
    }

  }
  return IOController;
};
