module.exports = app => {
  class DbController extends app.Controller {
    async select() {
      const { tableName, options } = this.ctx.request.body;
      const res = await this.ctx.service.db.select({
        tableName,
        options,
      });
      this.ctx.success(res);
    }

    async get() {
      const { tableName, where } = this.ctx.request.body;
      const res = await this.ctx.service.db.get({
        tableName,
        where,
      });
      this.ctx.success(res);
    }
  }
  return DbController;
};
