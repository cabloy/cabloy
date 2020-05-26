const modelMessageFn = require('../../../model/message.js');
const modelMessageSyncFn = require('../../../model/messageSync.js');
const MessageClassFn = require('./messageClass.js');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IO {

    constructor() {
      this._modelMessage = null;
      this._modelMessageSync = null;
      this._messageClass = null;
      this._redis = null;
    }

    get modelMessage() {
      if (!this._modelMessage) this._modelMessage = new (modelMessageFn(ctx.app))(ctx);
      return this._modelMessage;
    }

    get modelMessageSync() {
      if (!this._modelMessageSync) this._modelMessageSync = new (modelMessageSyncFn(ctx.app))(ctx);
      return this._modelMessageSync;
    }

    get messageClass() {
      if (!this._messageClass) this._messageClass = new (MessageClassFn(ctx))();
      return this._messageClass;
    }

    get redis() {
      if (!this._redis) this._redis = ctx.app.redis.get('io') || ctx.app.redis.get('cache');
      return this._redis;
    }

    // subcribe
    //    hash key: userId:path
    //    hash value: scene -> workerId:socketId
    async subscribe({ subscribes, socketId, user }) {
      for (const item of subscribes) {
        const path = item.path;
        const scene = item.scene || '';
        const key = `${user.id}:${path}`;
        const value = `${ctx.app.meta.workerId}:${socketId}`;
        await this.redis.hset(key, scene, value);
      }
    }

    async unsubscribe({ subscribes, user }) {
      for (const item of subscribes) {
        const path = item.path;
        const scene = item.scene || '';
        const socketId = item.socketId;
        if (!socketId) continue;
        const key = `${user.id}:${path}`;
        // check if socketId is consistent
        const value = await this.redis.hget(key, scene);
        if (value && value.indexOf(socketId) > -1) {
          await this.redis.hdel(key, scene);
        }
      }
    }

    async unsubscribeWhenDisconnect({ user, socketId }) {
      const keyPrefix = this.redis.options.keyPrefix;
      const keyPatern = `${keyPrefix}${user.id}:*`;
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

    async publish({ path, message, messageClass, options, user }) {
      // options
      const messageScene = (options && options.scene) || null;
      // messageClass
      messageClass = await this.messageClass.get(messageClass);
      const _messageClass = this.messageClass.messageClass(messageClass);
      // onPublish by provider
      let sessionId;
      if (_messageClass.callbacks.onPublish) {
        sessionId = await _messageClass.callbacks.onPublish({ ctx, path, message, options, user });
      }
      // userId
      const userIdFrom = user.id;
      const userIdTo = message.userIdTo || userIdFrom;
      // sessionId
      if (!sessionId) {
        sessionId = message.messageGroup ? userIdTo : this._combineSessionId(userIdFrom, userIdTo);
      }
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
        content: JSON.stringify(message.content),
      };
      const res = await this.modelMessage.insert(_message);
      const messageId = res.insertId;
      // message sync
      //  :userIdFrom
      const isSame = userIdTo === userIdFrom;
      await this.modelMessageSync.insert({
        messageId,
        userId: userIdFrom,
        messageDirection: isSame ? 0 : 1, // self/send
        messageRead: 1,
      });
      //  :userIdTo
      if (!isSame) {
        await this.modelMessageSync.insert({
          messageId,
          userId: userIdTo,
          messageDirection: 2, // receive
          messageRead: 0,
        });
      }

      // ok
      return {
        id: messageId,
      };
    }

    // combine sessionid
    _combineSessionId(userIdFrom, userIdTo) {
      if (userIdFrom === userIdTo) return userIdFrom;
      return `${userIdFrom > userIdTo ? userIdFrom : userIdTo}:${userIdFrom < userIdTo ? userIdFrom : userIdTo}`;
    }


  }
  return IO;
};
