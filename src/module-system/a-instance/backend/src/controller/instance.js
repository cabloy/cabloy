module.exports = class InstanceController {
  async item() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.service.instance.item();
    this.ctx.success(res);
  }

  async save() {
    // check demo
    this.ctx.bean.util.checkDemo();
    await this.service.instance.save({
      data: this.ctx.request.body.data,
    });
    this.ctx.success();
  }

  async getConfigsPreview() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.service.instance.getConfigsPreview();
    this.ctx.success(res);
  }

  async reload() {
    // check demo
    this.ctx.bean.util.checkDemo();
    await this.service.instance.reload();
    this.ctx.success();
  }
};
