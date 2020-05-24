module.exports = app => {
  class IOController extends app.Controller {

    async subscribe() {
      const res = await this.service.io.subscribe({
        subscribes: this.ctx.request.body.subscribes,
        clientId: this.ctx.meta.io.clientId,
      });
      this.ctx.success(res);
    }

    async unsubscribe() {
      const res = await this.service.io.unsubscribe({
        subscribes: this.ctx.request.body.subscribes,
        clientId: this.ctx.meta.io.clientId,
      });
      this.ctx.success(res);
    }

  }
  return IOController;
};
