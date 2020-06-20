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
      const saveMessageAsync = (options && options.saveMessageAsync) || false;
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
      let sessionId;
      if (messageClassBase.callbacks.onSessionId) {
        sessionId = await messageClassBase.callbacks.onSessionId({ io: this, ctx, path, message, options });
      }
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

      // save message async
      if (messageClassBase.info.persistence && saveMessageAsync) {
        // must use pushAsync for the correct order of message id
        return await ctx.app.meta.queue.pushAsync({
          subdomain: ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'saveMessage',
          data: {
            path,
            options,
            message: _message,
            messageClass,
          },
        });
      }

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

    // queue: saveMessage async
    async queueSaveMessage({ path, options, message, messageClass }) {
      // save message async
      message.id = await this.message.save({ message });
      // to queue
      ctx.app.meta.queue.push({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'process',
        data: {
          path,
          options,
          message,
          messageClass,
        },
      });
      // ok
      return {
        id: message.id,
      };
    }

    // queue: process
    async queueProcess({ path, options, message, messageClass }) {
      // messageClass
      const messageClassBase = this.messageClass.messageClass(messageClass);
      // groupUsers
      let groupUsers;
      if (messageClassBase.callbacks.onGroupUsers) {
        groupUsers = await messageClassBase.callbacks.onGroupUsers({ io: this, ctx, path, message, options });
      }
      // onProcess
      if (messageClassBase.callbacks.onProcess) {
        await messageClassBase.callbacks.onProcess({ io: this, ctx, path, options, message, groupUsers, messageClass });
      }
      // save syncs
      const messageSyncs = await this.message.saveSyncs({
        message,
        groupUsers,
        persistence: messageClassBase.info.persistence,
      });
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
      if (messageClassBase.callbacks.onPush) {
        // custom
        await messageClassBase.callbacks.onPush({ io: this, ctx, options, message, messageSync, messageClass });
      } else {
        // default
        await this.push({ options, message, messageSync, messageClass });
      }
    }

    async push({ options, message, messageSync, messageClass }) {
      const messageClassBase = this.messageClass.messageClass(messageClass);
      // userId
      const userId = messageSync.userId;
      const isSender = message.userIdFrom === userId;
      // ignore sender
      if (isSender) return true;
      // options maybe set push.channels
      let channels = options && options.push && options.channels;
      if (!channels) channels = messageClassBase.info.push.channels;
      if (!channels) return false;
      // adjust auto
      let autoFirstValid = false;
      if (channels === 'auto') {
        autoFirstValid = true;
        channels = Object.keys(messageClassBase.channels);
      }
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
        // render message content
        const onRender = messageClassBase.channels[channelFullName] && messageClassBase.channels[channelFullName].onRender;
        if (!onRender) return false;
        const content = await onRender({ io: this, ctx, options, message, messageSync, messageClass });
        if (!content) return false;
        // get channel base
        const channelBase = this.messageClass.channel(channelFullName);
        if (!channelBase) {
          ctx.logger.info(`channel not found: ${channelFullName}`);
          return false;
        }
        // push
        let pushDone = false;
        if (channelBase.callbacks.onPush) {
          pushDone = await channelBase.callbacks.onPush({ io: this, ctx, content, options, message, messageSync, messageClass });
        }
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
      const channelBase = this.messageClass.channel(channelFullName);
      if (!channelBase) {
        ctx.logger.info(`channel not found: ${channelFullName}`);
        return false;
      }
      if (!channelBase.callbacks.onPush) return false;
      const pushDone = await channelBase.callbacks.onPush({ io: this, ctx, content, options });
      // done
      return pushDone;
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
      if (messageClassBase.callbacks.onDelivery) {
        // custom
        await messageClassBase.callbacks.onDelivery({ io: this, ctx, path, options, message, messageSync, messageClass });
      } else {
        // default
        await this.delivery({ path, options, message, messageSync, messageClass });
      }
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
      const key = `${ctx.instance.id}:${userId}:${path}`;
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

    // combine sessionId
    _combineSessionId(userIdFrom, userIdTo) {
      if (userIdFrom === userIdTo) return userIdFrom;
      return `${userIdFrom > userIdTo ? userIdFrom : userIdTo}:${userIdFrom < userIdTo ? userIdFrom : userIdTo}`;
    }

  }
  return IO;
};
