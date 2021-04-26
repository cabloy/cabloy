module.exports = app => {
  class ShareController extends app.Controller {

    async create() {
      const res = await this.service.share.create({
        host: this.ctx.request.body.host,
        atomId: this.ctx.request.body.atomId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }
  return ShareController;
};
