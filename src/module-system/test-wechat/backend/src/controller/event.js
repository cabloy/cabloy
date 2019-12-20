module.exports = app => {
  class EventController extends app.Controller {

    async wechatMessage() {
      const res = await this.service.event.wechatMessage({
        message: this.ctx.request.body.data.message,
      });
      this.ctx.success(res);
    }

  }
  return EventController;
};
