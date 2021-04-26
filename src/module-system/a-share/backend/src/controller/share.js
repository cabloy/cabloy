module.exports = app => {
  class ShareController extends app.Controller {

    async generate() {
      const res = await this.service.share.generate({
        host: this.ctx.request.body.host,
        atomId: this.ctx.request.body.atomId,
        url: this.ctx.request.body.url,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }
  return ShareController;
};
