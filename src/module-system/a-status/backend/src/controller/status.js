module.exports = app => {

  class StatusController extends app.Controller {

    async set() {
      const res = await this.ctx.service.status.set(this.ctx.request.body);
      this.ctx.success(res);
    }

  }

  return StatusController;
};
