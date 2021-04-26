module.exports = app => {
  class ShareController extends app.Controller {

    async createLink() {
      const res = await this.service.share.createLink({
        host: this.ctx.request.body.host,
        atomId: this.ctx.request.body.atomId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }
  return ShareController;
};
