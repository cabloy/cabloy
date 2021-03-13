module.exports = app => {

  class DetailController extends app.Controller {

    async create() {
      const res = await this.ctx.service.detail.create({
        detailClass: this.ctx.request.body.detailClass,
        item: this.ctx.request.body.item,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }
  return DetailController;
};

