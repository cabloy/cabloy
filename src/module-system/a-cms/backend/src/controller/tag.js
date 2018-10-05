module.exports = app => {

  class TagController extends app.Controller {

    async list() {
      const list = await this.ctx.service.tag.list({
        options: this.ctx.request.body.options,
      });
      this.ctx.success({ list });
    }

    async listP() {
      // options
      const options = JSON.parse(this.ctx.request.query.options);
      // list
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/cms/tag/list',
        body: { options },
      });
      this.ctx.success(res);
    }

  }
  return TagController;
};

