module.exports = app => {

  class TagController extends app.Controller {

    async list() {
      const list = await this.ctx.service.tag.list({
        language: this.ctx.request.body.language,
        orders: this.ctx.request.body.orders,
      });
      this.ctx.success({ list });
    }

  }
  return TagController;
};

