module.exports = app => {

  class ScheduleController extends app.Controller {

    async loadSchedules() {
      await this.ctx.service.schedule.loadSchedules();
      this.ctx.success();
    }

  }

  return ScheduleController;
};
