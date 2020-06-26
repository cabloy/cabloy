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
const extend = require3('extend2');
const WxworkAPI = require3('@zhennann/co-wxwork-api');
const WechatAPI = require3('@zhennann/co-wechat-api');
const authProviderScenes = __webpack_require__(2);

module.exports = function(ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class WxworkHelper {

    getSceneInfo(scene) {
      return authProviderScenes.getScene(scene);
    }

    createWxworkApi() {
      const self = this;
      return new Proxy({}, {
        get(obj, prop) {
          if (obj[prop]) return obj[prop];
          if (prop === 'app') {
            // app
            obj[prop] = new Proxy({}, {
              get(obj, prop) {
                if (!obj[prop]) {
                  if (prop === 'mini') {
                    // app.mini
                    obj[prop] = new Proxy({}, {
                      get(obj, prop) {
                        if (!obj[prop]) {
                          obj[prop] = self._createWxworkApiApp({ appName: prop, mini: true });
                        }
                        return obj[prop];
                      },
                    });
                  } else {
                    // others
                    obj[prop] = self._createWxworkApiApp({ appName: prop });
                  }
                }
                return obj[prop];
              },
            });
          } else if (prop === 'mini') {
            // mini
            obj[prop] = new Proxy({}, {
              get(obj, prop) {
                if (!obj[prop]) {
                  obj[prop] = self._createWxworkApiMini({ sceneShort: prop });
                }
                return obj[prop];
              },
            });
          } else if (prop === 'util') {
            // util
            obj[prop] = self._createWxworkApiUtil();
          }
          return obj[prop];
        },
      });
    }

    // scene: wxwork/wxworkweb/wxworkmini
    async verifyAuthUser({ scene, memberId, member, cbVerify, state = 'login', needLogin = true }) {
      if (state === 'associate') {
        // not allowed associate
        return ctx.throw(403);
      }
      // userInfo(member)
      if (!member) {
        member = await this._getMemberByMemberId({ memberId });
        if (!member) return ctx.throw(403);
      }
      // ensure auth user
      const profileUser = await this._ensureAuthUser({ scene, memberId: member.memberId, member });
      // verify
      let verifyUser;
      if (!cbVerify) {
        verifyUser = await ctx.meta.user.verify({ state: 'login', profileUser });
        if (needLogin) {
          await ctx.login(verifyUser);
        }
      } else {
        verifyUser = await bb.fromCallback(cb => {
          cbVerify(profileUser, cb);
        });
      }
      // ok
      return verifyUser;
    }

    async _getMemberByMemberId({ memberId }) {
      // model member
      const modelMember = ctx.model.module(moduleInfo.relativeName).member;
      return await modelMember.get({ memberId });
    }

    // profileId: wxwork:memberId
    async _ensureAuthUser({ scene, memberId, member }) {
      // model auth
      const modelAuth = ctx.model.module('a-base').auth;
      //
      const sceneInfo = this.getSceneInfo(scene);
      const profileId = `wxwork:${memberId}`;
      const profileUser = {
        module: moduleInfo.relativeName,
        provider: sceneInfo.authProvider,
        profileId,
        profile: {
          userName: member.alias || member.name,
          realName: member.name,
          avatar: member.avatar,
          email: member.email,
          mobile: member.mobile,
          emailConfirmed: true,
          mobileVerified: true,
          profile: member,
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
        'select * from aAuth a where a.deleted=0 and a.iid=? and a.providerId=? and a.profileId=?',
        [ ctx.instance.id, providerItem.id, profileId ]
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
          profile: JSON.stringify(_profile),
        });
        authId = authItem.id;
        authUserId = authItem.userId;
      }
      // check if has userId for memberId
      const _authOthers = await ctx.model.query(
        'select * from aAuth a where a.deleted=0 and a.iid=? and a.profileId=? and a.id<>?',
        [ ctx.instance.id, profileId, authId ]
      );
      const _authOther = _authOthers[0];
      if (_authOther && _authOther.userId !== authUserId) {
        // update userId for this auth
        await modelAuth.update({ id: authId, userId: _authOther.userId });
      }
      // ready
      return profileUser;
    }

    _createWxworkApiApp({ appName, mini }) {
      // config
      const config = ctx.config.module(moduleInfo.relativeName).account.wxwork;
      const configApp = mini ? config.minis[appName] : config.apps[appName];
      // api
      const api = new WxworkAPI.CorpAPI(config.corpid, configApp.secret,
        async function() {
          const cacheKey = `wxwork-token:${appName || ''}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(token) {
          const cacheKey = `wxwork-token:${appName || ''}`;
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
          const cacheKey = `wxwork-jsticket:${appName}:${type}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(type, token) {
          const cacheKey = `wxwork-jsticket:${appName}:${type}`;
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

    _createWxworkApiMini({ sceneShort }) {
      // config
      const config = ctx.config.module(moduleInfo.relativeName).account.wxwork;
      const configMini = config.minis[sceneShort];
      // api
      const api = new WechatAPI(configMini.appID, configMini.appSecret,
        async function() {
          const cacheKey = `wxworkmini-token:${sceneShort}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(token) {
          const cacheKey = `wxworkmini-token:${sceneShort}`;
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
          const cacheKey = `wxworkmini-jsticket:${sceneShort}:${type}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(type, token) {
          const cacheKey = `wxworkmini-jsticket:${sceneShort}:${type}`;
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
          const cacheKey = `wxworkmini-sessionKey:${sceneShort}:${ctx.user.agent.id}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(sessionKey) {
          const cacheKey = `wxworkmini-sessionKey:${sceneShort}:${ctx.user.agent.id}`;
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, sessionKey);
        }
      );
      // ready
      return api;
    }

    _createWxworkApiUtil() {
      return {
        // scene: empty/wxwork/wxworkweb/wxworkmini/wxworkminidefault/xxx,xxx,xxx
        in(scene) {
          // scene
          if (!scene) scene = 'wxwork';
          if (typeof scene === 'string') scene = scene.split(',');
          // provider
          const provider = ctx.user && ctx.user.provider;
          if (!provider || provider.module !== moduleInfo.relativeName) return false;
          // find any match
          for (const item of scene) {
            const ok = (provider.providerName === item) || (item === 'wxworkmini' && provider.providerName.indexOf(item) > -1);
            if (ok) return true;
          }
          // not found
          return false;
        },
      };
    }

  }

  return WxworkHelper;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

const _scenes = {
  wxwork: {
    scene: 'wxwork', authProvider: 'wxwork', title: 'Wechat Work', client: 'wxwork',
  },
  wxworkweb: {
    scene: 'wxworkweb', authProvider: 'wxworkweb', title: 'Wechat Work Web', client: 'wxworkweb',
  },
  wxworkmini: {
    scene: 'wxworkmini', authProvider: 'wxworkmini', title: 'Wechat Work Miniprogram',
  },
};

function _upperCaseFirstChar(str) {
  if (!str) return '';
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

module.exports = {
  scenes: _scenes,
  getScene(scene) {
    if (scene.indexOf('wxworkmini') > -1) {
      const sceneShort = scene.substr('wxworkmini'.length);
      // wxworkmini
      const base = _scenes.wxworkmini;
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

const config = __webpack_require__(4);
const locales = __webpack_require__(5);
const errors = __webpack_require__(7);
const middlewares = __webpack_require__(8);

module.exports = app => {

  // routes
  const routes = __webpack_require__(11)(app);
  // services
  const services = __webpack_require__(20)(app);
  // models
  const models = __webpack_require__(27)(app);
  // meta
  const meta = __webpack_require__(30)(app);

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
  'agentConfig',
  'onMenuShareWechat',
  // 'onMenuShareTimeline',
  // 'onMenuShareAppMessage',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'pauseVoice',
  'stopVoice',
  'onVoicePlayEnd',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getLocalImgData',
  'getNetworkType',
  'onNetworkStatusChange',
  'openLocation',
  'getLocation',
  'startAutoLBS',
  'stopAutoLBS',
  'onLocationChange',
  'onHistoryBack',
  'hideOptionMenu',
  'showOptionMenu',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'closeWindow',
  'openDefaultBrowser',
  'scanQRCode',
  'selectEnterpriseContact',
  'openEnterpriseChat',
  'chooseInvoice',
  'selectExternalContact',
  'getCurExternalContact',
  'openUserProfile',
  'shareAppMessage',
  'shareWechatMessage',
  'startWifi',
  'stopWifi',
  'connectWifi',
  'getWifiList',
  'onGetWifiList',
  'onWifiConnected',
  'getConnectedWifi',
  'setClipboardData',
];

const jsApiListAgent = [
  'onMenuShareWechat',
  // 'onMenuShareTimeline',
  // 'onMenuShareAppMessage',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'pauseVoice',
  'stopVoice',
  'onVoicePlayEnd',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getLocalImgData',
  'getNetworkType',
  'onNetworkStatusChange',
  'openLocation',
  'getLocation',
  'startAutoLBS',
  'stopAutoLBS',
  'onLocationChange',
  'onHistoryBack',
  'hideOptionMenu',
  'showOptionMenu',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'closeWindow',
  'openDefaultBrowser',
  'scanQRCode',
  'selectEnterpriseContact',
  'openEnterpriseChat',
  'chooseInvoice',
  'selectExternalContact',
  'getCurExternalContact',
  'openUserProfile',
  'shareAppMessage',
  'shareWechatMessage',
  'startWifi',
  'stopWifi',
  'connectWifi',
  'getWifiList',
  'onGetWifiList',
  'onWifiConnected',
  'getConnectedWifi',
  'setClipboardData',
];

module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    contacts: {
      path: 'contacts/queue',
    },
  };

  // middlewares
  config.middlewares = {
    wxwork: {
      global: false,
      dependencies: 'instance',
    },
    inWxwork: {
      global: false,
      dependencies: 'instance',
    },
  };

  // sync
  config.sync = {
    department: {
      roleContainer: 'internal',
      roleTop: 'wxwork',
    },
  };

  // account
  config.account = {};

  // account.wxwork
  config.account.wxwork = {
    corpid: '',
    // apps
    apps: {
      selfBuilt: {
        agentid: '',
        secret: '',
        token: appInfo.name,
        encodingAESKey: '',
        message: {
          reply: {
            default: 'You are welcome!',
          },
        },
        jssdk: {
          debug: false,
          jsApiList,
        },
        jssdkAgent: {
          jsApiList: jsApiListAgent,
        },
      },
      contacts: {
        secret: '',
        token: appInfo.name,
        encodingAESKey: '',
      },
    },
    // minis
    minis: {
      default: {
        secret: '',
        appID: '',
        appSecret: '',
      },
    },
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
  'Wechat Work': '企业微信',
  'Wechat Work Miniprogram': '企业微信小程序',
  'Wechat Work Miniprogram - Default': '企业微信小程序 - 默认',
  'Wechat Work Web': '企业微信Web',
  'Wechat Public': '微信公众号',
  'Wechat Miniprogram': '微信小程序',
  'Not In Wechat Work': '不在企业微信内部',
  'Not In Wechat Work Miniprogram': '不在企业微信小程序内部',
  'Contacts Management': '通讯录管理',
  'Sync Started': '同步已启动',
  'Sync Completed': '同步已完成',
  'Department Count': '部门数量',
  'Member Count': '成员数量',
  'Sync Departments First': '请先同步部门',
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'Not In Wechat Work',
  1002: 'Not In Wechat Work Miniprogram',
  1003: 'Role not Found for department: %d',
  1004: 'Department not Found: %d',
  1005: 'Member not Found: %d',
  1006: 'Sync Departments First',
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const wxwork = __webpack_require__(9);
const inWxwork = __webpack_require__(10);

module.exports = {
  wxwork,
  inWxwork,
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const WxworkHelperFn = __webpack_require__(1);
const WXWORK = Symbol('CTX#WXWORK');

module.exports = (options, app) => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function wxwork(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'wxwork', {
      get() {
        if (ctx.meta[WXWORK] === undefined) {
          const wxworkHelper = new (WxworkHelperFn(ctx))();
          ctx.meta[WXWORK] = wxworkHelper.createWxworkApi();
        }
        return ctx.meta[WXWORK];
      },
    });

    // next
    await next();
  };

};



/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const WxworkHelperFn = __webpack_require__(1);

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function inWxwork(ctx, next) {
    const wxworkHelper = new (WxworkHelperFn(ctx))();
    const api = wxworkHelper.createWxworkApi();
    if (!api.util.in(options.scene)) return ctx.throw.module(moduleInfo.relativeName, 1001);
    // next
    await next();
  };
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(12);
const message = __webpack_require__(13);
const contacts = __webpack_require__(16);

const event = __webpack_require__(17);
const jssdk = __webpack_require__(18);
const authMini = __webpack_require__(19);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // message
    { method: 'get', path: 'message/index', controller: message, middlewares: 'wxwork', meta: { auth: { enable: false } } },
    { method: 'post', path: 'message/index', controller: message, middlewares: 'wxwork', meta: { auth: { enable: false } } },
    { method: 'get', path: 'message/contacts', controller: message, middlewares: 'wxwork', meta: { auth: { enable: false } } },
    { method: 'post', path: 'message/contacts', controller: message, middlewares: 'wxwork', meta: { auth: { enable: false } } },
    // contacts
    { method: 'post', path: 'contacts/sync', controller: contacts, meta: { right: { type: 'function', name: 'contacts' } } },
    // queue
    { method: 'post', path: 'contacts/queue', controller: contacts, middlewares: 'inner,transaction,wxwork',
      meta: { auth: { enable: false } },
    },

    // jsapi
    { method: 'post', path: 'jssdk/jsconfig', controller: jssdk, middlewares: 'wxwork' },
    { method: 'post', path: 'jssdk/jsconfigAgent', controller: jssdk, middlewares: 'wxwork' },
    // event
    { method: 'post', path: 'event/loginInfo', controller: event, middlewares: 'inner', meta: { auth: { enable: false } } },

    // authMini
    { method: 'post', path: 'authMini/login', controller: authMini, middlewares: 'wxwork', meta: { auth: { enable: false } } },

  ];
  return routes;
};


/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const WechatCrypto = require3('wechat-crypto');
const wechatUtils = __webpack_require__(14);

module.exports = app => {
  class MessageController extends app.Controller {

    async index() {
      await this._handleMessage('selfBuilt', async ({ message }) => {
        return await this.ctx.service.message.index({ message });
      });
    }

    async contacts() {
      await this._handleMessage('contacts', async ({ message }) => {
        return await this.ctx.service.message.contacts({ message });
      });
    }

    async _handleMessage(appName, handler) {
      // query
      const query = this.ctx.query;
      // config
      const config = this.ctx.config.account.wxwork;
      const configApp = config.apps[appName];
      // encrypted: always true
      const encrypted = true; // query.encrypt_type === 'aes';
      // wechat crypto
      const wechatCrypto = encrypted ? new WechatCrypto(configApp.token, configApp.encodingAESKey, config.corpid) : null;
      // parse
      let messageIn;
      if (this.ctx.method === 'GET') {
        messageIn = await this._parseMessageGet({ query, configApp, encrypted, wechatCrypto });
        // ok
        this.ctx.status = 200;
        this.ctx.type = 'text/plain';
        this.ctx.body = messageIn.echostr;
      } else {
        messageIn = await this._parseMessagePost({ query, configApp, encrypted, wechatCrypto });
        // handle
        let resXML;
        const messageOut = await handler({ message: messageIn });
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

    async _parseMessageGet({ query, configApp, encrypted, wechatCrypto }) {
      // check if valid
      let valid = false;
      if (encrypted) {
        valid = query.msg_signature === wechatCrypto.getSignature(query.timestamp, query.nonce, query.echostr);
      } else {
        valid = query.signature === wechatUtils.calcSignature({ options: [ configApp.token, query.timestamp, query.nonce ].sort() });
      }
      if (!valid) this.ctx.throw(401);
      // decrypt
      if (encrypted) {
        const res = wechatCrypto.decrypt(query.echostr);
        return { echostr: res.message };
      }
      return { echostr: query.echostr };
    }

    async _parseMessagePost({ query, configApp, encrypted, wechatCrypto }) {
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
        valid = query.signature === wechatUtils.calcSignature({ options: [ configApp.token, query.timestamp, query.nonce ].sort() });
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
/* 14 */
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
/* 15 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const uuid = require3('uuid');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class ContactsController extends app.Controller {

    async sync() {
      // progress
      const progressId = uuid.v4().replace(/-/g, '');
      // queue
      this.ctx.app.meta.queue.push({
        locale: this.ctx.locale,
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'contacts',
        data: {
          queueAction: 'sync',
          type: this.ctx.request.body.type,
          progressId,
          userOp: this.ctx.user.op,
        },
      });
      this.ctx.success({ progressId });
    }

    async queue() {
      const queueAction = this.ctx.request.body.queueAction;
      if (queueAction === 'sync') {
        await this.service.contacts.queueSync({
          type: this.ctx.request.body.type,
          progressId: this.ctx.request.body.progressId,
          userOp: this.ctx.request.body.userOp,
        });
      } else if (queueAction === 'changeContact') {
        await this.service.contacts.queueChangeContact({
          message: this.ctx.request.body.message,
        });
      }
      this.ctx.success();
    }

  }
  return ContactsController;
};


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

    async jsconfigAgent() {
      const res = await this.service.jssdk.jsconfigAgent({
        url: this.ctx.request.body.url,
      });
      this.ctx.success(res);
    }

  }
  return JSSDKController;
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
const contacts = __webpack_require__(23);
const event = __webpack_require__(24);
const jssdk = __webpack_require__(25);
const authMini = __webpack_require__(26);

module.exports = app => {
  const services = {
    version,
    message,
    contacts,
    event,
    jssdk,
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

        let sql;

        // create table: aWxworkDepartment
        sql = `
          CREATE TABLE aWxworkDepartment (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            departmentId int(11) DEFAULT '0',
            departmentParentId int(11) DEFAULT '0',
            departmentName varchar(255) DEFAULT NULL,
            departmentNameEn varchar(255) DEFAULT NULL,
            departmentOrder int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aWxworkMember
        sql = `
          CREATE TABLE aWxworkMember (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            memberId varchar(255) DEFAULT NULL,
            name varchar(255) DEFAULT NULL,
            alias varchar(255) DEFAULT NULL,
            mobile varchar(255) DEFAULT NULL,
            department varchar(255) DEFAULT NULL,
            sorting varchar(255) DEFAULT NULL,
            position varchar(255) DEFAULT NULL,
            gender int(11) DEFAULT '0',
            email varchar(255) DEFAULT NULL,
            telephone varchar(255) DEFAULT NULL,
            is_leader_in_dept varchar(255) DEFAULT NULL,
            avatar varchar(255) DEFAULT NULL,
            thumb_avatar varchar(255) DEFAULT NULL,
            qr_code varchar(255) DEFAULT NULL,
            status int(11) DEFAULT '0',
            extattr JSON DEFAULT NULL,
            external_profile JSON DEFAULT NULL,
            external_position varchar(255) DEFAULT NULL,
            address varchar(255) DEFAULT NULL,
            hide_mobile int(11) DEFAULT '0',
            english_name varchar(255) DEFAULT NULL,
            open_userid varchar(255) DEFAULT NULL,
            main_department int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

      }
    }

    async init(options) {
      if (options.version === 1) {
        // roleFunctions
        const roleFunctions = [
          { roleName: 'system', name: 'contacts' },
        ];
        await this.ctx.meta.role.addRoleFunctionBatch({ roleFunctions });
      }
    }

    async test() {
    }

  }

  return Version;
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {

    async index({ message }) {
      // config
      const config = this.ctx.config.account.wxwork;
      const configAppSelfBuilt = config.apps.selfBuilt;
      // res
      let res;
      // event: subscribe
      if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
          // donothing，具体逻辑在通讯录回调通知中实现
          return null;
        } else if (message.Event === 'unsubscribe') {
          // donothing，具体逻辑在通讯录回调通知中实现
          return null;
        }
      }
      // raise event
      const res2 = await this.ctx.meta.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wxworkMessage',
        data: { message },
      });
      if (res2) res = res2;
      // check if ready
      if (res) return res;
      // default reply
      if (message.MsgType !== 'event') {
        return {
          ToUserName: message.FromUserName,
          FromUserName: message.ToUserName,
          CreateTime: new Date().getTime(),
          MsgType: 'text',
          Content: configAppSelfBuilt.message.reply.default,
        };
      }
      return null;
    }

    async contacts({ message }) {
      // queue
      this.ctx.app.meta.queue.push({
        locale: this.ctx.locale,
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'contacts',
        data: {
          queueAction: 'changeContact',
          message,
        },
      });
      // ok
      return null;
    }

  }

  return Message;
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const WxworkHelperFn = __webpack_require__(1);

// department

const __departmentFieldMap = [
  [ 'departmentId', 'departmentParentId', 'departmentName', 'departmentNameEn', 'departmentOrder' ],
  [ 'id', 'parentid', 'name', 'name_en', 'order' ],
  [ 'number', 'number', 'string', 'string', 'number' ],
];

const __departmentFieldMap_XML = [
  [ 'departmentId', 'departmentParentId', 'departmentName', 'departmentOrder' ],
  [ 'Id', 'ParentId', 'Name', 'Order' ],
  [ 'number', 'number', 'string', 'number' ],
];

// member

const __memberFieldMap = [
  [ 'memberId', 'name', 'alias', 'mobile', 'department', 'sorting', 'position', 'gender', 'email', 'telephone', 'is_leader_in_dept', 'avatar', 'thumb_avatar', 'qr_code', 'status', 'extattr', 'external_profile', 'external_position', 'address', 'hide_mobile', 'english_name', 'open_userid', 'main_department' ],
  [ 'userid', 'name', 'alias', 'mobile', 'department', 'order', 'position', 'gender', 'email', 'telephone', 'is_leader_in_dept', 'avatar', 'thumb_avatar', 'qr_code', 'status', 'extattr', 'external_profile', 'external_position', 'address', 'hide_mobile', 'english_name', 'open_userid', 'main_department' ],
  [ 'string', 'string', 'string', 'string', 'array', 'array', 'string', 'number', 'string', 'string', 'array', 'string', 'string', 'string', 'number', 'json', 'json', 'string', 'string', 'number', 'string', 'string', 'number' ],
];

const __memberFieldMap_XML = [
  [ 'memberIdNew', 'memberId', 'name', 'alias', 'mobile', 'department', 'position', 'gender', 'email', 'telephone', 'is_leader_in_dept', 'avatar', 'status', 'extattr', 'address' ],
  [ 'NewUserID', 'UserID', 'Name', 'Alias', 'Mobile', 'Department', 'Position', 'Gender', 'Email', 'Telephone', 'IsLeaderInDept', 'Avatar', 'Status', 'ExtAttr', 'Address' ],
  [ 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'number', 'string', 'string', 'string', 'string', 'number', 'json', 'string' ],
];

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Contacts extends app.Service {

    async queueSync({ type, progressId, userOp }) {
      if (type === 'departments') {
        await this._queueSyncDepartments({ progressId, userOp });
      } else if (type === 'members') {
        await this._queueSyncMembers({ progressId, userOp });
      }
    }

    async queueChangeContact({ message }) {
      if (message.ChangeType.indexOf('_party') > -1) {
        await this._queueChangeContactDepartment({ message });
      } else if (message.ChangeType.indexOf('_user') > -1) {
        await this._queueChangeContactMember({ message });
      }
    }

    async _queueChangeContactDepartment({ message }) {
      // department
      const department = {};
      this._adjustFields(department, message, __departmentFieldMap_XML);
      // do
      if (message.ChangeType === 'create_party') {
        // create
        await this._createRoleAndDepartment({ department });
        // build roles
        await this.ctx.meta.role.build();
      } else if (message.ChangeType === 'update_party') {
        // update
        await this._updateRoleAndDepartment({ localDepartment: null, department });
      } else if (message.ChangeType === 'delete_party') {
        await this._deleteRoleAndDepartment({ localDepartment: null, department });
        // build roles
        await this.ctx.meta.role.build();
      }
    }

    async _queueChangeContactMember({ message }) {
      const member = {};
      this._adjustFields(member, message, __memberFieldMap_XML);
      // do
      if (message.ChangeType === 'create_user') {
        // get member remotely
        const res = await this.ctx.meta.wxwork.app.contacts.getUser(member.memberId);
        if (res.errcode) {
          throw new Error(res.errmsg);
        }
        // create
        const _member = {};
        this._adjustFields(_member, res, __memberFieldMap);
        await this._createUserAndMember({ member: _member });
      } else if (message.ChangeType === 'update_user') {
        // check if memberId changed
        if (member.memberIdNew) {
          // upate memberId of member
          await this.ctx.model.query(
            'update aWxworkUser a set a.memberId=? where a.iid=? and a.memberId=?',
            [ member.memberIdNew, this.ctx.instance.id, member.memberId ]
          );
          // upate profileId of auth
          await this.ctx.model.query(
            'update aAuth a set a.profileId=? where a.iid=? and a.profileId=?',
            [ `wxwork:${member.memberIdNew}`, this.ctx.instance.id, `wxwork:${member.memberId}` ]
          );
        }
        // get member remotely
        const res = await this.ctx.meta.wxwork.app.contacts.getUser(member.memberIdNew || member.memberId);
        if (res.errcode) {
          throw new Error(res.errmsg);
        }
        // update
        const _member = {};
        this._adjustFields(_member, res, __memberFieldMap);
        await this._updateUserAndMember({ localMember: null, member: _member });
      } else if (message.ChangeType === 'delete_user') {
        await this._deleteUserAndMember({ localMember: null, member });
      }
    }

    // queue sync departments
    async _queueSyncDepartments({ progressId, userOp }) {
      // prepare context
      const context = {
        remoteDepartments: null,
        progressId,
        userOp,
      };
      try {
        // progress
        await this._progressPublish({ context, done: 0, text: `--- ${this.ctx.text('Sync Started')} ---` });
        // remote departments
        const res = await this.ctx.meta.wxwork.app.contacts.getDepartmentList();
        if (res.errcode) {
          throw new Error(res.errmsg);
        }
        context.remoteDepartments = res.department;
        // progress
        await this._progressPublish({ context, done: 0, text: `--- ${this.ctx.text('Department Count')}: ${context.remoteDepartments.length} ---` });
        // local departments
        context.localDepartments = await this.ctx.model.department.select();
        context.localDepartmentsMap = {};
        for (const localDepartment of context.localDepartments) {
          localDepartment.__status = 0;
          context.localDepartmentsMap[localDepartment.departmentId] = localDepartment;
        }
        // loop create/update
        for (const remoteDepartment of context.remoteDepartments) {
          await this._queueSyncDepartment({ context, remoteDepartment });
        }
        // delete __status===0
        for (const departmentId in context.localDepartmentsMap) {
          const localDepartment = context.localDepartmentsMap[departmentId];
          if (localDepartment.__status === 0) {
            await this._deleteRoleAndDepartment({ localDepartment, department: null });
            // progress
            await this._progressPublish({ context, done: 0, text: `- ${localDepartment.departmentName}` });
          }
        }
        // build roles
        await this.ctx.meta.role.build();
        // progress done
        await this._progressPublish({ context, done: 1, text: `--- ${this.ctx.text('Sync Completed')} ---` });
      } catch (err) {
        // progress error
        await this._progressPublish({ context, done: -1, text: err.message });
        // throw err
        throw err;
      }
    }

    // queue sync members
    async _queueSyncMembers({ progressId, userOp }) {
      // prepare context
      const context = {
        remoteMembers: null,
        progressId,
        userOp,
      };
      try {
        // progress
        await this._progressPublish({ context, done: 0, text: `--- ${this.ctx.text('Sync Started')} ---` });
        // remote members
        const departmentRoot = await this.ctx.model.department.get({ departmentParentId: 0 });
        if (!departmentRoot) return this.ctx.throw(1006);
        const res = await this.ctx.meta.wxwork.app.contacts.getDepartmentUserList(departmentRoot.departmentId, 1);
        if (res.errcode) {
          throw new Error(res.errmsg);
        }
        context.remoteMembers = res.userlist;
        // progress
        await this._progressPublish({ context, done: 0, text: `--- ${this.ctx.text('Member Count')}: ${context.remoteMembers.length} ---` });
        // local members
        context.localMembers = await this.ctx.model.member.select();
        context.localMembersMap = {};
        for (const localMember of context.localMembers) {
          localMember.__status = 0;
          context.localMembersMap[localMember.memberId] = localMember;
        }
        // loop create/update
        for (const remoteMember of context.remoteMembers) {
          await this._queueSyncMember({ context, remoteMember });
        }
        // delete __status===0
        for (const memberId in context.localMembersMap) {
          const localMember = context.localMembersMap[memberId];
          if (localMember.__status === 0) {
            await this._deleteUserAndMember({ localMember, member: null });
            // progress
            await this._progressPublish({ context, done: 0, text: `- ${localMember.name}` });
          }
        }
        // progress done
        await this._progressPublish({ context, done: 1, text: `--- ${this.ctx.text('Sync Completed')} ---` });
      } catch (err) {
        // progress error
        await this._progressPublish({ context, done: -1, text: err.message });
        // throw err
        throw err;
      }
    }

    async _progressPublish({ context, done, text }) {
      const ioMessage = {
        userIdTo: context.userOp.id,
        messageFilter: context.progressId,
        content: { done, text },
      };
      await this.ctx.meta.io.publish({
        path: `/${moduleInfo.url}/progress/${context.progressId}`,
        message: ioMessage,
        messageClass: {
          module: moduleInfo.relativeName,
          messageClassName: 'progress',
        },
        options: {
          saveMessageAsync: true,
        },
      });
    }

    async _queueSyncDepartment({ context, remoteDepartment }) {
      const department = {};
      this._adjustFields(department, remoteDepartment, __departmentFieldMap);
      const departmentId = department.departmentId;
      // check if local department exists
      const localDepartment = context.localDepartmentsMap[departmentId];
      // new department
      if (!localDepartment) {
        await this._createRoleAndDepartment({ department });
        // progress
        await this._progressPublish({ context, done: 0, text: `+ ${department.departmentName}` });
        // done
        return;
      }
      // update
      await this._updateRoleAndDepartment({ localDepartment, department });
      // progress: not prompt
      // done
      localDepartment.__status = 1; // handled
      return;
    }

    async _queueSyncMember({ context, remoteMember }) {
      const member = {};
      this._adjustFields(member, remoteMember, __memberFieldMap);
      const memberId = member.memberId;
      // check if local member exists
      const localMember = context.localMembersMap[memberId];
      // new member
      if (!localMember) {
        await this._createUserAndMember({ member });
        // progress
        await this._progressPublish({ context, done: 0, text: `+ ${member.name}` });
        // done
        return;
      }
      // update
      await this._updateUserAndMember({ localMember, member });
      // progress: not prompt
      // done
      localMember.__status = 1; // handled
      return;
    }

    async _deleteRoleAndDepartment({ localDepartment, department }) {
      // localDepartment
      if (!localDepartment) {
        localDepartment = await this.ctx.model.department.get({ departmentId: department.departmentId });
        if (!localDepartment) {
          this.ctx.throw(1004, department.departmentId);
        }
      }
      // delete role
      await this.ctx.meta.role.delete({ roleId: localDepartment.roleId, force: true });
      // delete department
      await this.ctx.model.department.delete({ id: localDepartment.id });
    }

    async _deleteUserAndMember({ localMember, member }) {
      // localMember
      if (!localMember) {
        localMember = await this.ctx.model.member.get({ memberId: member.memberId });
        if (!localMember) {
          this.ctx.throw(1005, member.memberId);
        }
      }
      const userId = localMember.userId;
      // delete user: including roles/auth
      await this.ctx.meta.user.delete({ userId });
      // delete member
      await this.ctx.model.member.delete({ id: localMember.id });
    }

    async _updateRoleAndDepartment({ localDepartment, department }) {
      // localDepartment
      if (!localDepartment) {
        localDepartment = await this.ctx.model.department.get({ departmentId: department.departmentId });
        if (!localDepartment) {
          this.ctx.throw(1004, department.departmentId);
        }
      }
      // update role name
      if (department.departmentName) {
        await this.ctx.meta.role.save({
          roleId: localDepartment.roleId,
          data: { roleName: department.departmentName },
        });
      }
      // update department
      department.id = localDepartment.id;
      await this.ctx.model.department.update(department);
    }

    async _updateUserRoles({ userId, departmentIdsOld, departmentIdsNew }) {
      const departmentIdsAdd = [];
      const departmentIdsDelete = [];
      for (const departmentId of departmentIdsNew) {
        if (departmentIdsOld.indexOf(departmentId) === -1) {
          departmentIdsAdd.push(departmentId);
        }
      }
      for (const departmentId of departmentIdsOld) {
        if (departmentIdsNew.indexOf(departmentId) === -1) {
          departmentIdsDelete.push(departmentId);
        }
      }
      // add
      await this._addUserRoles({ userId, departmentIds: departmentIdsAdd });
      // delete
      await this._deleteUserRoles({ userId, departmentIds: departmentIdsDelete });
    }

    async _updateUserAndMember({ localMember, member }) {
      // localMember
      if (!localMember) {
        localMember = await this.ctx.model.member.get({ memberId: member.memberId });
        if (!localMember) {
          this.ctx.throw(1005, member.memberId);
        }
      }
      const userId = localMember.userId;
      // roles
      if (member.department !== undefined && member.department !== localMember.department) {
        await this._updateUserRoles({
          userId,
          departmentIdsOld: (localMember.department || '').split(','),
          departmentIdsNew: (member.department || '').split(','),
        });
      }
      // status
      if (member.status !== undefined && member.status !== localMember.status) {
        await this.ctx.meta.user.disable({ userId, disabled: member.status !== 1 });
      }
      // update member
      member.id = localMember.id;
      await this.ctx.model.member.update(member);
    }

    async _createRoleAndDepartment({ department }) {
      // get parent role
      const roleParent = await this._getRoleOfDepartment({ departmentId: department.departmentParentId });
      if (!roleParent) {
        this.ctx.throw(1003, department.departmentParentId);
      }
      // create current role
      const roleIdCurrent = await this.ctx.meta.role.add({
        roleName: department.departmentName,
        catalog: 0, // update by sub role
        sorting: department.departmentOrder,
        roleIdParent: roleParent.id,
      });
        // force change parent role to catalog=1
      await this.ctx.meta.role.save({
        roleId: roleParent.id,
        data: { catalog: 1 },
      });
      // creat department
      department.roleId = roleIdCurrent;
      const res = await this.ctx.model.department.insert(department);
      return res.insertId;
    }

    // [1,2]
    async _addUserRoles({ userId, departmentIds }) {
      for (const departmentId of departmentIds) {
        // get role of department
        const roleCurrent = await this._getRoleOfDepartment({ departmentId });
        if (!roleCurrent) {
          this.ctx.throw(1003, departmentId);
        }
        // add user role
        await this.ctx.meta.role.addUserRole({ userId, roleId: roleCurrent.id });
      }
    }

    async _deleteUserRoles({ userId, departmentIds }) {
      for (const departmentId of departmentIds) {
        // get role of department
        const roleCurrent = await this._getRoleOfDepartment({ departmentId });
        if (!roleCurrent) {
          this.ctx.throw(1003, departmentId);
        }
        // add user role
        await this.ctx.meta.role.deleteUserRole({ userId, roleId: roleCurrent.id });
      }
    }

    async _createUserAndMember({ member }) {
      // 1. create user&auth
      // verify auth user
      const wxworkHelper = new (WxworkHelperFn(this.ctx))();
      const verifyUser = await wxworkHelper.verifyAuthUser({ scene: 'wxwork', member, needLogin: false });
      const userId = verifyUser.agent.id;

      // 2. add user to role
      if (member.department) {
        await this._addUserRoles({ userId, departmentIds: member.department.split(',') });
        // delete role:activated (need not)
      }

      // 3. status
      if (member.status !== 1) {
        await this.ctx.meta.user.disable({ userId, disabled: true });
      }

      // 4. create member
      member.userId = userId;
      const res = await this.ctx.model.member.insert(member);
      return res.insertId;
    }

    // not create new role here
    async _getRoleOfDepartment({ departmentId }) {
      // role top
      if (departmentId === 0) {
        return await this._getRoleTop();
      }
      // department
      const department = await this.ctx.model.department.get({ departmentId });
      if (!department) return null;
      return await this.ctx.meta.role.get({ id: department.roleId });
    }

    // get role top
    async _getRoleTop() {
      const roleContainer = await this.ctx.meta.role.get({ roleName: this.ctx.config.sync.department.roleContainer });
      const roleTop = await this.ctx.meta.role.get({ roleName: this.ctx.config.sync.department.roleTop, roleIdParent: roleContainer.id });
      if (roleTop) return roleTop;
      // create role
      const data = {
        roleName: this.ctx.config.sync.department.roleTop,
        catalog: 1,
        sorting: 0,
        roleIdParent: roleContainer.id,
      };
      data.id = await this.ctx.meta.role.add(data);
      return data;
    }

    _adjustFields(itemDest, itemSrc, fieldMap) {
      for (const index in fieldMap[1]) {
        const field = fieldMap[1][index];
        if (itemSrc[field] !== undefined) {
          const fieldDest = fieldMap[0][index];
          itemDest[fieldDest] = this._adjustFieldType(itemSrc[field], fieldMap[2][index]);
        }
      }
    }
    _adjustFieldType(value, type) {
      if (type === 'number') return Number(value);
      else if (type === 'string') return String(value);
      else if (type === 'array') return value.join(',');
      else if (type === 'json') return JSON.stringify(value);
      return value;
    }

  }

  return Contacts;
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
      if (provider && provider.module === 'a-wxwork') {
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
      const config = this.ctx.config.account.wxwork;
      const configAppSelfBuilt = config.apps.selfBuilt;
      // params
      const params = {
        debug: configAppSelfBuilt.jssdk.debug,
        jsApiList: configAppSelfBuilt.jssdk.jsApiList,
        url,
      };
      return await this.ctx.meta.wxwork.app.selfBuilt.getJsConfig(params);
    }

    async jsconfigAgent({ url }) {
      // config
      const config = this.ctx.config.account.wxwork;
      const configAppSelfBuilt = config.apps.selfBuilt;
      // params
      const params = {
        agentid: configAppSelfBuilt.agentid,
        jsApiList: configAppSelfBuilt.jssdkAgent.jsApiList,
        url,
      };
      return await this.ctx.meta.wxwork.app.selfBuilt.getJsConfigAgent(params);
    }

  }

  return JSSDK;
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

const WxworkHelperFn = __webpack_require__(1);

module.exports = app => {

  class AuthMini extends app.Service {

    async login({ scene, code }) {
      if (!code) return this.ctx.throw(403);
      const res = await this.ctx.meta.wxwork.app.mini[scene].code2Session(code);
      // const res = { errcode: 0, userid: 'YangJian1', session_key: 'kJtdi6RF+Dv67QkbLlPGjw==' };
      if (res.errcode) throw new Error(res.errmsg);
      const session_key = res.session_key;
      const memberId = res.userid;
      // verify
      const wxworkHelper = new (WxworkHelperFn(this.ctx))();
      await wxworkHelper.verifyAuthUser({ scene: `wxworkmini${scene}`, memberId });
      // save session_key, because ctx.user maybe changed
      await this.ctx.meta.wxwork.mini[scene].saveSessionKey(session_key);
      // echo
      return await this.ctx.meta.auth.echo();
    }

  }

  return AuthMini;
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

const department = __webpack_require__(28);
const member = __webpack_require__(29);

module.exports = app => {
  const models = {
    department,
    member,
  };
  return models;
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = app => {
  class Department extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aWxworkDepartment', options: { disableDeleted: true } });
    }
  }
  return Department;
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = app => {
  class Member extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aWxworkMember', options: { disableDeleted: false } });
    }
  }
  return Member;
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

const authFn = __webpack_require__(31);

module.exports = app => {
  // const schemas = require('./config/validation/schemas.js')(app);
  // socketio
  const socketioMessageProgress = __webpack_require__(34)(app);
  const socketioChannelApp = __webpack_require__(35)(app);
  const meta = {
    base: {
      atoms: {
      },
      functions: {
        contacts: {
          title: 'Contacts Management',
          actionPath: 'contacts/management',
          sorting: 1,
          menu: 0,
        },
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
    settings: {
      instance: {
        actionPath: 'settings/list',
      },
    },
    event: {
      declarations: {
        wxworkMessage: 'Wechat Work Message',
      },
      implementations: {
        'a-base:loginInfo': 'event/loginInfo',
      },
    },
    index: {
      indexes: {
        aWxworkDepartment: 'createdAt,updatedAt,roleId,departmentId,departmentParentId',
        aWxworkMember: 'createdAt,updatedAt,userId,memberId',
      },
    },
    socketio: {
      messages: {
        progress: socketioMessageProgress,
      },
      channels: {
        app: socketioChannelApp,
      },
    },
    auth: authFn,
  };
  return meta;
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const strategy = __webpack_require__(32);
const WxworkHelperFn = __webpack_require__(1);
const authProviderScenes = __webpack_require__(2);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createProvider(sceneInfo) {
    return {
      meta: {
        title: sceneInfo.title,
        mode: 'redirect',
        disableAssociate: true,
        component: `button${sceneInfo.authProvider}`,
      },
      config: {
        corpid: '',
        agentid: '',
        client: sceneInfo.client,
        scope: 'snsapi_base',
      },
      configFunctions: {
        getConfig(ctx) {
          const config = ctx.config.module(moduleInfo.relativeName).account.wxwork;
          return { corpid: config.corpid, agentid: config.apps.selfBuilt.agentid };
        },
      },
      handler: app => {
        return {
          strategy,
          callback: (req, code, done) => {
            // ctx/state
            const ctx = req.ctx;
            const state = ctx.request.query.state || 'login';
            // code/memberId
            const wxworkHelper = new (WxworkHelperFn(ctx))();
            const api = wxworkHelper.createWxworkApi();
            api.app.selfBuilt.getUserIdByCode(code).then(res => {
              if (res.errcode) throw new Error(res.errmsg);
              const memberId = res.UserId;
              wxworkHelper.verifyAuthUser({
                scene: sceneInfo.scene,
                memberId,
                state,
                cbVerify: (profileUser, cb) => {
                  app.passport.doVerify(req, profileUser, cb);
                },
              }).then(verifyUser => { done(null, verifyUser); }).catch(done);
            }).catch(done);
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

  // wxwork/wxworkweb
  for (const scene of [ 'wxwork', 'wxworkweb' ]) {
    const sceneInfo = authProviderScenes.getScene(scene);
    metaAuth.providers[sceneInfo.authProvider] = _createProvider(sceneInfo);
  }

  // minis
  const moduleConfig = app.meta.configs[moduleInfo.relativeName];
  const minis = moduleConfig.account.wxwork.minis;
  for (const sceneShort in minis) {
    const scene = `wxworkmini${sceneShort}`;
    const sceneInfo = authProviderScenes.getScene(scene);
    metaAuth.providers[sceneInfo.authProvider] = _createProviderMini(sceneInfo);
  }

  // ok
  return metaAuth;
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const util = require3('util');
const passport = require3('passport-strategy');
const OAuth = __webpack_require__(33);

const __OAUTH = Symbol('WXWORK#__OAUTH');

function WxworkStrategy(options, verify) {
  options = options || {};

  if (!verify) {
    throw new TypeError('WxworkStrategy required a verify callback');
  }

  if (typeof verify !== 'function') {
    throw new TypeError('_verify must be function');
  }

  passport.Strategy.call(this, options, verify);

  this.name = options.name || 'wxwork';
  this._client = options.client || 'wxwork';
  this._verify = verify;
  this._callbackURL = options.callbackURL;
  this._lang = options.lang || 'en';
  this._state = options.state;
  this._scope = options.scope || 'snsapi_base';
  this._passReqToCallback = options.passReqToCallback;

}

util.inherits(WxworkStrategy, passport.Strategy);

WxworkStrategy.prototype.getOAuth = function(options) {
  if (this[__OAUTH] === undefined) {
    let corpid = options.corpid;
    let agentid = options.agentid;
    if (!corpid || !agentid) {
      const _config = options.getConfig();
      corpid = _config.corpid;
      agentid = _config.agentid;
    }
    this[__OAUTH] = new OAuth(corpid, agentid);
  }
  return this[__OAUTH];
};

WxworkStrategy.prototype.authenticate = function(req, options) {

  if (!req._passport) {
    return this.error(new Error('passport.initialize() middleware not in use'));
  }

  const self = this;

  options = options || {};

  // oauth
  const _oauth = this.getOAuth(options);

  // 校验完成信息
  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    self.success(user, info);
  }

  // 获取code授权成功
  if (req.url.indexOf('/callback') > -1) {

    // 获取code,并校验相关参数的合法性
    // No code only state --> User has rejected send details. (Fail authentication request).
    if (req.query && req.query.state && !req.query.code) {
      return self.fail(401);
    }

    // Documentation states that if user rejects userinfo only state will be sent without code
    // In reality code equals "authdeny". Handle this case like the case above. (Fail authentication request).
    if (req.query && req.query.code === 'authdeny') {
      return self.fail(401);
    }

    const code = req.query.code;

    try {
      if (self._passReqToCallback) {
        self._verify(req, code, verified);
      } else {
        self._verify(code, verified);
      }
    } catch (ex) {
      return self.error(ex);
    }

  } else {
    const state = options.state || self._state;
    const callbackURL = options.callbackURL || self._callbackURL;
    const scope = options.scope || self._scope;

    const methodName = (this._client === 'wxwork') ? 'getAuthorizeURL' : 'getAuthorizeURLForWebsite';
    const location = _oauth[methodName](callbackURL, state, scope);

    self.redirect(location, 302);
  }
};

module.exports = WxworkStrategy;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const querystring = require3('querystring');

const OAuth = function(appid, agentid) {
  this.appid = appid;
  this.agentid = agentid;
};

OAuth.prototype.getAuthorizeURL = function(redirect, state, scope) {
  const url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
  const info = {
    appid: this.appid,
    redirect_uri: redirect,
    response_type: 'code',
    scope: scope || 'snsapi_base',
    state: state || '',
  };

  return url + '?' + querystring.stringify(info) + '#wechat_redirect';
};

OAuth.prototype.getAuthorizeURLForWebsite = function(redirect, state) {
  const url = 'https://open.work.weixin.qq.com/wwopen/sso/qrConnect';
  const info = {
    appid: this.appid,
    agentid: this.agentid,
    redirect_uri: redirect,
    state: state || '',
  };

  return url + '?' + querystring.stringify(info);
};

module.exports = OAuth;


/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = app => {
  const progress = {
    info: {
      title: 'Progress',
      persistence: true,
    },
    callbacks: {
    },
  };
  return progress;
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

const WxworkHelperFn = __webpack_require__(1);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  async function onPush({ ctx, content }) {
    // userIds / roleIds
    const userIds = content.userIds;
    const roleIds = content.roleIds;
    // message
    const message = {
      ... content.data,
    };
    // agentid
    const config = ctx.config.module(moduleInfo.relativeName).account.wxwork;
    message.agentid = config.apps.selfBuilt.agentid;
    // userIds
    if (userIds && userIds.length > 0) {
      const modelMember = ctx.model.module(moduleInfo.relativeName).member;
      const list = await modelMember.select({
        where: { userId: userIds },
        columns: [ 'memberId' ],
      });
      message.touser = list.map(item => item.memberId).join('|');
    }
    // roleIds
    if (roleIds && roleIds.length > 0) {
      const modelDepartment = ctx.model.module(moduleInfo.relativeName).department;
      const list = await modelDepartment.select({
        where: { roleId: roleIds },
        columns: [ 'departmentId' ],
      });
      message.toparty = list.map(item => item.departmentId).join('|');
    }
    // send
    const wxworkHelper = new (WxworkHelperFn(ctx))();
    const api = wxworkHelper.createWxworkApi();
    await api.app.selfBuilt.sendMessage(message);
    // done
    return true;
  }

  const ChannelApp = {
    info: {
      title: 'App Message',
    },
    callbacks: {
      onPush,
    },
  };
  return ChannelApp;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map