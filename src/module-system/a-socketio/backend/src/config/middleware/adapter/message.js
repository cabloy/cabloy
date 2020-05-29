const modelMessageFn = require('../../../model/message.js');
const modelMessageSyncFn = require('../../../model/messageSync.js');
const sqlProcedureFn = require('../../sql/procedure.js');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class MessageClass {

    constructor() {
      this._modelMessage = null;
      this._modelMessageSync = null;
      this._sqlProcedure = null;
    }

    get modelMessage() {
      if (!this._modelMessage) this._modelMessage = new (modelMessageFn(ctx.app))(ctx);
      return this._modelMessage;
    }

    get modelMessageSync() {
      if (!this._modelMessageSync) this._modelMessageSync = new (modelMessageSyncFn(ctx.app))(ctx);
      return this._modelMessageSync;
    }

    get sqlProcedure() {
      if (!this._sqlProcedure) this._sqlProcedure = new (sqlProcedureFn(ctx))();
      return this._sqlProcedure;
    }

    async save({ message }) {
      // insert
      const res = await this.modelMessage.insert(message);
      return res.insertId;
    }

    async saveSyncs({ message, groupUsers }) {
      // messageId
      const messageId = message.id;
      // message sync
      const messageSyncs = [];
      //  :userIdFrom
      const isSame = message.userIdTo === message.userIdFrom;
      messageSyncs.push({
        messageId,
        userId: message.userIdFrom,
        messageDirection: isSame ? 0 : 1, // self/send
        messageRead: 1,
      });
      //  :userIdTo
      if (!message.messageGroup) {
        // single chat
        if (!isSame) {
          messageSyncs.push({
            messageId,
            userId: message.userIdTo,
            messageDirection: 2, // receive
            messageRead: 0,
          });
        }
      } else {
        // group chat
        if (groupUsers) {
          for (const groupUser of groupUsers) {
            const _userIdTo = groupUser.userId;
            if (_userIdTo !== message.userIdFrom) {
              messageSyncs.push({
                messageId,
                userId: _userIdTo,
                messageDirection: 2, // receive
                messageRead: 0,
              });
            }
          }
        }
      }
      //  :save
      for (const messageSync of messageSyncs) {
        const res = await this.modelMessageSync.insert(messageSync);
        messageSync.messageSyncId = res.insertId;
      }
      // ok
      return messageSyncs;
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
      where.syncDeleted = 0;
      where.messageClassId = messageClass.id;
      where.userId = user ? user.id : 0;
      where.messageRead = 0;
      // offset
      const res = await ctx.db.select('aSocketIOMessageView', {
        where,
        columns: [ 'id' ],
        orders: [[ 'id', 'asc' ]],
        limit: 1,
        offset: 0,
      });
      // offset - 1
      const offset = res[0] ? res[0].id - 1 : -1;
      return { offset };
    }

    async select({ messageClass, options, user }) {
      return await this._list({ messageClass, options, user, count: 0 });
    }

    async count({ messageClass, options, user }) {
      const count = await this._list({ messageClass, options, user, count: 1 });
      return { count };
    }

    async setRead({ messageIds, user }) {
      if (!messageIds || messageIds.length === 0) return;
      // query
      const sql = this.sqlProcedure.setRead({
        iid: ctx.instance.id,
        messageIds,
        userId: user ? user.id : 0,
      });
      await ctx.model.query(sql);
    }

    async delete({ messageIds, user }) {
      if (!messageIds || messageIds.length === 0) return;
      // query
      const sql = this.sqlProcedure.delete({
        iid: ctx.instance.id,
        messageIds,
        userId: user ? user.id : 0,
      });
      await ctx.model.query(sql);
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
  return MessageClass;
};
