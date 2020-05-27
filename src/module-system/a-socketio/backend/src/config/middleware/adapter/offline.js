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
      where.userId = user.id;
      where.messageRead = 0;
      // offset
      const res = await ctx.db.select('aSocketIOMessageView', {
        where,
        columns: [ 'id' ],
        orders: [[ 'createdAt', 'asc' ]],
        limit: 1,
        offset: 0,
      });
      return res[0] ? res[0].id : 0;
    }

  }
  return Offline;
};
