module.exports = app => {

  class TagController extends app.Controller {

    async list() {
      const atomClass = this.ctx.request.body.atomClass;
      const list = await this.ctx.service.tag.list({
        atomClass,
        options: this.ctx.request.body.options,
      });
      this.ctx.success({ list });
    }

  }
  return TagController;
};

