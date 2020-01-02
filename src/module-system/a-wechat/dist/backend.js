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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const bb = require3('bluebird');

module.exports = function(ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class WechatHelper {

    getSceneInfo(scene) {
      if (scene === 1) return { authProvider: 'wechat' };
      if (scene === 2) return { authProvider: 'wechatMini' };
    }

    // scene: 1/wechat 2/wechatMini
    async verifyAuthUser({ scene, openid, userInfo, cbVerify }) {
      // ensure wechat user
      const userWechatId = await this._ensureWechatUser({ scene, openid, userInfo });
      // ensure auth user
      const profileUser = await this._ensureAuthUser({ scene, openid, userInfo });
      // verify
      let verifyUser;
      if (!cbVerify) {
        verifyUser = await ctx.meta.user.verify({ state: 'login', profileUser });
        await ctx.login(verifyUser);
      } else {
        verifyUser = await bb.fromCallback(cb => {
          cbVerify(profileUser, cb);
        });
      }
      // update wechat userId
      await ctx.model.wechatUser.update({ id: userWechatId, userId: verifyUser.agent.id });
      // ok
      return verifyUser;
    }

    async _ensureWechatUser({ scene, openid, userInfo }) {
      let userWechatId;
      // wechat user
      let userWechat = await ctx.model.wechatUser.get({ openid });
      const exists = !!userWechat;
      if (!userWechat) {
        userWechat = {};
      } else {
        userWechatId = userWechat.id;
        delete userWechat.createdAt;
        delete userWechat.updatedAt;
        delete userWechat.deleted;
        delete userWechat.iid;
        delete userWechat.userId;
      }
      // check fields
      let needUpdate = false;
      const fields = [ 'scene', 'openid', 'unionid', 'nickname', 'subscribe', 'sex', 'language', 'city', 'province', 'country', 'headimgurl', 'subscribe_time', 'remark', 'groupid', 'subscribe_scene', 'qr_scene', 'qr_scene_str' ];
      userInfo.scene = scene;
      for (const field of fields) {
        if (userInfo[field] === undefined || userInfo[field] === userWechat[field]) {
          delete userWechat[field];
        } else {
          userWechat[field] = userInfo[field];
          needUpdate = true;
        }
      }
      // update
      if (needUpdate) {
        if (!exists) {
          const res = await ctx.model.wechatUser.insert(userWechat);
          userWechatId = res.insertId;
        } else {
          await ctx.model.wechatUser.update(userWechat);
        }
      }
      // ok
      return userWechatId;
    }

    // profileId : unionid:openid
    async _ensureAuthUser({ scene, openid, userInfo }) {
      const sceneInfo = this.getSceneInfo(scene);
      const unionid = userInfo.unionid || '';
      const profileId = `${unionid}:${openid}`;
      const profileUser = {
        module: moduleInfo.relativeName,
        provider: sceneInfo.authProvider,
        profileId,
        profile: {
          id: profileId,
          userName: userInfo.nickname,
          realName: userInfo.nickname,
          avatar: userInfo.headimgurl,
          profile: userInfo,
        },
      };
      // provider
      const providerItem = await ctx.meta.user.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: sceneInfo.authProvider,
      });
      // check auth
      let authId;
      let authUserId;
      const authItems = await ctx.model.query(
        `select * from aAuth a where a.deleted=0 and a.iid=? and a.providerId=? and a.profileId like '%:${openid}'`,
        [ ctx.instance.id, providerItem.id ]
      );
      const authItem = authItems[0];
      if (!authItem) {
        // insert auth
        const res = await ctx.model.auth.insert({
          providerId: providerItem.id,
          profileId,
          profile: JSON.stringify(profileUser.profile),
        });
        authId = res.insertId;
      } else {
        // always update
        await ctx.model.auth.update({
          id: authItem.id,
          profileId,
          profile: JSON.stringify(profileUser.profile),
        });
        authId = authItem.id;
        authUserId = authItem.userId;
      }
      // check if has userId for unionid
      if (unionid) {
        const _authOthers = await ctx.model.query(
          `select * from aAuth a where a.deleted=0 and a.iid=? and a.profileId like '${unionid}:%' and a.id<>?`,
          [ ctx.instance.id, authId ]
        );
        const _authOther = _authOthers[0];
        if (_authOther && _authOther.userId !== authUserId) {
          // update userId for this auth
          await ctx.model.auth.update({ id: authId, userId: _authOther.userId });
        }
      }
      // ready
      return profileUser;
    }

  }

  return WechatHelper;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const crypto = __webpack_require__(16);
const require3 = __webpack_require__(0);
const bb = require3('bluebird');
const xml2js = require3('xml2js');

module.exports = {
  createNonceStr() {
    return Math.random().toString(36).substr(2, 15);
  },
  createTimestamp() {
    return '' + Math.floor(Date.now() / 1000);
  },
  calcSignature({ options, join = '', hash = 'sha1' }) {
    const hashsum = crypto.createHash(hash);
    hashsum.update(options.join(join));
    return hashsum.digest('hex');
  },
  async parseXML({ xml, trim = true, explicitArray = false, explicitRoot = false }) {
    const parser = new xml2js.Parser({ trim, explicitArray, explicitRoot });
    return await bb.fromCallback(cb => {
      parser.parseString(xml, cb);
    });
  },
  buildXML({ xml, cdata = true, headless = true, rootName = 'xml' }) {
    return (new xml2js.Builder({ cdata, headless, rootName })).buildObject(xml);
  },
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(4);
const locales = __webpack_require__(5);
const errors = __webpack_require__(7);
const middlewares = __webpack_require__(8);

module.exports = app => {

  // routes
  const routes = __webpack_require__(13)(app);
  // services
  const services = __webpack_require__(21)(app);
  // models
  const models = __webpack_require__(28)(app);
  // meta
  const meta = __webpack_require__(31)(app);

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
/* 4 */
/***/ (function(module, exports) {


const jsApiList = [
  'checkJsApi',
  'updateAppMessageShareData',
  'updateTimelineShareData',
  'onMenuShareWeibo',
  // 'onMenuShareTimeline',
  // 'onMenuShareAppMessage',
  // 'onMenuShareQQ',
  // 'onMenuShareQZone',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'translateVoice',
  'startRecord',
  'stopRecord',
  'onRecordEnd',
  'playVoice',
  'pauseVoice',
  'stopVoice',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard',
];

module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    wechat: {
      global: false,
      dependencies: 'instance',
    },
    wechatMini: {
      global: false,
      dependencies: 'instance',
    },
    inWechat: {
      global: false,
      dependencies: 'instance',
    },
    inWechatMini: {
      global: false,
      dependencies: 'instance',
    },
  };

  // account
  config.account = {};

  // account.public
  config.account.public = {
    appID: '',
    appSecret: '',
    token: appInfo.name,
    encodingAESKey: '',
    message: {
      reply: {
        default: 'You are welcome!',
        subscribe: 'You are subscribed!',
      },
    },
    jssdk: {
      debug: false,
      jsApiList,
    },
  };

  // account.mini
  config.account.mini = {
    appID: '',
    appSecret: '',
    token: appInfo.name,
    encodingAESKey: '',
  };

  return config;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(6),
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = {
  'Not In Wechat': '不在微信内部',
  'Not In Wechat Miniprogram': '不在微信小程序内部',
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'Not In Wechat',
  1002: 'Not In Wechat Miniprogram',
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const wechat = __webpack_require__(9);
const wechatMini = __webpack_require__(10);
const inWechat = __webpack_require__(11);
const inWechatMini = __webpack_require__(12);

module.exports = {
  wechat,
  wechatMini,
  inWechat,
  inWechatMini,
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const WechatAPI = require3('@zhennann/co-wechat-api');
const WECHAT = Symbol('CTX#WECHAT');

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createWechatApi({ ctx }) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.public;
    // api
    const api = new WechatAPI(config.appID, config.appSecret,
      async function() {
        const cacheKey = 'wechat-token';
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(token) {
        const cacheKey = 'wechat-token';
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
      }
    );
    // registerTicketHandle
    api.registerTicketHandle(
      async function(type) {
        const cacheKey = `wechat-jsticket:${type}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(type, token) {
        const cacheKey = `wechat-jsticket:${type}`;
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
      }
    );
    // ready
    return api;
  }

  return async function wechat(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'wechat', {
      get() {
        if (ctx.meta[WECHAT] === undefined) {
          ctx.meta[WECHAT] = _createWechatApi({ ctx });
        }
        return ctx.meta[WECHAT];
      },
    });

    // next
    await next();
  };

};



/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const WechatAPI = require3('@zhennann/co-wechat-api');
const WECHATMINI = Symbol('CTX#WECHATMINI');

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createWechatMiniApi({ ctx }) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.mini;
    // api
    const api = new WechatAPI(config.appID, config.appSecret,
      async function() {
        const cacheKey = 'wechatmini-token';
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(token) {
        const cacheKey = 'wechatmini-token';
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
      }
    );
    // registerTicketHandle
    api.registerTicketHandle(
      async function(type) {
        const cacheKey = `wechatmini-jsticket:${type}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(type, token) {
        const cacheKey = `wechatmini-jsticket:${type}`;
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
      }
    );
    // registerSessionKeyHandle
    api.registerSessionKeyHandle(
      async function() {
        const cacheKey = `wechatmini-sessionKey:${ctx.user.agent.id}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(sessionKey) {
        const cacheKey = `wechatmini-sessionKey:${ctx.user.agent.id}`;
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, sessionKey);
      }
    );
    // ready
    return api;
  }

  return async function wechatMini(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'wechatMini', {
      get() {
        if (ctx.meta[WECHATMINI] === undefined) {
          ctx.meta[WECHATMINI] = _createWechatMiniApi({ ctx });
        }
        return ctx.meta[WECHATMINI];
      },
    });

    // next
    await next();
  };

};



/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function inWechat(ctx, next) {
    const provider = ctx.user && ctx.user.provider;
    const ok = (provider && provider.module === moduleInfo.relativeName && provider.providerName === 'wechat');
    if (!ok) ctx.throw.module(moduleInfo.relativeName, 1001);
    // next
    await next();
  };
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function inWechatMini(ctx, next) {
    const provider = ctx.user && ctx.user.provider;
    const ok = (provider && provider.module === moduleInfo.relativeName && provider.providerName === 'wechatMini');
    if (!ok) ctx.throw.module(moduleInfo.relativeName, 1002);
    // next
    await next();
  };
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(14);
const message = __webpack_require__(15);
const event = __webpack_require__(17);
const jssdk = __webpack_require__(18);
const messageMini = __webpack_require__(19);
const authMini = __webpack_require__(20);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // message
    { method: 'get', path: 'message/index', controller: message, middlewares: 'wechat', meta: { auth: { enable: false } } },
    { method: 'post', path: 'message/index', controller: message, middlewares: 'wechat', meta: { auth: { enable: false } } },
    // jsapi
    { method: 'post', path: 'jssdk/jsconfig', controller: jssdk, middlewares: 'wechat' },
    // event
    { method: 'post', path: 'event/loginInfo', controller: event, middlewares: 'inner', meta: { auth: { enable: false } } },

    // messageMini
    { method: 'get', path: 'messageMini/index', controller: messageMini, middlewares: 'wechatMini', meta: { auth: { enable: false } } },
    { method: 'post', path: 'messageMini/index', controller: messageMini, middlewares: 'wechatMini', meta: { auth: { enable: false } } },
    // authMini
    { method: 'post', path: 'authMini/login', controller: authMini, middlewares: 'wechatMini', meta: { auth: { enable: false } } },

  ];
  return routes;
};


/***/ }),
/* 14 */
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const WechatCrypto = require3('wechat-crypto');
const wechatUtils = __webpack_require__(2);

module.exports = app => {
  class MessageController extends app.Controller {

    async index() {
      // query
      const query = this.ctx.query;
      // config
      const config = this.ctx.config.account.public;
      // encrypted
      const encrypted = query.encrypt_type === 'aes';
      // wechat crypto
      const wechatCrypto = encrypted ? new WechatCrypto(config.token, config.encodingAESKey, config.appID) : null;
      // parse
      let messageIn;
      if (this.ctx.method === 'GET') {
        messageIn = await this._parseMessageGet({ query, config, encrypted, wechatCrypto });
        // ok
        this.ctx.status = 200;
        this.ctx.type = 'text/plain';
        this.ctx.body = messageIn.echostr;
      } else {
        messageIn = await this._parseMessagePost({ query, config, encrypted, wechatCrypto });
        // handle
        let resXML;
        const messageOut = await this.ctx.service.message.index({ message: messageIn });
        if (!messageOut) {
          resXML = '';
        } else {
          resXML = wechatUtils.buildXML({ xml: messageOut });
          if (encrypted) {
            const wrap = {};
            wrap.Encrypt = wechatCrypto.encrypt(resXML);
            wrap.TimeStamp = wechatUtils.createTimestamp();
            wrap.Nonce = wechatUtils.createNonceStr();
            wrap.MsgSignature = wechatCrypto.getSignature(wrap.TimeStamp, wrap.Nonce, wrap.Encrypt);
            resXML = wechatUtils.buildXML({ xml: wrap });
          }
        }
        // ok
        this.ctx.status = 200;
        this.ctx.type = 'text/xml';
        this.ctx.body = resXML;
      }
    }

    async _parseMessageGet({ query, config, encrypted, wechatCrypto }) {
      // check if valid
      let valid = false;
      if (encrypted) {
        valid = query.msg_signature === wechatCrypto.getSignature(query.timestamp, query.nonce, query.echostr);
      } else {
        valid = query.signature === wechatUtils.calcSignature({ options: [ config.token, query.timestamp, query.nonce ].sort() });
      }
      if (!valid) this.ctx.throw(401);
      // decrypt
      if (encrypted) {
        const res = wechatCrypto.decrypt(query.echostr);
        return { echostr: res.message };
      }
      return { echostr: query.echostr };
    }

    async _parseMessagePost({ query, config, encrypted, wechatCrypto }) {
      // xml raw
      let xmlRaw;
      if (typeof this.ctx.request.body === 'string') {
        xmlRaw = this.ctx.request.body;
      } else {
        const payload = await this.ctx.getPayload();
        xmlRaw = payload.toString();
      }
      // parse xml
      let xml = await wechatUtils.parseXML({ xml: xmlRaw });
      // check if valid
      let valid = false;
      if (encrypted) {
        valid = query.msg_signature === wechatCrypto.getSignature(query.timestamp, query.nonce, xml.Encrypt);
      } else {
        valid = query.signature === wechatUtils.calcSignature({ options: [ config.token, query.timestamp, query.nonce ].sort() });
      }
      if (!valid) this.ctx.throw(401);
      // decrypt
      if (encrypted) {
        const res = wechatCrypto.decrypt(xml.Encrypt);
        xml = await wechatUtils.parseXML({ xml: res.message });
      }
      return xml;
    }

  }
  return MessageController;
};



/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = app => {
  class EventController extends app.Controller {

    async loginInfo() {
      const res = await this.service.event.loginInfo({
        event: this.ctx.request.body.event,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

  }
  return EventController;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = app => {
  class JSSDKController extends app.Controller {

    async jsconfig() {
      const res = await this.service.jssdk.jsconfig({
        url: this.ctx.request.body.url,
      });
      this.ctx.success(res);
    }

  }
  return JSSDKController;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const WechatCrypto = require3('wechat-crypto');
const wechatUtils = __webpack_require__(2);

module.exports = app => {
  class MessageMiniController extends app.Controller {

    async index() {
      // query
      const query = this.ctx.query;
      // config
      const config = this.ctx.config.account.mini;
      // encrypted
      const encrypted = query.encrypt_type === 'aes';
      // wechat crypto
      const wechatCrypto = encrypted ? new WechatCrypto(config.token, config.encodingAESKey, config.appID) : null;
      // parse
      let messageIn;
      if (this.ctx.method === 'GET') {
        messageIn = await this._parseMessageGet({ query, config, encrypted, wechatCrypto });
        // ok
        this.ctx.status = 200;
        this.ctx.type = 'text/plain';
        this.ctx.body = messageIn.echostr;
      } else {
        messageIn = await this._parseMessagePost({ query, config, encrypted, wechatCrypto });
        // handle
        await this.ctx.service.messageMini.index({ message: messageIn });
        // ok
        this.ctx.status = 200;
        this.ctx.type = 'text/plain';
        this.ctx.body = '';
      }
    }

    async _parseMessageGet({ query, config, encrypted, wechatCrypto }) {
      // check if valid
      let valid = false;
      if (encrypted) {
        valid = query.msg_signature === wechatCrypto.getSignature(query.timestamp, query.nonce, query.echostr);
      } else {
        valid = query.signature === wechatUtils.calcSignature({ options: [ config.token, query.timestamp, query.nonce ].sort() });
      }
      if (!valid) this.ctx.throw(401);
      // decrypt
      if (encrypted) {
        const res = wechatCrypto.decrypt(query.echostr);
        return { echostr: res.message };
      }
      return { echostr: query.echostr };
    }

    async _parseMessagePost({ query, config, encrypted, wechatCrypto }) {
      let messageIn = this.ctx.request.body;
      // check if valid
      let valid = false;
      if (encrypted) {
        valid = query.msg_signature === wechatCrypto.getSignature(query.timestamp, query.nonce, messageIn.Encrypt);
      } else {
        valid = query.signature === wechatUtils.calcSignature({ options: [ config.token, query.timestamp, query.nonce ].sort() });
      }
      if (!valid) this.ctx.throw(401);
      // decrypt
      if (encrypted) {
        const res = wechatCrypto.decrypt(messageIn.Encrypt);
        messageIn = JSON.parse(res.message);
      }
      return messageIn;
    }

  }
  return MessageMiniController;
};



/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = app => {
  class AuthMiniController extends app.Controller {

    async login() {
      const res = await this.service.authMini.login({
        code: this.ctx.request.body.code,
        detail: this.ctx.request.body.detail,
      });
      this.ctx.success(res);
    }

  }
  return AuthMiniController;
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(22);
const message = __webpack_require__(23);
const event = __webpack_require__(24);
const jssdk = __webpack_require__(25);
const messageMini = __webpack_require__(26);
const authMini = __webpack_require__(27);

module.exports = app => {
  const services = {
    version,
    message,
    event,
    jssdk,
    messageMini,
    authMini,
  };
  return services;
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {

        // create table: aWechatUser
        const sql = `
          CREATE TABLE aWechatUser (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            scene int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            openid varchar(255) DEFAULT NULL,
            unionid varchar(255) DEFAULT NULL,
            nickname varchar(50) DEFAULT NULL,
            subscribe int(11) DEFAULT '0',
            sex int(11) DEFAULT '0',
            language varchar(50) DEFAULT NULL,
            city varchar(50) DEFAULT NULL,
            province varchar(50) DEFAULT NULL,
            country varchar(50) DEFAULT NULL,
            headimgurl varchar(255) DEFAULT NULL,
            subscribe_time int(11) DEFAULT '0',
            remark varchar(255) DEFAULT NULL,
            groupid int(11) DEFAULT '0',
            subscribe_scene varchar(50) DEFAULT NULL,
            qr_scene int(11) DEFAULT '0',
            qr_scene_str varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const WechatHelperFn = __webpack_require__(1);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {

    async index({ message }) {
      let res;
      // event: subscribe
      if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
          res = await this._subscribeUser({ openid: message.FromUserName, message });
        } else if (message.Event === 'unsubscribe') {
          res = await this._unsubscribeUser({ openid: message.FromUserName, message });
        }
      }
      // raise event
      const res2 = await this.ctx.meta.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessage',
        data: { message },
      });
      if (res2) res = res2;
      // check if ready
      if (res) return res;
      // default reply
      return {
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: this.ctx.config.account.public.message.reply.default,
      };
    }

    async _subscribeUser({ openid, message }) {
      // user info
      const userInfo = await this.ctx.meta.wechat.getUser({ openid });
      // verify auth user
      const wechatHelper = new (WechatHelperFn(this.ctx))();
      await wechatHelper.verifyAuthUser({ scene: 1, openid, userInfo });
      // ok
      return {
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: this.ctx.config.account.public.message.reply.subscribe,
      };
    }

    async _unsubscribeUser({ openid, message }) {
      // wechat user
      const userWechat = await this.ctx.model.wechatUser.get({ openid });
      if (userWechat) {
        await this.ctx.model.wechatUser.update({
          id: userWechat.id, subscribe: 0,
        });
      }
      // ok
      return {
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: '',
      };
    }

  }

  return Message;
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');

module.exports = app => {

  class Event extends app.Service {

    async loginInfo({ /* event,*/ data }) {
      const info = data.info;
      const provider = info.user && info.user.provider;
      if (provider && provider.module === 'a-wechat' && provider.providerName === 'wechat') {
        info.config = extend(true, info.config, {
          modules: {
            'a-base': {
              account: {
                needActivation: false,
              },
            },
          },
        });
      }
    }

  }

  return Event;
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = app => {

  class JSSDK extends app.Service {

    async jsconfig({ url }) {
      // config
      const config = this.ctx.config.account.public;
      // params
      const params = {
        debug: config.jssdk.debug,
        jsApiList: config.jssdk.jsApiList,
        url,
      };
      return await this.ctx.meta.wechat.getJsConfig(params);
    }

  }

  return JSSDK;
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {

    async index({ message }) {
      // raise event
      await this.ctx.meta.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessageMini',
        data: { message },
      });
    }
  }

  return Message;
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

const WechatHelperFn = __webpack_require__(1);

module.exports = app => {

  class AuthMini extends app.Service {

    async login({ code, detail }) {
      let session_key;
      let openid;
      let unionid;
      if (code) {
        // code2Session
        const res = await this.ctx.meta.wechatMini.code2Session(code);
        session_key = res.session_key;
        openid = res.openid;
        unionid = res.unionid;
      } else {
        // from cache
        session_key = await this.ctx.meta.wechatMini.getSessionKey();
      }
      // openid/unionid
      if ((!openid || !unionid) && detail && detail.encryptedData) {
        const res = await this.ctx.meta.wechatMini.decryptMini(detail.encryptedData, detail.iv, session_key);
        openid = res.openId;
        unionid = res.unionId;
      }
      // check openid
      if (!openid) this.ctx.throw(403);
      // userInfo
      const userInfo = { openid, unionid };
      if (detail && detail.userInfo) {
        userInfo.nickname = detail.userInfo.nickName;
        userInfo.sex = detail.userInfo.gender;
        userInfo.language = detail.userInfo.language;
        userInfo.city = detail.userInfo.city;
        userInfo.province = detail.userInfo.province;
        userInfo.country = detail.userInfo.country;
        userInfo.headimgurl = detail.userInfo.avatarUrl;
      }
      // verify
      const wechatHelper = new (WechatHelperFn(this.ctx))();
      await wechatHelper.verifyAuthUser({ scene: 2, openid, userInfo });
      // save session_key, because ctx.user maybe changed
      await this.ctx.meta.wechatMini.saveSessionKey(session_key);
      // echo
      return await this.ctx.meta.auth.echo();
    }

  }

  return AuthMini;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

const wechatUser = __webpack_require__(29);
const auth = __webpack_require__(30);

module.exports = app => {
  const models = {
    wechatUser,
    auth,
  };
  return models;
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = app => {
  class WechatUser extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aWechatUser', options: { disableDeleted: false } });
    }
  }
  return WechatUser;
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = app => {

  class Auth extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAuth', options: { disableDeleted: true } });
    }

  }

  return Auth;
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const authFn = __webpack_require__(32);

module.exports = app => {
  // const schemas = require('./config/validation/schemas.js')(app);
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
    event: {
      declarations: {
        wechatMessage: 'Wechat Message',
        wechatMessageMini: 'Miniprogram Message',
      },
      implementations: {
        'a-base:loginInfo': 'event/loginInfo',
      },
    },
    index: {
      indexes: {
        aWechatUser: 'createdAt,updatedAt,openid,unionid',
      },
    },
    auth: authFn(app),
  };
  return meta;
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const strategy = require3('@zhennann/passport-wechat').Strategy;
const WechatHelperFn = __webpack_require__(1);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const providerName = 'wechat';
  const providerNameMini = 'wechatMini';
  return {
    providers: {
      [providerName]: {
        meta: {
          title: 'Wechat Public',
          mode: 'redirect',
          component: 'button',
        },
        config: {
          appID: '',
          appSecret: '',
          client: 'wechat',
          scope: 'snsapi_userinfo',
        },
        configFunctions: {
          getConfig(ctx) {
            const config = ctx.config.module(moduleInfo.relativeName).account.public;
            return { appID: config.appID, appSecret: config.appSecret };
          },
          // getToken(ctx, openid, cb) {
          //   const name = `wechat-public:${openid}`;
          //   ctx.cache.db.module(moduleInfo.relativeName).get(name)
          //     .then(token => {
          //       cb(null, token);
          //     })
          //     .catch(cb);
          // },
          // saveToken(ctx, openid, token, cb) {
          //   const name = `wechat-public:${openid}`;
          //   ctx.cache.db.module(moduleInfo.relativeName).set(name, token, (token.expires_in - 10) * 1000)
          //     .then(() => {
          //       cb(null);
          //     })
          //     .catch(cb);
          // },
        },
        handler: app => {
          return {
            strategy,
            callback: (req, accessToken, refreshToken, userInfo, expires_in, done) => {
              const wechatHelper = new (WechatHelperFn(req.ctx))();
              wechatHelper.verifyAuthUser({
                scene: 1,
                openid: userInfo.openid,
                userInfo,
                cbVerify: (profileUser, cb) => {
                  app.passport.doVerify(req, profileUser, cb);
                },
              }).then(verifyUser => { done(null, verifyUser); }).catch(done);
            },
          };
        },
      },
      [providerNameMini]: {
        meta: {
          title: 'Wechat Miniprogram',
          mode: 'direct',
        },
        config: {
        },
        handler: null,
      },
    },
  };
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map