const require3 = require('require3');
const uuid = require3('uuid');

const MessageClassFn = require('./messageClass.js');
const MessageFn = require('./message.js');

const SOCKETSONLINE = Symbol.for('APP#__SOCKETSONLINE');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IO {

    constructor() {
      this._messageClass = null;
      this._message = null;
      this._redis = null;
    }

    get messageClass() {
      if (!this._messageClass) this._messageClass = new (MessageClassFn(ctx))();
      return this._messageClass;
    }

    get message() {
      if (!this._message) this._message = new (MessageFn(ctx))();
      return this._message;
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
      const messageScene = (options && options.scene) || '';
      // messageClass
      messageClass = await this.messageClass.get(messageClass);
      const messageClassBase = this.messageClass.messageClass(messageClass);
      // onPublish by provider
      let infoPublish;
      if (messageClassBase.callbacks.onPublish) {
        infoPublish = await messageClassBase.callbacks.onPublish({ io: this, ctx, path, message, options, user });
      }
      // userId
      const userIdFrom = user.id;
      const userIdTo = message.userIdTo || 0;
      // sessionId
      let sessionId = infoPublish && infoPublish.sessionId;
      if (!sessionId) {
        sessionId = message.messageGroup ? userIdTo : this._combineSessionId(userIdFrom, userIdTo);
      }
      // groupUsers
      const groupUsers = infoPublish && infoPublish.groupUsers;
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
          groupUsers,
          messageClass,
        },
      });

      // ok
      return {
        id: _message.id,
      };
    }

    async queueProcess({ path, options, message, groupUsers, messageClass }) {
      // messageClass
      const messageClassBase = this.messageClass.messageClass(messageClass);
      // onProcess
      let infoProcess;
      if (messageClassBase.callbacks.onProcess) {
        infoProcess = await messageClassBase.callbacks.onProcess({ io: this, ctx, path, options, message, groupUsers, messageClass });
      }
      // syncs
      let messageSyncs = infoProcess && infoProcess.messageSyncs;
      if (!messageSyncs) {
        // save syncs
        messageSyncs = await this.message.saveSyncs({
          message,
          groupUsers,
          persistence: messageClassBase.info.persistence,
        });
      }
      // to queue
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
    }

    async queueDelivery({ path, options, message, messageSyncs, messageClass }) {
      const messageClassBase = this.messageClass.messageClass(messageClass);
      for (const messageSync of messageSyncs) {
        if (messageClassBase.callbacks.onDelivery) {
          // custom
          await messageClassBase.callbacks.onDelivery({ io: this, ctx, path, options, message, messageSync, messageClass });
        } else {
          // default
          await this.emit({ path, options, message, messageSync, messageClass });
        }
      }
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
      // no scene
      if (!messageScene) {
        return await this._emitNoScene({ path, message, messageSync, messageScene });
      }
      // scene
      return await this._emitScene({ path, message, messageSync, messageScene });
    }

    async _emitNoScene({ path, message, messageSync, messageScene }) {
      // userId
      const userId = messageSync.userId;
      const isSender = message.userIdFrom === userId;
      // ignore sender
      if (isSender) return true;
      // get hash value
      const key = `${userId}:${path}`;
      const value = await this.redis.hget(key, messageScene);
      if (!value) return false; // offline
      // emit
      const [ workerId, socketId ] = value.split(':');
      this._emitSocket({ path, message, workerId, socketId });
      // done
      return true;
    }

    async _emitScene({ path, message, messageSync, messageScene }) {
      // userId
      const userId = messageSync.userId;
      const isSender = message.userIdFrom === userId;
      // get hash value
      const key = `${userId}:${path}`;
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

    // combine sessionId
    _combineSessionId(userIdFrom, userIdTo) {
      if (userIdFrom === userIdTo) return userIdFrom;
      return `${userIdFrom > userIdTo ? userIdFrom : userIdTo}:${userIdFrom < userIdTo ? userIdFrom : userIdTo}`;
    }

  }
  return IO;
};
