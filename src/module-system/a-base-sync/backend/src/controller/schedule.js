module.exports = app => {

  class ScheduleController extends app.Controller {

    async installAllSchedules() {
      await this.ctx.service.schedule.installAllSchedules();
      this.ctx.success();
    }

    async scheduleQueue() {
      await this.ctx.service.schedule.scheduleQueue({
        module: this.ctx.request.body.module,
        schedule: this.ctx.request.body.schedule,
      });
      this.ctx.success();
    }

  }

  return ScheduleController;
};
