module.exports = app => {

  class ScheduleController extends app.Controller {

    async installAllSchedules() {
      await this.ctx.service.schedule.installAllSchedules();
      this.ctx.success();
    }

  }

  return ScheduleController;
};
