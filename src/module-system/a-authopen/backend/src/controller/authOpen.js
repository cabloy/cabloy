module.exports = class AuthOpenController {
  async hideClientSecret() {
    // check demo
    // this.ctx.bean.util.checkDemo();
    const res = await this.ctx.service.authOpen.hideClientSecret({
      key: this.ctx.request.body.key,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async resetClientSecret() {
    // check demo
    this.ctx.bean.util.checkDemo();
    const res = await this.ctx.service.authOpen.resetClientSecret({
      key: this.ctx.request.body.key,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }
};
