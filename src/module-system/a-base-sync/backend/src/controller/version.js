module.exports = app => {
  class VersionController extends app.Controller {

    async update() {
      await this.service.version.update(this.ctx.request.body);
      this.ctx.success();
    }

    async init() {
      await this.service.version.init(this.ctx.request.body);
      this.ctx.success();
    }

    async update8() {
      await this.service.version.update8(this.ctx.request.body);
      this.ctx.success();
    }

  }
  return VersionController;
};
