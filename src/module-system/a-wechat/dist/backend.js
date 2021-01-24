module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 717:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const WechatAPI = require3('@zhennann/co-wechat-api');

module.exports = function(ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  return function() {
    return new Proxy({}, {
      get(obj, prop) {
        if (obj[prop]) return obj[prop];
        if (prop === 'app') {
          // app
          obj[prop] = _createWechatApiApp();
        } else if (prop === 'mini') {
          // mini
          obj[prop] = new Proxy({}, {
            get(obj, prop) {
              if (!obj[prop]) {
                obj[prop] = _createWechatApiMini({ sceneShort: prop });
              }
              return obj[prop];
            },
          });
        } else if (prop === 'util') {
          // util
          obj[prop] = _createWechatApiUtil();
        }
        return obj[prop];
      },
    });
  };

  function _createWechatApiApp() {
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

  function _createWechatApiMini({ sceneShort }) {
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
        const cacheKey = `wechatmini-sessionKey:${ctx.state.user.agent.id}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function(sessionKey) {
        const cacheKey = `wechatmini-sessionKey:${ctx.state.user.agent.id}`;
        await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, sessionKey);
      }
    );
    // ready
    return api;
  }

  function _createWechatApiUtil() {
    return {
      // scene: empty/wechat/wechatweb/wechatmini/xxx,xxx,xxx
      in(scene) {
        // scene
        if (!scene) scene = 'wechat';
        if (typeof scene === 'string') scene = scene.split(',');
        // provider
        const provider = ctx.state.user && ctx.state.user.provider;
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

};


/***/ }),

/***/ 836:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {

    async execute(context, next) {
      const data = context.data;
      // aWechatUser
      await ctx.model.query(
        'update aWechatUser a set a.userId=? where a.iid=? and a.userId=?',
        [ data.userIdTo, ctx.instance.id, data.userIdFrom ]
      );
      // next
      await next();
    }

  }

  return eventBean;
};


/***/ }),

/***/ 427:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const extend = require3('extend2');

module.exports = ctx => {
  class eventBean {

    async execute(context, next) {
      const info = context.data.info;
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
      // next
      await next();
    }

  }

  return eventBean;
};


/***/ }),

/***/ 425:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async execute(options, next) {
      if (!ctx.bean.wechat.util.in(options.scene)) return ctx.throw.module(moduleInfo.relativeName, 1001);
      // next
      await next();
    }
  }
  return Middleware;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {

  class Version extends app.meta.BeanBase {

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

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const eventLoginInfo = __webpack_require__(427);
const eventAccountMigration = __webpack_require__(836);
const middlewareInWechat = __webpack_require__(425);
const beanWechat = __webpack_require__(717);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // event
    'event.loginInfo': {
      mode: 'ctx',
      bean: eventLoginInfo,
    },
    'event.accountMigration': {
      mode: 'ctx',
      bean: eventAccountMigration,
    },
    // middleware
    'middleware.inWechat': {
      mode: 'ctx',
      bean: middlewareInWechat,
    },
    // global
    wechat: {
      mode: 'ctx',
      bean: beanWechat,
      global: true,
    },
  };
  return beans;
};


/***/ }),

/***/ 591:
/***/ ((module) => {

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

/***/ 374:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const bb = require3('bluebird');
const extend = require3('extend2');
const authProviderScenes = __webpack_require__(591);

module.exports = function(ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class WechatHelper {

    getSceneInfo(scene) {
      return authProviderScenes.getScene(scene);
    }

    // scene: wechat/wechatweb/wechatmini
    async verifyAuthUser({ scene, openid, userInfo, cbVerify, state }) {
      // ensure wechat user
      const userWechatId = await this._ensureWechatUser({ scene, openid, userInfo });
      // ensure auth user
      const profileUser = await this._ensureAuthUser({ scene, openid, userInfo });
      // verify
      let verifyUser;
      if (!cbVerify) {
        verifyUser = await ctx.bean.user.verify({ state, profileUser });
        await ctx.login(verifyUser);
      } else {
        verifyUser = await bb.fromCallback(cb => {
          cbVerify(profileUser, cb);
        });
      }
      // update wechat userId
      await this._updateWechatUser({ userId: verifyUser.agent.id, userWechatId, userInfo });
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
    async _ensureAuthUser({ scene, openid, userInfo }) {
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
      const providerItem = await ctx.bean.user.getAuthProvider({
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
      // ready
      return profileUser;
    }

  }

  return WechatHelper;
};


/***/ }),

/***/ 290:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const crypto = __webpack_require__(417);
const require3 = __webpack_require__(718);
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

/***/ 76:
/***/ ((module) => {


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
    inWechat: {
      bean: 'inWechat',
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

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
  1001: 'Not In Wechat',
  1002: 'Not In Wechat Miniprogram',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

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

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 831:
/***/ ((module) => {

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

/***/ 586:
/***/ ((module) => {

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

/***/ 222:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const WechatCrypto = require3('wechat-crypto');
const wechatUtils = __webpack_require__(290);

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

/***/ 266:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const WechatCrypto = require3('wechat-crypto');
const wechatUtils = __webpack_require__(290);

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

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const message = __webpack_require__(222);
const jssdk = __webpack_require__(586);
const messageMini = __webpack_require__(266);
const authMini = __webpack_require__(831);

module.exports = app => {
  const controllers = {
    message,
    jssdk,
    messageMini,
    authMini,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

module.exports = app => {

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

const authFn = __webpack_require__(441);

module.exports = app => {
  // const schemas = require('./config/validation/schemas.js')(app);
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
    event: {
      declarations: {
        wechatMessage: 'Wechat Message',
        wechatMessageMini: 'Miniprogram Message',
      },
      implementations: {
        'a-base:loginInfo': 'loginInfo',
        'a-base:accountMigration': 'accountMigration',
      },
    },
    auth: authFn,
  };
  return meta;
};


/***/ }),

/***/ 471:
/***/ ((module) => {

module.exports = app => {
  class WechatUser extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aWechatUser', options: { disableDeleted: false } });
    }
  }
  return WechatUser;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const wechatUser = __webpack_require__(471);

module.exports = app => {
  const models = {
    wechatUser,
  };
  return models;
};


/***/ }),

/***/ 441:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const strategy = require3('@zhennann/passport-wechat').Strategy;
const WechatHelperFn = __webpack_require__(374);
const authProviderScenes = __webpack_require__(591);

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createProvider(sceneInfo) {
    const config = ctx.config.module(moduleInfo.relativeName).account[sceneInfo.configKey];
    if (!config.appID || !config.appSecret) return null;
    return {
      meta: {
        title: sceneInfo.title,
        mode: 'redirect',
        component: `button${sceneInfo.authProvider}`,
      },
      config: {
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

  function _createProviderMini(sceneInfo, sceneShort) {
    const config = ctx.config.module(moduleInfo.relativeName).account.minis[sceneShort];
    if (!config.appID || !config.appSecret) return null;
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
  const minis = ctx.config.module(moduleInfo.relativeName).account.minis;
  for (const sceneShort in minis) {
    const scene = `wechatmini${sceneShort}`;
    const sceneInfo = authProviderScenes.getScene(scene);
    metaAuth.providers[sceneInfo.authProvider] = _createProviderMini(sceneInfo, sceneShort);
  }

  // ok
  return metaAuth;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // message
    { method: 'get', path: 'message/index', controller: 'message', meta: { auth: { enable: false } } },
    { method: 'post', path: 'message/index', controller: 'message', meta: { auth: { enable: false } } },
    // jsapi
    { method: 'post', path: 'jssdk/jsconfig', controller: 'jssdk' },

    // messageMini
    { method: 'get', path: 'messageMini/:scene', controller: 'messageMini', action: 'index', meta: { auth: { enable: false } } },
    { method: 'post', path: 'messageMini/:scene', controller: 'messageMini', action: 'index', meta: { auth: { enable: false } } },
    // authMini
    { method: 'post', path: 'authMini/login', controller: 'authMini' },

  ];
  return routes;
};


/***/ }),

/***/ 762:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const WechatHelperFn = __webpack_require__(374);

module.exports = app => {

  class AuthMini extends app.Service {

    async login({ scene, code, detail }) {
      let session_key;
      let openid;
      let unionid;

      // mini
      const apiMini = this.ctx.bean.wechat.mini[scene];

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
      // save session_key, because ctx.state.user maybe changed
      await apiMini.saveSessionKey(session_key);
      // echo
      return await this.ctx.bean.auth.echo();
    }

  }

  return AuthMini;
};


/***/ }),

/***/ 173:
/***/ ((module) => {

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
      return await this.ctx.bean.wechat.app.getJsConfig(params);
    }

  }

  return JSSDK;
};


/***/ }),

/***/ 833:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const WechatHelperFn = __webpack_require__(374);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {

    async index({ message }) {
      let result;
      // event: subscribe
      if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
          result = await this._subscribeUser({ openid: message.FromUserName, message });
        } else if (message.Event === 'unsubscribe') {
          result = await this._unsubscribeUser({ openid: message.FromUserName, message });
        }
      }
      // raise event
      return await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessage',
        data: { message },
        result,
        next: async (context, next) => {
          // default
          if (context.result === undefined) {
            context.result = {
              ToUserName: message.FromUserName,
              FromUserName: message.ToUserName,
              CreateTime: new Date().getTime(),
              MsgType: 'text',
              Content: this.ctx.config.account.public.message.reply.default,
            };
          }
          await next();
        },
      });
    }

    async _subscribeUser({ openid, message }) {
      // user info
      const userInfo = await this.ctx.bean.wechat.app.getUser({ openid });
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

/***/ 85:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {

    async index({ scene, message }) {
      // raise event
      await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessageMini',
        data: { scene, message },
      });
    }
  }

  return Message;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const message = __webpack_require__(833);
const jssdk = __webpack_require__(173);
const messageMini = __webpack_require__(85);
const authMini = __webpack_require__(762);

module.exports = app => {
  const services = {
    message,
    jssdk,
    messageMini,
    authMini,
  };
  return services;
};


/***/ }),

/***/ 417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");;

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