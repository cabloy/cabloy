module.exports = app => {

  class TagController extends app.Controller {

    async list() {
      const list = await this.ctx.service.tag.list({
        options: this.ctx.request.body.options,
      });
      this.ctx.success({ list });
    }

  }
  return TagController;
};

