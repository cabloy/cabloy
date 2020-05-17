module.exports = app => {

  class StartupController extends app.Controller {

    async startupQueue() {
      await this.ctx.service.startup.startupQueue({
        key: this.ctx.request.body.key,
        startup: this.ctx.request.body.startup,
        info: this.ctx.request.body.info,
      });
      this.ctx.success();
    }

  }

  return StartupController;
};
