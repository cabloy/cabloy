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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(2);
const locales = __webpack_require__(3);
const errors = __webpack_require__(5);
const middlewares = __webpack_require__(6);

module.exports = app => {

  // routes
  const routes = __webpack_require__(7)(app);
  // services
  const services = __webpack_require__(12)(app);
  // models
  const models = __webpack_require__(15)(app);
  // meta
  const meta = __webpack_require__(16)(app);

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
/* 2 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // account
  config.account = {};

  // account.public
  config.account.public = {
    appID: '',
    appSecret: '',
    token: '',
    encodingAESKey: '',
    message: {
      autoReply: '',
    },
  };

  return config;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(4),
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(8);
const message = __webpack_require__(9);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // message
    { method: 'get', path: 'message/index', controller: message, meta: { auth: { enable: false } } },
    { method: 'post', path: 'message/index', controller: message, meta: { auth: { enable: false } } },
  ];
  return routes;
};


/***/ }),
/* 8 */
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const WechatCrypto = require3('wechat-crypto');
const wechatUtils = __webpack_require__(10);

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
            wrap.TimeStamp = wechatUtils.createTimeStamp();
            wrap.Nonce = wechatUtils.createNonce();
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const crypto = __webpack_require__(11);
const require3 = __webpack_require__(0);
const bb = require3('bluebird');
const xml2js = require3('xml2js');

module.exports = {
  createNonce() {
    return Math.random().toString(36).substr(2, 15);
  },
  createTimeStamp() {
    return parseInt(new Date().getTime() / 1000) + '';
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
/* 11 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(13);
const message = __webpack_require__(14);

module.exports = app => {
  const services = {
    version,
    message,
  };
  return services;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
    }

    async init(options) {
    }

    async test() {
    }

  }

  return Version;
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {

    async index({ message }) {
      // event
      const res = await this.ctx.meta.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessage',
        data: { message },
      });
      if (res) return res;
      // default reply
      return {
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: this.ctx.config.account.public.message.autoReply,
      };
    }


  }

  return Message;
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = app => {
  const models = {
  };
  return models;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

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
      },
    },
  };
  return meta;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map