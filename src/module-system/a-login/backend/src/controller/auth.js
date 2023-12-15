module.exports = class AuthController {
  async list() {
    const res = await this.ctx.service.auth.list();
    this.ctx.success(res);
  }
};
