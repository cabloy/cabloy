module.exports = app => {

  class DbController extends app.Controller {

    async set() {
      const res = await this.ctx.service.db.set(this.ctx.request.body);
      this.ctx.success(res);
    }

  }

  return DbController;
};
