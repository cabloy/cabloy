const modelMessageFn = require('../../../model/message.js');
const modelMessageSyncFn = require('../../../model/messageSync.js');
const MessageClassFn = require('./messageClass.js');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
        console.log('----subscribe:', key, scene, value);
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
      const messageScene = (options && options.scene) || '';
      // messageClass
      messageClass = await this.messageClass.get(messageClass);
      const messageClassBase = this.messageClass.messageClass(messageClass);
      // onPublish by provider
      let info;
      if (messageClassBase.callbacks.onPublish) {
        info = await messageClassBase.callbacks.onPublish({ io: this, ctx, path, message, options, user });
      }
      // userId
      const userIdFrom = user.id;
      const userIdTo = message.userIdTo || 0;
      // sessionId
      let sessionId = info && info.sessionId;
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
        content: JSON.stringify(message.content), // should use string for db/queue
      };
      const res = await this.modelMessage.insert(_message);
      const messageId = res.insertId;
      _message.id = messageId;
      // message sync
      const messageSyncs = [];
      //  :userIdFrom
      const isSame = userIdTo === userIdFrom;
      messageSyncs.push({
        messageId,
        userId: userIdFrom,
        messageDirection: isSame ? 0 : 1, // self/send
        messageRead: 1,
      });
      //  :userIdTo
      if (!message.messageGroup) {
        // single chat
        if (!isSame) {
          messageSyncs.push({
            messageId,
            userId: userIdTo,
            messageDirection: 2, // receive
            messageRead: 0,
          });
        }
      } else {
        // group chat
        const groupUsers = info && info.groupUsers;
        if (groupUsers) {
          for (const groupUser of groupUsers) {
            const _userIdTo = groupUser.userId;
            if (_userIdTo !== userIdFrom) {
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

      // to queue
      ctx.app.meta.queue.push({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'process',
        data: {
          path,
          options,
          message: _message,
          messageSyncs,
          messageClass,
        },
      });

      // ok
      return {
        id: messageId,
      };
    }

    async queueProcess({ path, options, message, messageSyncs, messageClass }) {
      console.log('----queueProcess:', message.id);
      const messageClassBase = this.messageClass.messageClass(messageClass);
      if (!messageClassBase.callbacks.onProcess) return;
      for (const messageSync of messageSyncs) {
        await messageClassBase.callbacks.onProcess({ io: this, path, options, message, messageSync, messageClass });
      }
    }

    // offline: return false
    //    hash key: userId:path
    //    hash value: scene -> workerId:socketId
    async emit({ path, options, message, messageSync, messageClass }) {
      // userId
      const userId = messageSync.userId;
      if (!userId) return true;
      // options
      const messageScene = (options && options.scene) || '';
      const key = `${userId}:${path}`;
      // not check scene
      if (!messageScene) {
        // ignore self
        if (message.userIdFrom === userId) return true;
        // get hash value
        console.log('---------tobesend:', key, messageScene);
        const value = await this.redis.hget(key, messageScene);
        if (!value) return false; // offline
        console.log('---------tobesend:', value);
        return true;
      }


    }

    // combine sessionId
    _combineSessionId(userIdFrom, userIdTo) {
      if (userIdFrom === userIdTo) return userIdFrom;
      return `${userIdFrom > userIdTo ? userIdFrom : userIdTo}:${userIdFrom < userIdTo ? userIdFrom : userIdTo}`;
    }

  }
  return IO;
};
