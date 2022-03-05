const require3 = require('require3');
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

    _getSocketsOnline() {
      if (!ctx.app[SOCKETSONLINE]) {
        ctx.app[SOCKETSONLINE] = {};
      }
      return ctx.app[SOCKETSONLINE];
    }

    _registerSocket(socketId, socket) {
      const socketsOnline = this._getSocketsOnline();
      socketsOnline[socketId] = socket;
    }

    _unRegisterSocket(socketId) {
      const socketsOnline = this._getSocketsOnline();
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
      // messageClass
      messageClass = await this.messageClass.get(messageClass);
      const messageClassBase = this.messageClass.messageClass(messageClass);
      const beanMessage = this._getBeanMessage(messageClassBase);
      return await beanMessage.onPublish({ path, message, messageClass, options });
    }

    async _publish({ path, message, messageClass, options }) {
      // messageClass
      const messageClassBase = this.messageClass.messageClass(messageClass);
      const beanMessage = this._getBeanMessage(messageClassBase);
      // options
      options = options || {};
      // scene
      if (options.scene === undefined) {
        options.scene = ctx.headers['x-clientid'] || '';
      }
      const messageScene = options.scene;

      // message/userId
      message.userIdFrom = parseInt(message.userIdFrom || 0);
      if (message.userIdTo === undefined || message.userIdTo === null) message.userIdTo = -3;
      message.userIdTo = parseInt(message.userIdTo || 0);
      const userIdFrom = message.userIdFrom;
      const userIdTo = message.userIdTo;
      // userIdsTo
      if (message.userIdsTo) {
        message.userIdsTo = message.userIdsTo.map(userId => parseInt(userId));
      }
      // sessionId
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
      if (this._checkPersistence({ options, message, messageClass })) {
        _message.id = await this.message.save({ message: _message });
        _message.createdAt = new Date();
      } else {
        _message.id = message.id || uuid.v4();
        _message.createdAt = new Date();
      }

      // userIdsTo: not save, but use as save syncs
      if (message.userIdsTo) {
        _message.userIdsTo = message.userIdsTo;
      }

      // messageClass
      _message.module = messageClass.module;
      _message.messageClassName = messageClass.messageClassName;

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
      // messageSyncs
      const messageSyncs = await beanMessage.onSaveSyncs({ path, options, message, messageClass });
      // onProcess
      await beanMessage.onProcess({ path, options, message, messageSyncs, messageClass });
    }

    _checkPersistence({ options, message, messageClass }) {
      // 1.
      if (message.userIdTo === -2 || message.userIdsTo) return true;
      // 2.
      if (options && options.persistence !== undefined) return options.persistence;
      // 3.
      const messageClassBase = this.messageClass.messageClass(messageClass);
      return messageClassBase.info.persistence;
    }

    // support userIdTo/userIdsTo
    //   userIdTo: 0/-1/-2/-3
    async _onSaveSyncs({ path, options, message, messageClass }) {
      // messageClass
      const messageClassBase = this.messageClass.messageClass(messageClass);
      const beanMessage = this._getBeanMessage(messageClassBase);
      // persistence
      const persistence = this._checkPersistence({ options, message, messageClass });
      // messageClassId
      const messageClassId = messageClass.id;
      // messageId
      const messageId = message.id;
      // message syncs
      let messageSyncs = [];
      // saveLimit
      const saveLimit = ctx.config.module(moduleInfo.relativeName).message.sync.saveLimit;
      // sender
      //   not save ===0
      if (message.userIdFrom !== 0) {
        // save
        const messageSync = {
          messageClassId,
          messageId,
          userId: message.userIdFrom,
          messageDirection: 1,
          messageRead: 1,
        };
        if (persistence) {
          messageSync.id = await this.message.saveSync({ messageSync });
        } else {
          messageSync.id = uuid.v4();
        }
        // extensible
        await beanMessage.onSaveSync({ path, options, message, messageSync, messageClass });
        // push
        messageSyncs.push(messageSync);
      }
      // receiver
      await beanMessage.onSaveSyncsPolicy({
        path,
        options,
        message,
        messageClass,
        saveLimit,
        onSave: async userIds => {
          // over limit
          if (messageSyncs && messageSyncs.length > 1) {
            // means enter this callback again
            messageSyncs = null;
          }
          // syncs
          for (const userIdTo of userIds) {
            if (userIdTo !== message.userIdFrom && userIdTo !== 0) {
              // save
              const messageSync = {
                messageClassId,
                messageId,
                userId: userIdTo,
                messageDirection: 2, // receive
                messageRead: 0,
              };
              if (persistence) {
                messageSync.id = await this.message.saveSync({ messageSync });
              } else {
                messageSync.id = uuid.v4();
              }
              // extensible
              await beanMessage.onSaveSync({ path, options, message, messageSync, messageClass });
              // push
              if (messageSyncs) {
                messageSyncs.push(messageSync);
              }
            }
          }
        },
      });
      // array / null
      return messageSyncs;
    }

    // support userIdTo/userIdsTo
    //   userIdTo: 0/-1/-2/-3
    async _onSaveSyncsPolicy({ path, options, message, messageClass, saveLimit, onSave }) {
      // userIdsTo
      if (message.userIdsTo) {
        return await this._onSaveSyncsPolicy_userIdsTo({ path, options, message, messageClass, saveLimit, onSave });
      }
      // -1
      if (message.userIdTo === -1) {
        // only delivery to the online users
        return await onSave([message.userIdTo]);
      } else if (message.userIdTo === -2) {
        // all users
        return await this._onSaveSyncsPolicy_userIdsAll({ path, options, message, messageClass, saveLimit, onSave });
      } else if (message.userIdTo === -3) {
        // unkonwn user, but also should create messageSync for push
        return await onSave([message.userIdTo]);
      } else if (message.userIdTo === 0) {
        // system user: ignore
        return await onSave([]);
      }
      // normal user
      return await onSave([message.userIdTo]);
    }

    async _onSaveSyncsPolicy_userIdsTo({ message, saveLimit, onSave }) {
      const loop = Math.ceil(message.userIdsTo.length / saveLimit);
      for (let i = 0; i < loop; i++) {
        const userIds = message.userIdsTo.slice(i * saveLimit, (i + 1) * saveLimit);
        await onSave(userIds);
      }
    }

    async _onSaveSyncsPolicy_userIdsAll({ saveLimit, onSave }) {
      const modelUser = ctx.model.module('a-base').user;
      let offset = 0;
      // eslint-disable-next-line
      while (true) {
        // users
        const users = await modelUser.select({
          where: { disabled: 0 },
          columns: ['id'],
          limit: saveLimit,
          offset,
        });
        // save
        await onSave(users.map(item => item.id));
        // next
        if (users.length < saveLimit) {
          break;
        } else {
          offset += saveLimit;
        }
      }
    }

    async _onProcessBase({ path, options, message, messageSyncs, messageClass }) {
      // to queue: delivery/push
      if (path) {
        // try delivery first, then try push if failed
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
        await this._pushQueuePush({ options, message, messageSyncs, messageClass });
      }
    }

    // queue: delivery
    async queueDelivery({ path, options, message, messageSyncs, messageClass }) {
      // bean
      const messageClassBase = this.messageClass.messageClass(messageClass);
      const beanMessage = this._getBeanMessage(messageClassBase);
      // loop
      await this._loopMessageSyncs({
        options,
        message,
        messageSyncs,
        messageClass,
        onHandle: async messageSync => {
          if (messageSync.userId === -1) {
            // must be set path
            if (path) {
              // broadcast to online users
              const userIds = await this._getPathUsersOnline({ path });
              for (const userId of userIds) {
                const _messageSync = {
                  ...messageSync,
                  userId,
                };
                await beanMessage.onDelivery({ path, options, message, messageSync: _messageSync, messageClass });
              }
            }
          } else {
            // normal
            await beanMessage.onDelivery({ path, options, message, messageSync, messageClass });
          }
        },
      });
    }

    async _loopMessageSyncs({ message, messageSyncs, onHandle }) {
      // array
      if (messageSyncs) {
        for (const messageSync of messageSyncs) {
          await onHandle(messageSync);
        }
        return;
      }
      // from db
      // saveLimit
      const saveLimit = ctx.config.module(moduleInfo.relativeName).message.sync.saveLimit;
      const modelMessageSync = this.message.modelMessageSync;
      let offset = 0;
      // eslint-disable-next-line
      while (true) {
        // mess
        const messageSyncs = await modelMessageSync.select({
          where: {
            messageId: message.id,
            // messageRead:0, ??
          },
          limit: saveLimit,
          offset,
        });
        // handle
        for (const messageSync of messageSyncs) {
          await onHandle(messageSync);
        }
        // next
        if (messageSyncs.length < saveLimit) {
          break;
        } else {
          offset += saveLimit;
        }
      }
    }

    async _pushQueuePush({ options, message, messageSyncs, messageClass }) {
      // check if enable push
      const pushEnable = await this._checkPushEnable({ options, message, messageSyncs, messageClass });
      if (!pushEnable) return;
      // queue
      ctx.app.meta.queue.push({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'push',
        data: {
          options,
          message,
          messageSyncs,
          messageClass,
        },
      });
    }

    // queue: push
    async queuePush({ options, message, messageSyncs, messageClass }) {
      // bean
      const messageClassBase = this.messageClass.messageClass(messageClass);
      const beanMessage = this._getBeanMessage(messageClassBase);
      // loop
      await this._loopMessageSyncs({
        options,
        message,
        messageSyncs,
        messageClass,
        onHandle: async messageSync => {
          await beanMessage.onPush({ options, message, messageSync, messageClass });
        },
      });
    }

    async push({ options, message, messageSync, messageClass }) {
      // userId
      const userId = messageSync.userId;
      const isSender = message.userIdFrom === userId;
      // ignore sender
      if (isSender) return true;
      // adjust auto
      const autoFirstValid = !options || !options.push || options.push.AtMostOnce !== false;
      // channels
      const channels = await this._getChannels({ options, message, messageSync, messageClass });
      if (!channels) return false;
      // loop
      let atLeastDone = false;
      for (const channelFullName of channels) {
        const res = await this._pushChannel({ options, message, messageSync, messageClass, channelFullName });
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

    async _checkPushEnable({ options, message, messageSyncs, messageClass }) {
      // options maybe set push.channels
      const channels = options && options.push && options.push.channels;
      if (channels) return true;
      // bean
      const messageClassBase = this.messageClass.messageClass(messageClass);
      const beanMessage = this._getBeanMessage(messageClassBase);
      // check if enable push
      return await beanMessage.onPushEnable({ options, message, messageSyncs, messageClass });
    }

    async _getChannels({ options, message, messageSync, messageClass }) {
      // options maybe set push.channels
      const channels = options && options.push && options.push.channels;
      if (channels) return channels;
      // bean
      const messageClassBase = this.messageClass.messageClass(messageClass);
      const beanMessage = this._getBeanMessage(messageClassBase);
      return await beanMessage.onChannels({ options, message, messageSync, messageClass });
    }

    async _pushChannel({ options, message, messageSync, messageClass, channelFullName }) {
      try {
        // bean
        const messageClassBase = this.messageClass.messageClass(messageClass);
        const beanMessage = this._getBeanMessage(messageClassBase);
        if (!beanMessage) return false;
        // render message content
        const content = await beanMessage.onChannelRender({
          channelFullName,
          options,
          message,
          messageSync,
          messageClass,
        });
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
        return null;
      }
      // bean
      const beanFullName = `${channelBase.info.module}.io.channel.${channelBase.info.bean}`;
      const beanChannel = ctx.bean._getBean(beanFullName);
      if (!beanChannel) {
        ctx.logger.info(`channel bean not found: ${beanFullName}`);
        return null;
      }
      return beanChannel;
    }

    _getBeanMessage(messageClassBase) {
      // beanFullName
      let beanFullName;
      if (messageClassBase.info.bean) {
        beanFullName = `${messageClassBase.info.module}.io.message.${messageClassBase.info.bean}`;
      } else if (messageClassBase.info.uniform) {
        beanFullName = 'a-message.local.ioMessageUniformBase';
      } else {
        beanFullName = 'a-socketio.local.ioMessageBase';
      }
      // bean
      const beanMessage = ctx.bean._getBean(beanFullName);
      if (!beanMessage) {
        ctx.logger.info(`message bean not found: ${beanFullName}`);
        return null;
      }
      return beanMessage;
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

    async delivery({ path, options, message, messageSync, messageClass }) {
      // ignore delivery online if !path
      if (path) {
        const deliveryDone = await this.emit({ path, options, message, messageSync, messageClass });
        if (deliveryDone) return;
      }
      // to queue: push
      await this._pushQueuePush({ options, message, messageSyncs: [messageSync], messageClass });
    }

    // offline: return false
    //    hash key: userId:path
    //    hash value: scene -> workerId:socketId
    async emit({ path, options, message, messageSync /* , messageClass*/ }) {
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
          const value = values[field];
          const [workerId, socketId] = value.split(':');
          // check workerAlive
          const workerAlive = await ctx.app.bean.worker.getAlive({ id: workerId });
          if (workerAlive) {
            this._emitSocket({ path, message, workerId, socketId });
            bSent = true;
          } else {
            // only del on production
            if (ctx.app.meta.isProd) {
              await this.redis.hdel(key, field);
            }
          }
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

    async publishMessageSystem({ message }) {
      await this.publish({
        path: '/a/socketio/messageSystem',
        message,
        messageClass: {
          module: moduleInfo.relativeName,
          messageClassName: 'messageSystem',
        },
      });
    }
  }
  return IO;
};
