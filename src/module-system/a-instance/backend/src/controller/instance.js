module.exports = app => {
  class InstanceController extends app.Controller {

    async item() {
      const res = await this.service.instance.item();
      this.ctx.success(res);
    }

    async save() {
      await this.service.instance.save({
        data: this.ctx.request.body.data,
      });
      this.ctx.success();
    }

    async getConfigsPreview() {
      const res = await this.service.instance.getConfigsPreview();
      this.ctx.success(res);
    }

    async startup() {
      // do nothing
      this.ctx.success();
    }

    async resetCache() {
      // do nothing
      this.ctx.success();
    }

  }
  return InstanceController;
};
