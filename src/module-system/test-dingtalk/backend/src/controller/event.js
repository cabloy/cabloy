module.exports = app => {
  class EventController extends app.Controller {

    async dingtalkCallback() {
      const res = await this.service.event.dingtalkCallback({
        event: this.ctx.request.body.event,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

  }
  return EventController;
};
