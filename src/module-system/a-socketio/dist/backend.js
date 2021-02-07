module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 35:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const uuid = require3('uuid');

const SOCKETSONLINE = Symbol.for('APP#__SOCKETSONLINE');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IO {

    constructor() {
      this._redis = null;
    }

    get messageClass() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.messageClass');
    }

    get message() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.message');
    }

    get redis() {
      if (!this._redis) this._redis = ctx.app.redis.get('io') || ctx.app.redis.get('cache');
      return this._redis;
    }

    _registerSocket(socketId, socket) {
      const socketsOnline = ctx.app.geto(SOCKETSONLINE);
      socketsOnline[socketId] = socket;
    }

    _unRegisterSocket(socketId) {
      const socketsOnline = ctx.app.geto(SOCKETSONLINE);
      delete socketsOnline[socketId];
    }

    // subcribe
    //    hash key: userId:path
    //    hash value: scene -> workerId:socketId
    async subscribe({ subscribes, socketId, user }) {
      for (const item of subscribes) {
        const path = item.path;
        if (!path) ctx.throw(403);
        const scene = item.scene || '';
        const key = `${ctx.instance.id}:${user.id}:${path}`;
        const value = `${ctx.app.meta.workerId}:${socketId}`;
        await this.redis.hset(key, scene, value);
      }
    }

    async unsubscribe({ subscribes, user }) {
      for (const item of subscribes) {
        const path = item.path;
        if (!path) ctx.throw(403);
        const scene = item.scene || '';
        const socketId = item.socketId;
        if (!socketId) continue;
        const key = `${ctx.instance.id}:${user.id}:${path}`;
        // check if socketId is consistent
        const value = await this.redis.hget(key, scene);
        if (value && value.indexOf(socketId) > -1) {
          await this.redis.hdel(key, scene);
        }
      }
    }

    async unsubscribeWhenDisconnect({ iid, user, socketId }) {
      const keyPrefix = this.redis.options.keyPrefix;
      const keyPatern = `${keyPrefix}${iid}:${user.id}:*`;
      const keys = await this.redis.keys(keyPatern);
      for (const fullKey of keys) {
        const key = fullKey.substr(keyPrefix.length);
        const values = await this.redis.hgetall(key);
        if (!values) continue;
        for (const field in values) {
          const value = values[field];
          if (value && value.indexOf(socketId) > -1) {
            await this.redis.hdel(key, field);
          }
        }
      }
    }

    async pushDirect({ content, channel, options }) {
      ctx.app.meta.queue.push({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'pushDirect',
        data: {
          content,
          channel,
          options,
        },
      });
    }

    async publish({ path, message, messageClass, options }) {
      // options
      const messageScene = (options && options.scene) || '';
      // messageClass
      messageClass = await this.messageClass.get(messageClass);
      const messageClassBase = this.messageClass.messageClass(messageClass);
      // message/userId
      message.userIdFrom = parseInt(message.userIdFrom || 0);
      if (message.userIdTo === undefined || message.userIdTo === null) message.userIdTo = -2;
      message.userIdTo = parseInt(message.userIdTo || 0);
      const userIdFrom = message.userIdFrom;
      const userIdTo = message.userIdTo;
      // sessionId
      const beanMessage = this._getBeanMessage(messageClassBase);
      const sessionId = await beanMessage.onSessionId({ path, message, options });
      // message
      const _message = {
        messageClassId: messageClass.id,
        messageType: message.messageType,
        messageFilter: message.messageFilter,
        messageGroup: message.messageGroup,
        messageScene,
        userIdTo,
        userIdFrom,
        sessionId,
        content: JSON.stringify(message.content), // should use string for db/queue
      };

      // save
      if (messageClassBase.info.persistence) {
        _message.id = await this.message.save({ message: _message });
      } else {
        _message.id = message.id || uuid.v4();
        _message.createdAt = new Date();
      }

      // to queue
      ctx.app.meta.queue.push({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'process',
        data: {
          path,
          options,
          message: _message,
          messageClass,
        },
      });

      // ok
      return {
        id: _message.id,
      };
    }

    // queue: process
    async queueProcess({ path, options, message, messageClass }) {
      // messageClass
      const messageClassBase = this.messageClass.messageClass(messageClass);
      const beanMessage = this._getBeanMessage(messageClassBase);
      // groupUsers
      const groupUsers = await beanMessage.onGroupUsers({ path, message, options });
      // messageSyncs
      const messageSyncs = await beanMessage.onSaveSyncs({ path, options, message, groupUsers, messageClass });
      // onProcess
      await beanMessage.onProcess({ path, options, message, messageSyncs, groupUsers, messageClass });
    }

    async _onSaveSyncs({ /* path, options,*/ message, groupUsers, messageClass }) {
      // messageClass
      const messageClassBase = this.messageClass.messageClass(messageClass);
      // save syncs
      const messageSyncs = await this.message.saveSyncs({
        message,
        groupUsers,
        persistence: messageClassBase.info.persistence,
      });
      return messageSyncs;
    }

    async _onProcessBase({ path, options, message, messageSyncs, /* groupUsers,*/ messageClass }) {
      // to queue: delivery/push
      if (path) {
        // delivery
        ctx.app.meta.queue.push({
          subdomain: ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'delivery',
          data: {
            path,
            options,
            message,
            messageSyncs,
            messageClass,
          },
        });
      } else {
        // push
        this._pushQueuePush({ options, message, messageSyncs, messageClass });
      }
    }

    // queue: delivery
    async queueDelivery({ path, options, message, messageSyncs, messageClass }) {
      const messageClassBase = this.messageClass.messageClass(messageClass);
      for (const messageSync of messageSyncs) {
        if (messageSync.userId === -1 && path) {
          // broadcast to online users
          const userIds = await this._getPathUsersOnline({ path });
          for (const userId of userIds) {
            const _messageSync = {
              ...messageSync,
              userId,
            };
            await this._queueDeliveryMessageSync({ messageClassBase, path, options, message, messageSync: _messageSync, messageClass });
          }
        } else {
          // normal
          await this._queueDeliveryMessageSync({ messageClassBase, path, options, message, messageSync, messageClass });
        }
      }
    }

    // queue: push
    async queuePush({ options, message, messageSyncs, messageSync, messageClass }) {
      const messageClassBase = this.messageClass.messageClass(messageClass);
      if (messageSync) {
        // only one message
        return await this._queuePushMessageSync({ messageClassBase, options, message, messageSync, messageClass });
      }
      // more messages
      for (const messageSync of messageSyncs) {
        await this._queuePushMessageSync({ messageClassBase, options, message, messageSync, messageClass });
      }
    }

    async _queuePushMessageSync({ messageClassBase, options, message, messageSync, messageClass }) {
      const beanMessage = this._getBeanMessage(messageClassBase);
      await beanMessage.onPush({ options, message, messageSync, messageClass });
    }

    async push({ options, message, messageSync, messageClass }) {
      const messageClassBase = this.messageClass.messageClass(messageClass);
      // userId
      const userId = messageSync.userId;
      const isSender = message.userIdFrom === userId;
      // ignore sender
      if (isSender) return true;
      // adjust auto
      let autoFirstValid = false;
      // options maybe set push.channels
      let channels = options && options.push && options.channels;
      if (!channels) {
        channels = messageClassBase.info.push.channels;
        autoFirstValid = true;
      }
      if (!channels) return false;
      // loop
      let atLeastDone = false;
      for (const channelFullName of channels) {
        const res = await this._pushChannel({ messageClassBase, options, message, messageSync, messageClass, channelFullName });
        if (!res) continue;
        atLeastDone = true;
        if (autoFirstValid) break;
      }
      // log
      if (!atLeastDone) {
        ctx.logger.info('not found any valid channel for this message:', message);
        return false;
      }
      // done
      return true;
    }

    async _pushChannel({ messageClassBase, options, message, messageSync, messageClass, channelFullName }) {
      try {
        // bean
        const beanMessage = this._getBeanMessage(messageClassBase);
        if (!beanMessage) return false;
        // render message content
        const content = await beanMessage.onChannelRender({ channelFullName, options, message, messageSync, messageClass });
        if (!content) return false;
        // get channel base
        const beanChannel = this._getBeanChannel(channelFullName);
        if (!beanChannel) {
          return false;
        }
        // push
        const pushDone = await beanChannel.onPush({ content, options, message, messageSync, messageClass });
        if (!pushDone) return false;
        // done this channel
        return true;
      } catch (err) {
        // log
        ctx.logger.error(err);
        return false;
      }
    }

    async queuePushDirect({ content, options, channel }) {
      // get channel base
      const channelFullName = `${channel.module}:${channel.name}`;
      const beanChannel = this._getBeanChannel(channelFullName);
      if (!beanChannel) {
        return false;
      }
      const pushDone = await beanChannel.onPush({ content, options });
      // done
      return pushDone;
    }

    _getBeanChannel(channelFullName) {
      // get channel base
      const channelBase = this.messageClass.channel(channelFullName);
      if (!channelBase) {
        ctx.logger.info(`channel not found: ${channelFullName}`);
        return;
      }
      // bean
      const beanFullName = `${channelBase.info.module}.io.channel.${channelBase.info.bean}`;
      const beanChannel = ctx.bean._getBean(beanFullName);
      if (!beanChannel) {
        ctx.logger.info(`channel bean not found: ${beanFullName}`);
        return;
      }
      return beanChannel;
    }

    _getBeanMessage(messageClassBase) {
      // bean
      let beanMessage;
      if (messageClassBase.info.bean) {
        const beanFullName = `${messageClassBase.info.module}.io.message.${messageClassBase.info.bean}`;
        beanMessage = ctx.bean._getBean(beanFullName);
      }
      if (!beanMessage) {
        beanMessage = new (ctx.app.meta.IOMessageBase(ctx))();
        // ctx.logger.info(`message bean not found: ${beanFullName}`);
        // return;
      }
      return beanMessage;
    }

    _pushQueuePush({ options, message, messageSyncs, messageSync, messageClass }) {
      const messageClassBase = this.messageClass.messageClass(messageClass);
      // check if enable push
      const infoPush = messageClassBase.info && messageClassBase.info.push;
      if (infoPush && infoPush.channels) {
        ctx.app.meta.queue.push({
          subdomain: ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'push',
          data: {
            options,
            message,
            messageSyncs,
            messageSync,
            messageClass,
          },
        });
      }
    }

    async _getPathUsersOnline({ path }) {
      const userIds = [];
      const keyPrefix = this.redis.options.keyPrefix;
      const keyPatern = `${keyPrefix}${ctx.instance.id}:*:${path}`;
      const keys = await this.redis.keys(keyPatern);
      for (const fullKey of keys) {
        const key = fullKey.substr(keyPrefix.length);
        userIds.push(parseInt(key.split(':')[1]));
      }
      return userIds;
    }

    async _queueDeliveryMessageSync({ messageClassBase, path, options, message, messageSync, messageClass }) {
      const beanMessage = this._getBeanMessage(messageClassBase);
      await beanMessage.onDelivery({ path, options, message, messageSync, messageClass });
    }

    async delivery({ path, options, message, messageSync, messageClass }) {
      // ignore delivery online if !path
      if (path) {
        const deliveryDone = await this.emit({ path, options, message, messageSync, messageClass });
        if (deliveryDone) return;
      }
      // to queue: push
      this._pushQueuePush({ options, message, messageSync, messageClass });
    }

    // offline: return false
    //    hash key: userId:path
    //    hash value: scene -> workerId:socketId
    async emit({ path, options, message, messageSync/* , messageClass*/ }) {
      // userId
      const userId = messageSync.userId;
      if (!userId) return true;
      // options
      const messageScene = (options && options.scene) || '';
      // // no scene
      // if (!messageScene) {
      //   return await this._emitNoScene({ path, message, messageSync, messageScene });
      // }
      // scene
      return await this._emitScene({ path, message, messageSync, messageScene });
    }

    // async _emitNoScene({ path, message, messageSync, messageScene }) {
    //   // userId
    //   const userId = messageSync.userId;
    //   const isSender = message.userIdFrom === userId;
    //   // ignore sender
    //   if (isSender) return true;
    //   // get hash value
    //   const key = `${ctx.instance.id}:${userId}:${path}`;
    //   const value = await this.redis.hget(key, messageScene);
    //   if (!value) return false; // offline
    //   // emit
    //   const [ workerId, socketId ] = value.split(':');
    //   this._emitSocket({ path, message, workerId, socketId });
    //   // done
    //   return true;
    // }

    // return true when any emitSocket
    async _emitScene({ path, message, messageSync, messageScene }) {
      // userId
      const userId = messageSync.userId;
      const isSender = message.userIdFrom === userId;
      // get hash value
      const key = `${ctx.instance.id}:${userId}:${path}`;
      const values = await this.redis.hgetall(key);
      if (!values) {
        // offline
        //  only support offline-notification for receiver
        return !!isSender;
      }
      let bSent = false;
      for (const field in values) {
        if (!isSender || field !== messageScene) {
          bSent = true;
          const value = values[field];
          const [ workerId, socketId ] = value.split(':');
          this._emitSocket({ path, message, workerId, socketId });
        }
      }
      if (!bSent) {
        // offline
        //  only support offline-notification for receiver
        return !!isSender;
      }
      // done
      return true;
    }

    _emitSocket({ path, message, workerId, socketId }) {
      // broadcast
      ctx.app.meta.broadcast.emit({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        broadcastName: 'socketEmit',
        data: { path, message, workerId, socketId },
      });
    }

  }
  return IO;
};


/***/ }),

/***/ 472:
/***/ ((module) => {

const SOCKETSONLINE = Symbol.for('APP#__SOCKETSONLINE');
module.exports = app => {
  class Broadcast extends app.meta.BeanBase {

    async execute(context) {
      const data = context.data;
      if (app.meta.workerId === data.workerId) {
        const socketsOnline = app.geto(SOCKETSONLINE);
        const socket = socketsOnline[data.socketId];
        if (socket) {
          socket.emit('message', {
            path: data.path,
            message: data.message,
          });
        }
      }
    }

  }

  return Broadcast;
};


/***/ }),

/***/ 834:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const uuid = require3('uuid');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class MessageClass {

    constructor() {
      this._sqlProcedure = null;
    }

    get modelMessage() {
      return ctx.model.module(moduleInfo.relativeName).message;
    }

    get modelMessageSync() {
      return ctx.model.module(moduleInfo.relativeName).messageSync;
    }

    get sqlProcedure() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.procedure');
    }

    async save({ message }) {
      // insert
      const res = await this.modelMessage.insert(message);
      return res.insertId;
    }

    async saveSyncs({ message, groupUsers, persistence }) {
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
        if (persistence) {
          const res = await this.modelMessageSync.insert(messageSync);
          messageSync.messageSyncId = res.insertId;
        } else {
          messageSync.messageSyncId = uuid.v4();
        }
      }
      // ok
      return messageSyncs;
    }

    // the first unread message
    // options:
    //    where
    async offset({ messageClass, options, user }) {
      // messageClass
      messageClass = await ctx.bean.io.messageClass.get(messageClass);
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
      messageClass = await ctx.bean.io.messageClass.get(messageClass);
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


/***/ }),

/***/ 45:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const extend = require3('extend2');

const _cacheMessageClasses = {};
const _cacheChannels = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class MessageClass {

    get modelMessageClass() {
      return ctx.model.module(moduleInfo.relativeName).messageClass;
    }

    async getMessageClassId({ id, module, messageClassName }) {
      if (id) return id;
      const messageClass = await this.get({ module, messageClassName });
      return messageClass.id;
    }

    async get({ id, module, messageClassName }) {
      const data = id ? { id } : { module, messageClassName };
      const res = await this.modelMessageClass.get(data);
      if (res) return res;
      if (!module || !messageClassName) throw new Error('Invalid arguments');
      // lock
      return await ctx.app.meta.util.lock({
        subdomain: ctx.subdomain,
        resource: `${moduleInfo.relativeName}.messageClass.register`,
        fn: async () => {
          return await ctx.app.meta.util.executeBean({
            subdomain: ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            fn: async ({ ctx }) => {
              return await ctx.bean.io.messageClass._registerLock({ module, messageClassName });
            },
          });
        },
      });
    }

    async _registerLock({ module, messageClassName }) {
      // get
      const res = await this.modelMessageClass.get({ module, messageClassName });
      if (res) return res;
      // data
      const messageClass = this.messageClass({ module, messageClassName });
      if (!messageClass) throw new Error(`messageClass ${module}:${messageClassName} not found!`);
      const data = {
        module,
        messageClassName,
      };
      // insert
      const res2 = await this.modelMessageClass.insert(data);
      data.id = res2.insertId;
      return data;
    }

    messageClasses() {
      if (!_cacheMessageClasses[ctx.locale]) {
        _cacheMessageClasses[ctx.locale] = this._prepareMessageClasses();
      }
      return _cacheMessageClasses[ctx.locale];
    }

    messageClass({ module, messageClassName }) {
      const _messageClasses = this.messageClasses();
      return _messageClasses[module] && _messageClasses[module][messageClassName];
    }

    _prepareMessageClasses() {
      const messageClasses = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.socketio && module.main.meta.socketio.messages) {
          const res = this._prepareMessageClassesModule(module, module.main.meta.socketio.messages);
          if (Object.keys(res).length > 0) {
            messageClasses[relativeName] = res;
          }
        }
      }
      return messageClasses;
    }

    _prepareMessageClassesModule(module, _messages) {
      const messageClasses = {};
      for (const key in _messages) {
        const message = extend(true, {}, _messages[key]);
        message.info.module = module.info.relativeName;
        message.info.name = key;
        // titleLocale
        message.info.titleLocale = ctx.text(message.info.title);
        // ok
        messageClasses[key] = message;
      }
      return messageClasses;
    }

    channels() {
      if (!_cacheChannels[ctx.locale]) {
        _cacheChannels[ctx.locale] = this._prepareChannels();
      }
      return _cacheChannels[ctx.locale];
    }

    // string/object
    channel(channelFullName) {
      let module,
        channelName;
      if (typeof channelFullName === 'string') {
        [ module, channelName ] = channelFullName.split(':');
      } else {
        module = channelFullName.module;
        channelName = channelFullName.channelName;
      }
      const _channels = this.channels();
      return _channels[module] && _channels[module][channelName];
    }

    _prepareChannels() {
      const channels = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.socketio && module.main.meta.socketio.channels) {
          const res = this._prepareChannelsModule(module, module.main.meta.socketio.channels);
          if (Object.keys(res).length > 0) {
            channels[relativeName] = res;
          }
        }
      }
      return channels;
    }

    _prepareChannelsModule(module, _channels) {
      const channels = {};
      for (const key in _channels) {
        const channel = extend(true, {}, _channels[key]);
        channel.info.module = module.info.relativeName;
        channel.info.name = key;
        // titleLocale
        channel.info.titleLocale = ctx.text(channel.info.title);
        // ok
        channels[key] = channel;
      }
      return channels;
    }


  }
  return MessageClass;
};


/***/ }),

/***/ 716:
/***/ ((module) => {

module.exports = ctx => {
  class Procedure {

    selectMessages({ iid, where, orders, page, offset, count }) {

      // for safe
      where = where ? ctx.model._where(where) : null;
      orders = orders ? ctx.model._orders(orders) : null;
      const limit = page ? ctx.model._limit(page.size, page.index) : null;

      //
      const _where = where ? `${where} AND` : ' WHERE';
      const _orders = orders || '';
      const _limit = limit || '';

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = 'a.*';
      }

      // offset
      let _offsetWhere;
      if (typeof offset === 'number') {
        _offsetWhere = ` and a.id > ${parseInt(offset)}`;
      } else {
        _offsetWhere = '';
      }

      // sql
      const _sql =
        `select ${_selectFields} from aSocketIOMessageView a
          ${_where}
           (
             a.deleted=0 and a.syncDeleted=0 and a.iid=${iid}
             ${_offsetWhere}
           )
          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }

    setRead({ iid, messageIds, userId }) {

      const _messageIds = messageIds.map(item => parseInt(item)).join(',');

      // sql
      const _sql =
        `update aSocketIOMessageSync set messageRead=1
          where iid=${iid} and userId=${userId} and messageId in (${_messageIds})
        `;

      // ok
      return _sql;
    }

    delete({ iid, messageIds, userId }) {

      const _messageIds = messageIds.map(item => parseInt(item)).join(',');

      // sql
      const _sql =
        `update aSocketIOMessageSync set deleted=1
          where iid=${iid} and userId=${userId} and messageId in (${_messageIds})
        `;

      // ok
      return _sql;
    }

  }

  return Procedure;

};


/***/ }),

/***/ 405:
/***/ ((module) => {

module.exports = ctx => {
  const app = ctx.app;
  class Middleware {
    async execute(options, next) {
      // should startup: true
      const appReadyInstance = await ctx.bean.instance.checkAppReadyInstance({ startup: true });
      if (!appReadyInstance) return ctx.throw(403);
      // cache userId/socketId for disconnect
      const user = ctx.session.passport.user.op;
      if (user.anonymous) return ctx.throw(403);
      const iid = user.iid;
      const socketId = ctx.socket.id;
      ctx.bean.io._registerSocket(socketId, ctx.socket);

      if (app.meta.isTest || app.meta.isLocal) app.logger.info(`socket io connected: user:${user.id}, socket:${socketId}`);
      await next();
      if (app.meta.isTest || app.meta.isLocal) app.logger.info(`socket io disconnected: user:${user.id}, socket:${socketId}`);

      // execute when disconnect
      ctx.bean.io._unRegisterSocket(socketId);
      await ctx.bean.io.unsubscribeWhenDisconnect({ iid, user, socketId });
    }
  }
  return Middleware;
};


/***/ }),

/***/ 299:
/***/ ((module) => {

module.exports = () => {
  class Middleware {
    async execute(options, next) {
      await next();
    }
  }
  return Middleware;
};


/***/ }),

/***/ 288:
/***/ ((module) => {

module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { path, options, message, messageSyncs, messageClass } = context.data;
      return await this.ctx.bean.io.queueDelivery({ path, options, message, messageSyncs, messageClass });
    }

  }

  return Queue;
};


/***/ }),

/***/ 275:
/***/ ((module) => {

module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { path, options, message, messageClass } = context.data;
      return await this.ctx.bean.io.queueProcess({ path, options, message, messageClass });
    }

  }

  return Queue;
};


/***/ }),

/***/ 276:
/***/ ((module) => {

module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { options, message, messageSyncs, messageSync, messageClass } = context.data;
      return await this.ctx.bean.io.queuePush({ options, message, messageSyncs, messageSync, messageClass });
    }

  }

  return Queue;
};


/***/ }),

/***/ 52:
/***/ ((module) => {

module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { options, content, channel } = context.data;
      return await this.ctx.bean.io.queuePushDirect({ options, content, channel });
    }

  }

  return Queue;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {

  class Version extends app.meta.BeanBase {

    async update(options) {
      if (options.version === 1) {
        let sql;

        // create table: aSocketIOMessageClass
        sql = `
          CREATE TABLE aSocketIOMessageClass (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            messageClassName varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aSocketIOMessage
        sql = `
          CREATE TABLE aSocketIOMessage (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            messageClassId int(11) DEFAULT '0',
            messageType int(11) DEFAULT '0',
            messageFilter varchar(255) DEFAULT NULL,
            messageGroup int(11) DEFAULT '0',
            messageScene varchar(50) DEFAULT NULL,
            userIdTo int(11) DEFAULT '0',
            userIdFrom int(11) DEFAULT '0',
            sessionId varchar(255) DEFAULT NULL,
            content json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aSocketIOMessageSync
        sql = `
          CREATE TABLE aSocketIOMessageSync (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            messageId int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            messageDirection int(11) DEFAULT '0',
            messageRead int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create view: aSocketIOMessageView
        sql = `
          CREATE VIEW aSocketIOMessageView as
            select a.*,b.userId,b.messageDirection,b.messageRead,b.deleted as syncDeleted from aSocketIOMessage a
              left join aSocketIOMessageSync b on a.id=b.messageId
        `;
        await this.ctx.model.query(sql);

      }
    }

    async init(options) {
    }

    async test() {
    }

  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const localMessage = __webpack_require__(834);
const localMessageClass = __webpack_require__(45);
const localProcedure = __webpack_require__(716);
const broadcastSocketEmit = __webpack_require__(472);
const queueProcess = __webpack_require__(275);
const queueDelivery = __webpack_require__(288);
const queuePush = __webpack_require__(276);
const queuePushDirect = __webpack_require__(52);
const middlewareConnection = __webpack_require__(405);
const middlewarePacket = __webpack_require__(299);
const beanIO = __webpack_require__(35);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // local
    'local.message': {
      mode: 'ctx',
      bean: localMessage,
    },
    'local.messageClass': {
      mode: 'ctx',
      bean: localMessageClass,
    },
    'local.procedure': {
      mode: 'ctx',
      bean: localProcedure,
    },
    // broadcast
    'broadcast.socketEmit': {
      mode: 'app',
      bean: broadcastSocketEmit,
    },
    // queue
    'queue.process': {
      mode: 'app',
      bean: queueProcess,
    },
    'queue.delivery': {
      mode: 'app',
      bean: queueDelivery,
    },
    'queue.push': {
      mode: 'app',
      bean: queuePush,
    },
    'queue.pushDirect': {
      mode: 'app',
      bean: queuePushDirect,
    },
    // middleware
    'middleware.connection': {
      mode: 'ctx',
      bean: middlewareConnection,
    },
    'middleware.packet': {
      mode: 'ctx',
      bean: middlewarePacket,
    },
    // global
    io: {
      mode: 'ctx',
      bean: beanIO,
      global: true,
    },
  };
  return beans;
};


/***/ }),

/***/ 134:
/***/ ((module) => {

module.exports = (/* ctx*/) => {
  class IOChannelBase {

    async onPush(/* { content, options, message, messageSync, messageClass }*/) {
      return false;
    }

  }
  return IOChannelBase;
};


/***/ }),

/***/ 587:
/***/ ((module) => {

module.exports = ctx => {
  class IOMessageBase {

    async onSessionId({ /* path,*/ message /* options*/ }) {
      const userIdFrom = message.userIdFrom;
      const userIdTo = message.userIdTo;
      return message.messageGroup ? userIdTo : this._combineSessionId(userIdFrom, userIdTo);
    }

    async onGroupUsers(/* { path, message, options }*/) {
      return null;
    }

    async onProcess({ path, options, message, messageSyncs, groupUsers, messageClass }) {
      return await ctx.bean.io._onProcessBase({ path, options, message, messageSyncs, groupUsers, messageClass });
    }

    async onSaveSyncs({ path, options, message, groupUsers, messageClass }) {
      return await ctx.bean.io._onSaveSyncs({ path, options, message, groupUsers, messageClass });
    }

    async onPush({ options, message, messageSync, messageClass }) {
      return await ctx.bean.io.push({ options, message, messageSync, messageClass });
    }

    async onDelivery({ path, options, message, messageSync, messageClass }) {
      return await ctx.bean.io.delivery({ path, options, message, messageSync, messageClass });
    }

    async onChannelRender(/* { channelFullName, options, message, messageSync, messageClass }*/) {
      return null;
    }

    async publish({ path, message, messageClass, options }) {
      return await ctx.bean.io.publish({ path, message, messageClass, options });
    }

    // combine sessionId
    _combineSessionId(userIdFrom, userIdTo) {
      if (userIdFrom === userIdTo) return userIdFrom;
      return `${userIdFrom > userIdTo ? userIdFrom : userIdTo}:${userIdFrom < userIdTo ? userIdFrom : userIdTo}`;
    }

  }
  return IOMessageBase;
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    connection: {
      bean: 'connection',
      type: 'socketio.connection',
    },
    packet: {
      bean: 'packet',
      type: 'socketio.packet',
    },
  };

  // queues
  config.queues = {
    registerMessageClass: {
      bean: 'registerMessageClass',
    },
    process: {
      bean: 'process',
      concurrency: true,
    },
    delivery: {
      bean: 'delivery',
      concurrency: true,
    },
    push: {
      bean: 'push',
      concurrency: true,
    },
    pushDirect: {
      bean: 'pushDirect',
      concurrency: true,
    },
  };

  // broadcasts
  config.broadcasts = {
    socketEmit: {
      bean: 'socketEmit',
    },
  };

  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ }),

/***/ 519:
/***/ ((module) => {

module.exports = app => {
  class IOController extends app.Controller {

    async subscribe() {
      const res = await this.service.io.subscribe({
        subscribes: this.ctx.request.body.subscribes,
        socketId: this.ctx.request.body.socketId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async unsubscribe() {
      const res = await this.service.io.unsubscribe({
        subscribes: this.ctx.request.body.subscribes,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }
  return IOController;
};


/***/ }),

/***/ 222:
/***/ ((module) => {

module.exports = app => {
  class MessageController extends app.Controller {

    async offset() {
      const res = await this.ctx.service.message.offset({
        messageClass: this.ctx.request.body.messageClass,
        options: this.ctx.request.body.options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async select() {
      const options = this.ctx.request.body.options;
      options.page = this.ctx.bean.util.page(options.page);
      const items = await this.ctx.service.message.select({
        messageClass: this.ctx.request.body.messageClass,
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async count() {
      const options = this.ctx.request.body.options;
      const count = await this.ctx.service.message.count({
        messageClass: this.ctx.request.body.messageClass,
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(count);
    }

    async setRead() {
      const res = await this.ctx.service.message.setRead({
        messageIds: this.ctx.request.body.messageIds,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async delete() {
      const res = await this.ctx.service.message.delete({
        messageIds: this.ctx.request.body.messageIds,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }
  return MessageController;
};


/***/ }),

/***/ 916:
/***/ ((module) => {

module.exports = app => {
  class MessageClassController extends app.Controller {

    async messageClass() {
      const res = await this.ctx.service.messageClass.messageClass({
        messageClass: this.ctx.request.body.messageClass,
      });
      this.ctx.success(res);
    }

  }
  return MessageClassController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const io = __webpack_require__(519);
const messageClass = __webpack_require__(916);
const message = __webpack_require__(222);

module.exports = app => {
  const controllers = {
    io,
    messageClass,
    message,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);
const IOMessageBaseFn = __webpack_require__(587);
const IOChannelBaseFn = __webpack_require__(134);

module.exports = app => {

  // base
  app.meta.IOMessageBase = IOMessageBaseFn;
  app.meta.IOChannelBase = IOChannelBaseFn;

  // beans
  const beans = __webpack_require__(187)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  // services
  const services = __webpack_require__(214)(app);
  // models
  const models = __webpack_require__(230)(app);
  // meta
  const meta = __webpack_require__(458)(app);

  return {
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta,
  };

};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const schemas = __webpack_require__(232)(app);
  const meta = {
    base: {
      atoms: {
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 642:
/***/ ((module) => {

module.exports = app => {
  class Message extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aSocketIOMessage', options: { disableDeleted: false } });
    }
  }
  return Message;
};


/***/ }),

/***/ 801:
/***/ ((module) => {

module.exports = app => {
  class MessageClass extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aSocketIOMessageClass', options: { disableDeleted: false } });
    }
  }
  return MessageClass;
};


/***/ }),

/***/ 794:
/***/ ((module) => {

module.exports = app => {
  class MessageSync extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aSocketIOMessageSync', options: { disableDeleted: false } });
    }
  }
  return MessageSync;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const messageClass = __webpack_require__(801);
const message = __webpack_require__(642);
const messageSync = __webpack_require__(794);

module.exports = app => {
  const models = {
    messageClass,
    message,
    messageSync,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // io
    { method: 'post', path: 'subscribe', controller: 'io', meta: { auth: { user: true } } },
    { method: 'post', path: 'unsubscribe', controller: 'io', meta: { auth: { user: true } } },
    // messageClass
    { method: 'post', path: 'messageClass/messageClass', controller: 'messageClass', meta: { auth: { user: true } } },
    // message
    { method: 'post', path: 'message/offset', controller: 'message', meta: { auth: { user: true } } },
    { method: 'post', path: 'message/select', controller: 'message', meta: { auth: { user: true } } },
    { method: 'post', path: 'message/count', controller: 'message', meta: { auth: { user: true } } },
    { method: 'post', path: 'message/setRead', controller: 'message', meta: { auth: { user: true } } },
    { method: 'post', path: 'message/delete', controller: 'message', meta: { auth: { user: true } } },
  ];
  return routes;
};


/***/ }),

/***/ 626:
/***/ ((module) => {

module.exports = app => {

  class IO extends app.Service {

    async subscribe({ subscribes, socketId, user }) {
      return await this.ctx.bean.io.subscribe({ subscribes, socketId, user });
    }

    async unsubscribe({ subscribes, user }) {
      return await this.ctx.bean.io.unsubscribe({ subscribes, user });
    }

  }

  return IO;
};


/***/ }),

/***/ 833:
/***/ ((module) => {

module.exports = app => {

  class Message extends app.Service {

    async offset({ messageClass, options, user }) {
      return await this.ctx.bean.io.message.offset({ messageClass, options, user });
    }

    async select({ messageClass, options, user }) {
      return await this.ctx.bean.io.message.select({ messageClass, options, user });
    }

    async count({ messageClass, options, user }) {
      return await this.ctx.bean.io.message.count({ messageClass, options, user });
    }

    async setRead({ messageIds, user }) {
      return await this.ctx.bean.io.message.setRead({ messageIds, user });
    }

    async delete({ messageIds, user }) {
      return await this.ctx.bean.io.message.delete({ messageIds, user });
    }

  }

  return Message;
};


/***/ }),

/***/ 31:
/***/ ((module) => {

module.exports = app => {

  class MessageClass extends app.Service {

    async messageClass({ messageClass }) {
      return await this.ctx.bean.io.messageClass.get(messageClass);
    }

  }

  return MessageClass;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const io = __webpack_require__(626);
const messageClass = __webpack_require__(31);
const message = __webpack_require__(833);

module.exports = app => {
  const services = {
    io,
    messageClass,
    message,
  };
  return services;
};


/***/ }),

/***/ 718:
/***/ ((module) => {

"use strict";
module.exports = require("require3");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(421);
/******/ })()
;
//# sourceMappingURL=backend.js.map