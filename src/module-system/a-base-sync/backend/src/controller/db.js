module.exports = app => {
  class DbController extends app.Controller {
    async insert() {
      const { tableName, data } = this.ctx.request.body;
      const res = await this.ctx.service.db.insert({
        tableName,
        data,
      });
      this.ctx.success(res);
    }

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

    async count() {
      const { tableName, where } = this.ctx.request.body;
      const res = await this.ctx.service.db.count({
        tableName,
        where,
      });
      this.ctx.success(res);
    }

    async update() {
      const { tableName, data, options } = this.ctx.request.body;
      const res = await this.ctx.service.db.update({
        tableName,
        data,
        options,
      });
      this.ctx.success(res);
    }

    async delete() {
      const { tableName, where } = this.ctx.request.body;
      const res = await this.ctx.service.db.delete({
        tableName,
        where,
      });
      this.ctx.success(res);
    }

    async query() {
      const { sql, params } = this.ctx.request.body;
      const res = await this.ctx.service.db.query({
        sql,
        params,
      });
      this.ctx.success(res);
    }

    async queryOne() {
      const { sql, params } = this.ctx.request.body;
      const res = await this.ctx.service.db.queryOne({
        sql,
        params,
      });
      this.ctx.success(res);
    }

    async iid() {
      const res = await this.ctx.service.db.iid();
      this.ctx.success(res);
    }
  }
  return DbController;
};
