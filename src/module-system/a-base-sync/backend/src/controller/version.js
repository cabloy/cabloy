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

    async update8FunctionScenes() {
      await this.service.version.update8FunctionScenes(this.ctx.request.body);
      this.ctx.success();
    }

    async update8Atoms() {
      await this.service.version.update8Atoms(this.ctx.request.body);
      this.ctx.success();
    }

  }
  return VersionController;
};
