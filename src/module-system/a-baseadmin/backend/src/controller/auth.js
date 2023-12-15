module.exports = class AuthController {
  async list() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.service.auth.list();
    this.ctx.success(res);
  }

  async disable() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.service.auth.disable({
      id: this.ctx.request.body.id,
      disabled: this.ctx.request.body.disabled,
    });
    this.ctx.success(res);
  }

  async save() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.service.auth.save({
      id: this.ctx.request.body.id,
      config: this.ctx.request.body.data,
    });
    this.ctx.success(res);
  }
};
