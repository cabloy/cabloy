module.exports = app => {

  class EventController extends app.Controller {

    async atomClassValidator() {
      const res = await this.ctx.service.event.atomClassValidator({
        event: this.ctx.request.body.event,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

  }

  return EventController;
};
