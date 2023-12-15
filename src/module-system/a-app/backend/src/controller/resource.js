module.exports = class ResourceController {
  async read() {
    const res = await this.ctx.service.resource.read({
      atomStaticKey: this.ctx.request.body.atomStaticKey,
      options: this.ctx.request.body.options,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }
};
