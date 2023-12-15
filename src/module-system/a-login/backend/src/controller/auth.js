module.exports = class AuthController {
  async list() {
    const res = await this.service.auth.list();
    this.ctx.success(res);
  }
};
