module.exports = app => {
  class IOController extends app.Controller {

    async subscribe() {
      const res = await this.service.io.subscribe({
        subscribes: this.ctx.request.body.subscribes,
        socketId: this.ctx.request.body.socketId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async unsubscribe() {
      const res = await this.service.io.unsubscribe({
        subscribes: this.ctx.request.body.subscribes,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }
  return IOController;
};
