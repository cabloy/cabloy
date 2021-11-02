module.exports = app => {
  class Db extends app.Service {
    async select({ tableName, options }) {
      return await this.ctx.db.select(tableName, options);
    }

    async get({ tableName, where }) {
      return await this.ctx.db.get(tableName, where);
    }
  }
  return Db;
};
