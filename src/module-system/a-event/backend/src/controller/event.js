module.exports = app => {

  class EventController extends app.Controller {

    async installEvents() {
      // register all events
      await this.ctx.service.event.registerAllEvents();
      this.ctx.success();
    }

  }

  return EventController;
};
