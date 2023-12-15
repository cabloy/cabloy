module.exports = class ShareController {
  async generate() {
    const res = await this.ctx.service.share.generate({
      host: this.ctx.request.body.host,
      atomId: this.ctx.request.body.atomId,
      url: this.ctx.request.body.url,
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }

  async shareGo() {
    await this.ctx.service.share.shareGo({
      uuid: this.ctx.params.uuid,
      user: this.ctx.state.user.op,
    });
  }
};
