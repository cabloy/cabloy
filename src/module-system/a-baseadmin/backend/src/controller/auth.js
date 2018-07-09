module.exports = app => {
  class AuthController extends app.Controller {

    async list() {
      const res = await this.service.auth.list();
      this.ctx.success(res);
    }

    async disable() {
      const res = await this.service.auth.disable({
        id: this.ctx.request.body.id,
        disabled: this.ctx.request.body.disabled,
      });
      this.ctx.success(res);
    }

    async item() {
      const res = await this.service.auth.item({
        id: this.ctx.request.body.id,
      });
      this.ctx.success(res);
    }

    async save() {
      const res = await this.service.auth.save({
        id: this.ctx.request.body.id,
        config: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

  }
  return AuthController;
};
