module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(1);
const uuid = require3('uuid');

const MessageClassFn = __webpack_require__(13);
const MessageFn = __webpack_require__(14);

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
        const pushContent = await onRender({ io: this, ctx, options, message, messageSync, messageClass });
        if (!pushContent) return false;
        // get channel base
        const channelBase = this.messageClass.channel(channelFullName);
        if (!channelBase) {
          ctx.logger.info(`channel not found: ${channelFullName}`);
          return false;
        }
        // push
        let pushDone = false;
        if (channelBase.callbacks.onPush) {
          pushDone = await channelBase.callbacks.onPush({ io: this, ctx, options, message, messageSync, messageClass, pushContent });
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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = app => {
  class MessageClass extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aSocketIOMessageClass', options: { disableDeleted: false } });
    }
  }
  return MessageClass;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = app => {
  class Message extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aSocketIOMessage', options: { disableDeleted: false } });
    }
  }
  return Message;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = app => {
  class MessageSync extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aSocketIOMessageSync', options: { disableDeleted: false } });
    }
  }
  return MessageSync;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(6);
const locales = __webpack_require__(8);
const errors = __webpack_require__(10);
const middlewares = __webpack_require__(11);

module.exports = app => {

  // routes
  const routes = __webpack_require__(18)(app);
  // services
  const services = __webpack_require__(23)(app);
  // models
  const models = __webpack_require__(28)(app);
  // meta
  const meta = __webpack_require__(29)(app);

  return {
    routes,
    services,
    models,
    config,
    locales,
    errors,
    middlewares,
    meta,
  };

};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const onSocketEmit = __webpack_require__(7);

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    connection: {
      type: 'socketio.connection',
    },
    packet: {
      type: 'socketio.packet',
    },
    io: {
      global: true,
      dependencies: 'instance',
    },
  };

  // queues
  config.queues = {
    registerMessageClass: {
      path: 'messageClass/queueRegister',
    },
    process: {
      path: 'io/queueProcess',
      concurrency: true,
    },
    delivery: {
      path: 'io/queueDelivery',
      concurrency: true,
    },
    push: {
      path: 'io/queuePush',
      concurrency: true,
    },
  };

  // broadcasts
  config.broadcasts = {
    socketEmit: {
      callback: onSocketEmit,
    },
  };

  return config;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

const SOCKETSONLINE = Symbol.for('APP#__SOCKETSONLINE');

module.exports = app => {
  return async function({ data }) {
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
  };
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(9),
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const connection = __webpack_require__(12);
const packet = __webpack_require__(16);
const io = __webpack_require__(17);

module.exports = {
  connection,
  packet,
  io,
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const IOFn = __webpack_require__(0);
module.exports = (options, app) => {
  return async (ctx, next) => {
    const io = new (IOFn(ctx))();
    // cache userId/socketId for disconnect
    const user = ctx.session.passport.user.op;
    if (user.anonymous) return ctx.throw(403);
    const iid = user.iid;
    const socketId = ctx.socket.id;
    io._registerSocket(socketId, ctx.socket);

    if (app.meta.isTest || app.meta.isLocal) app.logger.info(`socket io connected: user:${user.id}, socket:${socketId}`);
    await next();
    if (app.meta.isTest || app.meta.isLocal) app.logger.info(`socket io disconnected: user:${user.id}, socket:${socketId}`);

    // execute when disconnect
    io._unRegisterSocket(socketId);
    await io.unsubscribeWhenDisconnect({ iid, user, socketId });
  };
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const modelMessageClassFn = __webpack_require__(2);

const _cacheMessageClasses = {};
const _cacheChannels = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class MessageClass {

    constructor() {
      this._modelMessageClass = null;
    }

    get modelMessageClass() {
      if (!this._modelMessageClass) this._modelMessageClass = new (modelMessageClassFn(ctx.app))(ctx);
      return this._modelMessageClass;
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
      // queue
      return await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'registerMessageClass',
        data: { module, messageClassName },
      });
    }

    async queueRegister({ module, messageClassName }) {
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
        const _message = _messages[key];
        // titleLocale
        _message.info.titleLocale = ctx.text(_message.info.title);
        // ok
        messageClasses[key] = _message;
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
        const _channel = _channels[key];
        // titleLocale
        _channel.info.titleLocale = ctx.text(_channel.info.title);
        // ok
        channels[key] = _channel;
      }
      return channels;
    }


  }
  return MessageClass;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(1);
const uuid = require3('uuid');

const modelMessageFn = __webpack_require__(3);
const modelMessageSyncFn = __webpack_require__(4);
const sqlProcedureFn = __webpack_require__(15);

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


/***/ }),
/* 15 */
/***/ (function(module, exports) {

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
/* 16 */
/***/ (function(module, exports) {

module.exports = (options, app) => {
  return async (ctx, next) => {
    await next();
  };
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// io
const IOFn = __webpack_require__(0);
const IO = Symbol('CTX#__IO');

module.exports = () => {
  return async function io(ctx, next) {
    ctx.meta = ctx.meta || {};
    // io
    Object.defineProperty(ctx.meta, 'io', {
      get() {
        if (ctx.meta[IO] === undefined) {
          ctx.meta[IO] = new (IOFn(ctx))();
        }
        return ctx.meta[IO];
      },
    });
    // next
    await next();
  };
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(19);
const io = __webpack_require__(20);
const messageClass = __webpack_require__(21);
const message = __webpack_require__(22);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // io
    { method: 'post', path: 'subscribe', controller: io, meta: { auth: { user: true } } },
    { method: 'post', path: 'unsubscribe', controller: io, meta: { auth: { user: true } } },
    { method: 'post', path: 'io/queueProcess', controller: io, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'io/queueDelivery', controller: io, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'io/queuePush', controller: io, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    // messageClass
    { method: 'post', path: 'messageClass/queueRegister', controller: messageClass, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'messageClass/messageClass', controller: messageClass, meta: { auth: { user: true } } },
    // message
    { method: 'post', path: 'message/offset', controller: message, meta: { auth: { user: true } } },
    { method: 'post', path: 'message/select', controller: message, meta: { auth: { user: true } } },
    { method: 'post', path: 'message/count', controller: message, meta: { auth: { user: true } } },
    { method: 'post', path: 'message/setRead', controller: message, meta: { auth: { user: true } } },
    { method: 'post', path: 'message/delete', controller: message, meta: { auth: { user: true } } },
  ];
  return routes;
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = app => {
  class VersionController extends app.Controller {

    async update() {
      await this.service.version.update(this.ctx.request.body);
      this.ctx.success();
    }

    async init() {
      await this.service.version.init(this.ctx.request.body);
      this.ctx.success();
    }

    async test() {
      await this.service.version.test(this.ctx.request.body);
      this.ctx.success();
    }

  }
  return VersionController;
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = app => {
  class IOController extends app.Controller {

    async subscribe() {
      const res = await this.service.io.subscribe({
        subscribes: this.ctx.request.body.subscribes,
        socketId: this.ctx.request.body.socketId,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async unsubscribe() {
      const res = await this.service.io.unsubscribe({
        subscribes: this.ctx.request.body.subscribes,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async queueProcess() {
      const res = await this.service.io.queueProcess({
        path: this.ctx.request.body.path,
        options: this.ctx.request.body.options,
        message: this.ctx.request.body.message,
        messageClass: this.ctx.request.body.messageClass,
      });
      this.ctx.success(res);
    }

    async queueDelivery() {
      const res = await this.service.io.queueDelivery({
        path: this.ctx.request.body.path,
        options: this.ctx.request.body.options,
        message: this.ctx.request.body.message,
        messageSyncs: this.ctx.request.body.messageSyncs,
        messageClass: this.ctx.request.body.messageClass,
      });
      this.ctx.success(res);
    }

    async queuePush() {
      // messageSyncs/messageSync
      const res = await this.service.io.queuePush({
        options: this.ctx.request.body.options,
        message: this.ctx.request.body.message,
        messageSyncs: this.ctx.request.body.messageSyncs,
        messageSync: this.ctx.request.body.messageSync,
        messageClass: this.ctx.request.body.messageClass,
      });
      this.ctx.success(res);
    }

  }
  return IOController;
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = app => {
  class MessageClassController extends app.Controller {

    async queueRegister() {
      const res = await this.ctx.service.messageClass.queueRegister({
        module: this.ctx.request.body.module,
        messageClassName: this.ctx.request.body.messageClassName,
      });
      this.ctx.success(res);
    }

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
/* 22 */
/***/ (function(module, exports) {

module.exports = app => {
  class MessageController extends app.Controller {

    async offset() {
      const res = await this.ctx.service.message.offset({
        messageClass: this.ctx.request.body.messageClass,
        options: this.ctx.request.body.options,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async select() {
      const options = this.ctx.request.body.options;
      options.page = this.ctx.meta.util.page(options.page);
      const items = await this.ctx.service.message.select({
        messageClass: this.ctx.request.body.messageClass,
        options,
        user: this.ctx.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async count() {
      const options = this.ctx.request.body.options;
      const count = await this.ctx.service.message.count({
        messageClass: this.ctx.request.body.messageClass,
        options,
        user: this.ctx.user.op,
      });
      this.ctx.success(count);
    }

    async setRead() {
      const res = await this.ctx.service.message.setRead({
        messageIds: this.ctx.request.body.messageIds,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async delete() {
      const res = await this.ctx.service.message.delete({
        messageIds: this.ctx.request.body.messageIds,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

  }
  return MessageController;
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(24);
const io = __webpack_require__(25);
const messageClass = __webpack_require__(26);
const message = __webpack_require__(27);

module.exports = app => {
  const services = {
    version,
    io,
    messageClass,
    message,
  };
  return services;
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

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
/* 25 */
/***/ (function(module, exports) {

module.exports = app => {

  class IO extends app.Service {

    async subscribe({ subscribes, socketId, user }) {
      return await this.ctx.meta.io.subscribe({ subscribes, socketId, user });
    }

    async unsubscribe({ subscribes, user }) {
      return await this.ctx.meta.io.unsubscribe({ subscribes, user });
    }

    async queueProcess({ path, options, message, messageClass }) {
      return await this.ctx.meta.io.queueProcess({ path, options, message, messageClass });
    }

    async queueDelivery({ path, options, message, messageSyncs, messageClass }) {
      return await this.ctx.meta.io.queueDelivery({ path, options, message, messageSyncs, messageClass });
    }

    async queuePush({ options, message, messageSyncs, messageSync, messageClass }) {
      return await this.ctx.meta.io.queuePush({ options, message, messageSyncs, messageSync, messageClass });
    }

  }

  return IO;
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = app => {

  class MessageClass extends app.Service {

    async queueRegister({ module, messageClassName }) {
      return await this.ctx.meta.io.messageClass.queueRegister({ module, messageClassName });
    }

    async messageClass({ messageClass }) {
      return await this.ctx.meta.io.messageClass.get(messageClass);
    }

  }

  return MessageClass;
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = app => {

  class Message extends app.Service {

    async offset({ messageClass, options, user }) {
      return await this.ctx.meta.io.message.offset({ messageClass, options, user });
    }

    async select({ messageClass, options, user }) {
      return await this.ctx.meta.io.message.select({ messageClass, options, user });
    }

    async count({ messageClass, options, user }) {
      return await this.ctx.meta.io.message.count({ messageClass, options, user });
    }

    async setRead({ messageIds, user }) {
      return await this.ctx.meta.io.message.setRead({ messageIds, user });
    }

    async delete({ messageIds, user }) {
      return await this.ctx.meta.io.message.delete({ messageIds, user });
    }

  }

  return Message;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

const messageClass = __webpack_require__(2);
const message = __webpack_require__(3);
const messageSync = __webpack_require__(4);

module.exports = app => {
  const models = {
    messageClass,
    message,
    messageSync,
  };
  return models;
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  const schemas = __webpack_require__(30)(app);
  const meta = {
    base: {
      atoms: {
      },
      functions: {
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
    index: {
      indexes: {
        aSocketIOMessageClass: 'createdAt,updatedAt,module+messageClassName',
        aSocketIOMessage: 'createdAt,updatedAt,messageClassId,messageFilter,sessionId',
        aSocketIOMessageSync: 'createdAt,updatedAt,messageId,userId,messageRead',
      },
    },
  };
  return meta;
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map