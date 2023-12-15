module.exports = class AuthController {
  async signin() {
    // check demo
    this.ctx.bean.util.checkDemo();
    // data: { clientID, clientSecret }
    const res = await this.ctx.service.auth.signin({
      data: this.ctx.request.body.data,
    });
    this.ctx.success(res);
  }
};
