module.exports = app => {
  class LayoutConfigController extends app.Controller {

    async load() {
      const res = await this.service.layoutConfig.load({
        module: this.ctx.request.body.module,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async save() {
      const res = await this.service.layoutConfig.save({
        module: this.ctx.request.body.module,
        data: this.ctx.request.body.data,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async saveKey() {
      const res = await this.service.layoutConfig.saveKey({
        module: this.ctx.request.body.module,
        key: this.ctx.request.body.key,
        value: this.ctx.request.body.value,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

  }
  return LayoutConfigController;
};
