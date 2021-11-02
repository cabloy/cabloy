module.exports = app => {
  class Db extends app.Service {
    async insert({ tableName, data }) {
      return await this.ctx.db.insert(tableName, data);
    }

    async select({ tableName, options }) {
      return await this.ctx.db.select(tableName, options);
    }

    async get({ tableName, where }) {
      return await this.ctx.db.get(tableName, where);
    }

    async update({ tableName, data, options }) {
      return await this.ctx.db.update(tableName, data, options);
    }

    async delete({ tableName, where }) {
      return await this.ctx.db.delete(tableName, where);
    }
  }
  return Db;
};
