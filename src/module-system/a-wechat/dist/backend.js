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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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
const extend = require3('extend2');
const WechatAPI = require3('@zhennann/co-wechat-api');
const authProviderScenes = __webpack_require__(2);

module.exports = function(ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class WechatHelper {

    getSceneInfo(scene) {
      return authProviderScenes.getScene(scene);
    }

    createWechatApi() {
      const self = this;
      return new Proxy({}, {
        get(obj, prop) {
          if (obj[prop]) return obj[prop];
          if (prop === 'app') {
            // app
            obj[prop] = self._createWechatApiApp();
          } else if (prop === 'mini') {
            // mini
            obj[prop] = new Proxy({}, {
              get(obj, prop) {
                if (!obj[prop]) {
                  obj[prop] = self._createWechatApiMini({ sceneShort: prop });
                }
                return obj[prop];
              },
            });
          } else if (prop === 'util') {
            // util
            obj[prop] = self._createWechatApiUtil();
          }
          return obj[prop];
        },
      });
    }

    // scene: wechat/wechatweb/wechatmini
    async verifyAuthUser({ scene, openid, userInfo, cbVerify, state = 'login' }) {
      if (state === 'associate') {
        // check if ctx.user exists
        if (!ctx.user || ctx.user.agent.anonymous) return ctx.throw(403);
      }
      // ensure wechat user
      const userWechatId = await this._ensureWechatUser({ scene, openid, userInfo });
      // ensure auth user
      const profileUser = await this._ensureAuthUser({ scene, openid, userInfo, state });
      // verify
      let verifyUser;
      if (!cbVerify) {
        verifyUser = await ctx.meta.user.verify({ state, profileUser });
        await ctx.login(verifyUser);
      } else {
        verifyUser = await bb.fromCallback(cb => {
          cbVerify(profileUser, cb);
        });
      }
      // update wechat userId
      await this._updateWechatUser({ userId: verifyUser.agent.id, userWechatId, userInfo, state });
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

    async _updateWechatUser({ userId, userWechatId, userInfo }) {
      const unionid = userInfo.unionid || '';
      if (unionid) {
        // update all
        await ctx.model.query(
          'update aWechatUser a set a.userId=? where a.deleted=0 and a.iid=? and a.unionid=?',
          [ userId, ctx.instance.id, unionid ]
        );
      } else {
        // update this
        await ctx.model.wechatUser.update({ id: userWechatId, userId });
      }
    }

    // profileId : unionid:openid
    async _ensureAuthUser({ scene, openid, userInfo, state }) {
      // model auth
      const modelAuth = ctx.model.module('a-base').auth;
      //
      const sceneInfo = this.getSceneInfo(scene);
      const unionid = userInfo.unionid || '';
      const profileId = `${unionid}:${openid}`;
      const profileUser = {
        module: moduleInfo.relativeName,
        provider: sceneInfo.authProvider,
        profileId,
        profile: {
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
        // always set avatar empty
        const _profile = extend(true, {}, profileUser.profile);
        delete _profile.avatar;
        // insert auth
        const res = await modelAuth.insert({
          providerId: providerItem.id,
          profileId,
          profile: JSON.stringify(_profile),
        });
        authId = res.insertId;
      } else {
        // hold old avatar empty
        const _profile = extend(true, {}, profileUser.profile);
        const _profileOld = JSON.parse(authItem.profile);
        _profile.avatar = _profileOld.avatar;
        // always update
        await modelAuth.update({
          id: authItem.id,
          profileId,
          profile: JSON.stringify(_profile),
        });
        authId = authItem.id;
        authUserId = authItem.userId;
      }
      // check if has userId for unionid
      if (unionid) {
        if (state === 'associate') {
          await ctx.model.query(
            `update aAuth a set a.userId=? where a.deleted=0 and a.iid=? and a.profileId like '${unionid}:%'`,
            [ ctx.user.agent.id, ctx.instance.id ]
          );
        } else {
          const _authOthers = await ctx.model.query(
            `select * from aAuth a where a.deleted=0 and a.iid=? and a.profileId like '${unionid}:%' and a.id<>?`,
            [ ctx.instance.id, authId ]
          );
          const _authOther = _authOthers[0];
          if (_authOther && _authOther.userId !== authUserId) {
            // update userId for this auth
            await modelAuth.update({ id: authId, userId: _authOther.userId });
          }
        }
      }
      // ready
      return profileUser;
    }

    _createWechatApiApp() {
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
          if (token) {
            await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
          } else {
            await ctx.cache.db.module(moduleInfo.relativeName).remove(cacheKey);
          }
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
          if (token) {
            await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
          } else {
            await ctx.cache.db.module(moduleInfo.relativeName).remove(cacheKey);
          }
        }
      );
      // ready
      return api;
    }

    _createWechatApiMini({ sceneShort }) {
      // config
      const config = ctx.config.module(moduleInfo.relativeName).account.minis[sceneShort];
      // api
      const api = new WechatAPI(config.appID, config.appSecret,
        async function() {
          const cacheKey = 'wechatmini-token';
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(token) {
          const cacheKey = 'wechatmini-token';
          if (token) {
            await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
          } else {
            await ctx.cache.db.module(moduleInfo.relativeName).remove(cacheKey);
          }
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
          if (token) {
            await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
          } else {
            await ctx.cache.db.module(moduleInfo.relativeName).remove(cacheKey);
          }
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

    _createWechatApiUtil() {
      return {
        // scene: empty/wechat/wechatweb/wechatmini/xxx,xxx,xxx
        in(scene) {
          // scene
          if (!scene) scene = 'wechat';
          if (typeof scene === 'string') scene = scene.split(',');
          // provider
          const provider = ctx.user && ctx.user.provider;
          if (!provider || provider.module !== moduleInfo.relativeName) return false;
          // find any match
          for (const item of scene) {
            const ok = (provider.providerName === item) || (item === 'wechatmini' && provider.providerName.indexOf(item) > -1);
            if (ok) return true;
          }
          // not found
          return false;
        },
      };
    }

  }

  return WechatHelper;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

const _scenes = {
  wechat: {
    scene: 'wechat', authProvider: 'wechat', title: 'Wechat Public', client: 'wechat', configKey: 'public',
  },
  wechatweb: {
    scene: 'wechatweb', authProvider: 'wechatweb', title: 'Wechat Web', client: 'wechatweb', configKey: 'web',
  },
  wechatmini: {
    scene: 'wechatmini', authProvider: 'wechatmini', title: 'Wechat Miniprogram',
  },
};

function _upperCaseFirstChar(str) {
  if (!str) return '';
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

module.exports = {
  scenes: _scenes,
  getScene(scene) {
    if (scene.indexOf('wechatmini') > -1) {
      const sceneShort = scene.substr('wechatmini'.length);
      // wechatmini
      const base = _scenes.wechatmini;
      return {
        scene,
        authProvider: scene,
        title: `${base.title} - ${_upperCaseFirstChar(sceneShort)}`,
      };
    }
    // else
    return _scenes[scene];
  },
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const crypto = __webpack_require__(15);
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(5);
const locales = __webpack_require__(6);
const errors = __webpack_require__(8);
const middlewares = __webpack_require__(9);

module.exports = app => {

  // routes
  const routes = __webpack_require__(12)(app);
  // services
  const services = __webpack_require__(20)(app);
  // models
  const models = __webpack_require__(27)(app);
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
/* 5 */
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
    inWechat: {
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

  // account.web
  config.account.web = {
    appID: '',
    appSecret: '',
  };

  // account.minis
  config.account.minis = {
    default: {
      appID: '',
      appSecret: '',
      token: appInfo.name,
      encodingAESKey: '',
    },
  };

  return config;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(7),
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = {
  Wechat: '微信',
  'Wechat Public': '微信公众号',
  'Wechat Miniprogram': '微信小程序',
  'Wechat Miniprogram - Default': '微信小程序 - 默认',
  'Wechat Web': '微信Web',
  'Not In Wechat': '不在微信内部',
  'Not In Wechat Miniprogram': '不在微信小程序内部',
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'Not In Wechat',
  1002: 'Not In Wechat Miniprogram',
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const wechat = __webpack_require__(10);
const inWechat = __webpack_require__(11);

module.exports = {
  wechat,
  inWechat,
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const WechatHelperFn = __webpack_require__(1);
const WECHAT = Symbol('CTX#WECHAT');

module.exports = (options, app) => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function wechat(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'wechat', {
      get() {
        if (ctx.meta[WECHAT] === undefined) {
          const wechatHelper = new (WechatHelperFn(ctx))();
          ctx.meta[WECHAT] = wechatHelper.createWechatApi();
        }
        return ctx.meta[WECHAT];
      },
    });

    // next
    await next();
  };

};



/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const WechatHelperFn = __webpack_require__(1);

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function inWechat(ctx, next) {
    const wechatHelper = new (WechatHelperFn(ctx))();
    const api = wechatHelper.createWechatApi();
    if (!api.util.in(options.scene)) return ctx.throw.module(moduleInfo.relativeName, 1001);
    // next
    await next();
  };
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(13);
const message = __webpack_require__(14);
const event = __webpack_require__(16);
const jssdk = __webpack_require__(17);
const messageMini = __webpack_require__(18);
const authMini = __webpack_require__(19);

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
    { method: 'get', path: 'messageMini/:scene', controller: messageMini, action: 'index', middlewares: 'wechat', meta: { auth: { enable: false } } },
    { method: 'post', path: 'messageMini/:scene', controller: messageMini, action: 'index', middlewares: 'wechat', meta: { auth: { enable: false } } },
    // authMini
    { method: 'post', path: 'authMini/login', controller: authMini, middlewares: 'wechat', meta: { auth: { enable: false } } },

  ];
  return routes;
};


/***/ }),
/* 13 */
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const WechatCrypto = require3('wechat-crypto');
const wechatUtils = __webpack_require__(3);

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
/* 15 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 16 */
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
/* 17 */
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const WechatCrypto = require3('wechat-crypto');
const wechatUtils = __webpack_require__(3);

module.exports = app => {
  class MessageMiniController extends app.Controller {

    async index() {
      // scene
      let scene = this.ctx.params.scene || 'default';
      // compatible with the old 'index'
      if (scene === 'index') scene = 'default';
      // query
      const query = this.ctx.query;
      // config
      const config = this.ctx.config.account.minis[scene];
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
        await this.ctx.service.messageMini.index({ scene, message: messageIn });
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
/* 19 */
/***/ (function(module, exports) {

module.exports = app => {
  class AuthMiniController extends app.Controller {

    async login() {
      const res = await this.service.authMini.login({
        scene: this.ctx.request.body.scene,
        code: this.ctx.request.body.code,
        detail: this.ctx.request.body.detail,
      });
      this.ctx.success(res);
    }

  }
  return AuthMiniController;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(21);
const message = __webpack_require__(22);
const event = __webpack_require__(23);
const jssdk = __webpack_require__(24);
const messageMini = __webpack_require__(25);
const authMini = __webpack_require__(26);

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
/* 21 */
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

      if (options.version === 2) {
        const sql = `
          ALTER TABLE aWechatUser
            CHANGE COLUMN scene scene varchar(255) DEFAULT NULL
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
/* 22 */
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
      const userInfo = await this.ctx.meta.wechat.app.getUser({ openid });
      // verify auth user
      const wechatHelper = new (WechatHelperFn(this.ctx))();
      await wechatHelper.verifyAuthUser({ scene: 'wechat', openid, userInfo });
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');

module.exports = app => {

  class Event extends app.Service {

    async loginInfo({ /* event,*/ data }) {
      const info = data.info;
      const provider = info.user && info.user.provider;
      if (provider && provider.module === 'a-wechat') {
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
/* 24 */
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
      return await this.ctx.meta.wechat.app.getJsConfig(params);
    }

  }

  return JSSDK;
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {

    async index({ scene, message }) {
      // raise event
      await this.ctx.meta.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessageMini',
        data: { scene, message },
      });
    }
  }

  return Message;
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

const WechatHelperFn = __webpack_require__(1);

module.exports = app => {

  class AuthMini extends app.Service {

    async login({ scene, code, detail }) {
      let session_key;
      let openid;
      let unionid;

      // mini
      const apiMini = this.ctx.meta.wechat.mini[scene];

      // code
      if (code) {
        // code2Session
        const res = await apiMini.code2Session(code);
        session_key = res.session_key;
        openid = res.openid;
        unionid = res.unionid;
      } else {
        // from cache
        session_key = await apiMini.getSessionKey();
      }
      // openid/unionid
      if ((!openid || !unionid) && detail && detail.encryptedData) {
        const res = await apiMini.decryptMini(detail.encryptedData, detail.iv, session_key);
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
      await wechatHelper.verifyAuthUser({ scene: `wechatmini${scene}`, openid, userInfo });
      // save session_key, because ctx.user maybe changed
      await apiMini.saveSessionKey(session_key);
      // echo
      return await this.ctx.meta.auth.echo();
    }

  }

  return AuthMini;
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

const wechatUser = __webpack_require__(28);

module.exports = app => {
  const models = {
    wechatUser,
  };
  return models;
};


/***/ }),
/* 28 */
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const authFn = __webpack_require__(30);

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
    auth: authFn,
  };
  return meta;
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const strategy = require3('@zhennann/passport-wechat').Strategy;
const WechatHelperFn = __webpack_require__(1);
const authProviderScenes = __webpack_require__(2);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createProvider(sceneInfo) {
    return {
      meta: {
        title: sceneInfo.title,
        mode: 'redirect',
        component: `button${sceneInfo.authProvider}`,
      },
      config: {
        appID: '',
        appSecret: '',
        client: sceneInfo.client,
        scope: 'snsapi_userinfo',
      },
      configFunctions: {
        getConfig(ctx) {
          const config = ctx.config.module(moduleInfo.relativeName).account[sceneInfo.configKey];
          return { appID: config.appID, appSecret: config.appSecret };
        },
        getToken(ctx, openid, cb) {
          const name = `wechat-webtoken:${sceneInfo.authProvider}:${openid}`;
          ctx.cache.db.module(moduleInfo.relativeName).get(name)
            .then(token => {
              cb(null, token);
            })
            .catch(cb);
        },
        saveToken(ctx, openid, token, cb) {
          const name = `wechat-webtoken:${sceneInfo.authProvider}:${openid}`;
          ctx.cache.db.module(moduleInfo.relativeName).set(name, token, (token.expires_in - 10) * 1000)
            .then(() => {
              cb(null);
            })
            .catch(cb);
        },
      },
      handler: app => {
        return {
          strategy,
          callback: (req, accessToken, refreshToken, userInfo, expires_in, done) => {
            const ctx = req.ctx;
            const state = ctx.request.query.state || 'login';
            const wechatHelper = new (WechatHelperFn(ctx))();
            wechatHelper.verifyAuthUser({
              scene: sceneInfo.scene,
              openid: userInfo.openid,
              userInfo,
              state,
              cbVerify: (profileUser, cb) => {
                app.passport.doVerify(req, profileUser, cb);
              },
            }).then(verifyUser => { done(null, verifyUser); }).catch(done);
          },
        };
      },
    };
  }

  function _createProviderMini(sceneInfo) {
    return {
      meta: {
        title: sceneInfo.title,
        mode: 'direct',
        disableAssociate: true,
      },
      config: {
      },
      handler: null,
    };
  }

  const metaAuth = {
    providers: {
    },
  };

  // wechat/wechatweb
  for (const scene of [ 'wechat', 'wechatweb' ]) {
    const sceneInfo = authProviderScenes.getScene(scene);
    metaAuth.providers[sceneInfo.authProvider] = _createProvider(sceneInfo);
  }

  // minis
  const moduleConfig = app.meta.configs[moduleInfo.relativeName];
  const minis = moduleConfig.account.minis;
  for (const sceneShort in minis) {
    const scene = `wechatmini${sceneShort}`;
    const sceneInfo = authProviderScenes.getScene(scene);
    metaAuth.providers[sceneInfo.authProvider] = _createProviderMini(sceneInfo);
  }

  // ok
  return metaAuth;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map