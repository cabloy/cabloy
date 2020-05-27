const sqlProcedureFn = require('../../sql/procedure.js');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Offline {

    constructor() {
      this._sqlProcedure = null;
    }

    get sqlProcedure() {
      if (!this._sqlProcedure) this._sqlProcedure = new (sqlProcedureFn(ctx))();
      return this._sqlProcedure;
    }

    // the first unread message
    // options:
    //    where
    async offset({ messageClass, options, user }) {
      // messageClass
      messageClass = await ctx.meta.io.messageClass.get(messageClass);
      // where
      const where = (options && options.where) || {};
      where.iid = ctx.instance.id;
      where.deleted = 0;
      where.messageClassId = messageClass.id;
      where.userId = user ? user.id : 0;
      where.messageRead = 0;
      // offset
      const res = await ctx.db.select('aSocketIOMessageView', {
        where,
        columns: [ 'id' ],
        orders: [[ 'createdAt', 'asc' ]],
        limit: 1,
        offset: 0,
      });
      // offset - 1
      const offset = res[0] ? res[0].id - 1 : 0;
      return { offset };
    }

    async fetch({ messageClass, options, user }) {
      return await this._list({ messageClass, options, user, count: 0 });
    }

    async count({ messageClass, options, user }) {
      const count = await this._list({ messageClass, options, user, count: 1 });
      return { count };
    }

    async _list({ messageClass, options, user, count }) {
      // messageClass
      messageClass = await ctx.meta.io.messageClass.get(messageClass);
      // where
      const where = (options && options.where) || {};
      where.messageClassId = messageClass.id;
      where.userId = user ? user.id : 0;
      // orders
      const orders = (options && options.orders) || [[ 'createdAt', 'asc' ]];
      // query
      const sql = this.sqlProcedure.selectMessages({
        iid: ctx.instance.id,
        where,
        orders,
        page: options.page,
        offset: options.offset,
        count,
      });
      const res = await ctx.model.query(sql);
      return count ? res[0]._count : res;
    }

  }
  return Offline;
};
