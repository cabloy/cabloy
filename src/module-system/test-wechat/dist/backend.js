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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(1);
const locales = __webpack_require__(2);
const errors = __webpack_require__(4);
const middlewares = __webpack_require__(5);

module.exports = app => {

  // routes
  const routes = __webpack_require__(6)(app);
  // services
  const services = __webpack_require__(10)(app);
  // models
  const models = __webpack_require__(15)(app);
  // meta
  const meta = __webpack_require__(17)(app);

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
/* 1 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};
  return config;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(3),
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
  Reply: '回复',
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(7);
const event = __webpack_require__(8);
const test = __webpack_require__(9);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // event
    { method: 'post', path: 'event/wechatMessage', controller: event, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'event/wechatMessageMini', controller: event, middlewares: 'inner,wechatMini', meta: { auth: { enable: false } } },
    { method: 'post', path: 'event/loginInfo', controller: event, middlewares: 'inner', meta: { auth: { enable: false } } },
    // test
    { method: 'post', path: 'test/getOpenid', controller: test, middlewares: 'inWechat' },
    { method: 'post', path: 'test/getOpenidMini', controller: test, middlewares: 'inWechatMini' },
  ];
  return routes;
};


/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports) {

module.exports = app => {
  class EventController extends app.Controller {

    async wechatMessage() {
      const res = await this.service.event.wechatMessage({
        event: this.ctx.request.body.event,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async wechatMessageMini() {
      const res = await this.service.event.wechatMessageMini({
        event: this.ctx.request.body.event,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

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
/* 9 */
/***/ (function(module, exports) {

module.exports = app => {
  class TestController extends app.Controller {

    async getOpenid() {
      const res = await this.service.test.getOpenid({
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async getOpenidMini() {
      const res = await this.service.test.getOpenidMini({
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }


  }
  return TestController;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(11);
const event = __webpack_require__(12);
const test = __webpack_require__(14);

module.exports = app => {
  const services = {
    version,
    event,
    test,
  };
  return services;
};


/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(13);
const extend = require3('extend2');

module.exports = app => {

  class Event extends app.Service {

    async wechatMessage({ event, data }) {
      const message = data.message;
      if (message.MsgType === 'text') {
        event.break = true;
        return {
          ToUserName: message.FromUserName,
          FromUserName: message.ToUserName,
          CreateTime: new Date().getTime(),
          MsgType: 'text',
          Content: `${this.ctx.text.locale('zh-cn', 'Reply')}: ${message.Content}`,
        };
      }
    }

    async wechatMessageMini({ event, data }) {
      const message = data.message;
      if (message.MsgType === 'text') {
        event.break = true;
        const text = `${this.ctx.text.locale('zh-cn', 'Reply')}: ${message.Content}`;
        await this.ctx.meta.wechatMini.sendText(message.FromUserName, text);
      }
    }

    async loginInfo({ /* event,*/ data }) {
      const info = data.info;
      const provider = info.user && info.user.provider;
      if (provider && provider.module === 'a-wechat' && provider.providerName === 'wechat') {
        info.config = extend(true, info.config, {
          modules: {
            'a-layoutmobile': {
              layout: {
                login: '/a/login/login',
                loginOnStart: true,
                toolbar: {
                  tabbar: true, labels: true, bottomMd: true,
                },
                tabs: [
                  { name: 'Test', tabLinkActive: true, iconMaterial: 'group_work', url: '/test/wechat/test/index' },
                  { name: 'Home', tabLinkActive: false, iconMaterial: 'home', url: '/a/base/menu/list' },
                  { name: 'Mine', tabLinkActive: false, iconMaterial: 'person', url: '/a/user/user/mine' },
                ],
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
/* 13 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {

  class Test extends app.Service {

    async getOpenid({ user }) {
      const wechatUser = await this.ctx.model.wechatUser.get({ userId: user.id, scene: 1 });
      return {
        openid: wechatUser.openid,
        unionid: wechatUser.unionid,
      };
    }

    async getOpenidMini({ user }) {
      const wechatUser = await this.ctx.model.wechatUser.get({ userId: user.id, scene: 2 });
      return {
        openid: wechatUser.openid,
        unionid: wechatUser.unionid,
      };
    }

  }

  return Test;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const wechatUser = __webpack_require__(16);

module.exports = app => {
  const models = {
    wechatUser,
  };
  return models;
};


/***/ }),
/* 16 */
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
/* 17 */
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
      implementations: {
        'a-wechat:wechatMessage': 'event/wechatMessage',
        'a-wechat:wechatMessageMini': 'event/wechatMessageMini',
        'a-base:loginInfo': 'event/loginInfo',
      },
    },
  };
  return meta;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map