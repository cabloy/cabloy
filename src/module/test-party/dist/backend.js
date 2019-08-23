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
  const routes = __webpack_require__(10)(app);
  // services
  const services = __webpack_require__(50)(app);
  // models
  const models = __webpack_require__(56)(app);
  // meta
  const meta = __webpack_require__(60)(app);

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

  if (appInfo.env === 'unittest') {
    // startups
    config.startups = {
      startupAll: {
        type: 'worker',
        path: 'test/feat/startup/all',
      },
      startupInstance: {
        type: 'worker',
        instance: true,
        path: 'test/feat/startup/instance',
      },
    };
    // middlewares
    config.middlewares = {
      testInterception: {
        global: false,
        dependencies: 'instance',
      },
      testRestructuring: {
        global: false,
        dependencies: 'instance',
      },
      testInjection: {
        global: false,
        dependencies: 'instance',
      },
    };
  }

  if (appInfo.env === 'unittest' || appInfo.env === 'local') {

    // config
    config.message = 'Hello World';

    // settings
    config.settings = {
      instance: {
        groupInfo: {
          slogan: '',
        },
      },
      user: {
        groupInfo: {
          username: 'zhennann',
        },
        groupExtra: {
          panelExtra: {
            groupInfo: {
              mobile: '123',
              sex: 1,
              language: 'en-us',
            },
          },
        },
      },
    };
  }


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
  Party: '宴会',
  Review: '评审',
  Reviewing: '评审中',
  Reviewed: '已评审',
  Birthday: '生日',
  Dance: '跳舞',
  Garden: '花园',
  Item: '条目',
  'Create Party': '新建宴会',
  'Party List': '宴会列表',
  'Level One': '层级1',
  'Level Two': '层级2',
  'Level Three': '层级3',
  'Well Done': '干得好',
  'Error Test': '错误测试',
  'Hello World': '世界，您好',
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'Error Test',
  1002: 'Incomplete Parameters',
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const interception = __webpack_require__(7);
const restructuring = __webpack_require__(8);
const injection = __webpack_require__(9);

module.exports = {
  testInterception: interception,
  testRestructuring: restructuring,
  testInjection: injection,
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = () => {
  return async function interception(ctx, next) {

    const { a, b } = ctx.request.body;
    if (a === undefined || b === undefined) return ctx.throw(1002); // 1002: 'Incomplete Parameters'

    // next
    await next();
  };
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = () => {
  return async function restructuring(ctx, next) {

    const { a, b } = ctx.request.body;
    ctx.request.body.a = parseInt(a);
    ctx.request.body.b = parseInt(b);

    // next
    await next();
  };
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = () => {
  return async function injection(ctx, next) {

    ctx.meta.__plus = (a, b) => {
      return a + b;
    };

    // next
    await next();
  };
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(11);
const party = __webpack_require__(12);
const partyPublic = __webpack_require__(13);
const testAtomStarLabel = __webpack_require__(14);
const testAtomAll = __webpack_require__(15);
const testAtomPublicFlow = __webpack_require__(16);
const testAtomRight = __webpack_require__(17);
const testFunctionRight = __webpack_require__(18);
const testFunctionAll = __webpack_require__(19);
const testFunctionPublic = __webpack_require__(20);
const testCtxPerformAction = __webpack_require__(21);
const testCtxTransaction = __webpack_require__(22);
const testCtxTail = __webpack_require__(23);
const testCtxSession = __webpack_require__(24);
const testCtxRequest = __webpack_require__(25);
const testCtxResponse = __webpack_require__(26);
const testCtxConfig = __webpack_require__(27);
const testCtxLocale = __webpack_require__(28);
const testCacheMem = __webpack_require__(29);
const testCacheDb = __webpack_require__(30);
const testRoleUserRole = __webpack_require__(31);
const testEventHello = __webpack_require__(32);
const testEventUserVerify = __webpack_require__(33);
const testFeatHttpLog = __webpack_require__(34);
const testFeatStartup = __webpack_require__(35);
const testFeatSendMail = __webpack_require__(36);
const testFeatHook = __webpack_require__(37);
const testFeatInstance = __webpack_require__(38);
const testFeatProgress = __webpack_require__(39);
const testFeatSequence = __webpack_require__(40);
const testFeatSettings = __webpack_require__(41);
const testFeatStatus = __webpack_require__(42);
const testFeatValidation = __webpack_require__(43);
const testFeatMiddleware = __webpack_require__(44);
const testKitchensinkAutocomplete = __webpack_require__(45);
const testKitchensinkGuide = __webpack_require__(47);
const testKitchensinkFormSchemaValidation = __webpack_require__(48);
const testKitchensinkPtrIsLoadMore = __webpack_require__(49);

module.exports = app => {
  let routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
  ];
  if (app.meta.isTest || app.meta.isLocal) {
    routes = routes.concat([
      // atom: party
      { method: 'post', path: 'party/create', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'party/read', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'party/select', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'party/write', controller: party, middlewares: 'inner,validate',
        meta: {
          auth: { enable: false },
          validate: { validator: 'party', data: 'item' },
        },
      },
      { method: 'post', path: 'party/delete', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'party/action', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'party/enable', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'party/types', controller: party },

      // atom: partyPublic (only for test)
      { method: 'post', path: 'partyPublic/create', controller: partyPublic, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'partyPublic/read', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'partyPublic/select', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'partyPublic/write', controller: partyPublic, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'partyPublic/delete', controller: partyPublic, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'partyPublic/action', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'partyPublic/enable', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },

      // test/atom/starLabel
      { method: 'post', path: 'test/atom/starLabel', controller: testAtomStarLabel, middlewares: 'test' },
      // test/atom/all
      { method: 'post', path: 'test/atom/all', controller: testAtomAll, middlewares: 'test', meta: { auth: { enable: false } } },
      // test/atom/publicFlow
      { method: 'post', path: 'test/atom/publicFlow', controller: testAtomPublicFlow, middlewares: 'test', meta: { auth: { enable: false } } },
      // test/atom/right(checked by middleware)
      { method: 'post', path: 'test/atom/checkRightCreate', controller: testAtomRight, middlewares: 'test',
        meta: { right: { type: 'atom', action: 1 } },
      },
      { method: 'post', path: 'test/atom/checkRightRead', controller: testAtomRight, middlewares: 'test',
        meta: { right: { type: 'atom', action: 2 } },
      },
      { method: 'post', path: 'test/atom/checkRightWrite', controller: testAtomRight, middlewares: 'test',
        meta: { right: { type: 'atom', action: 3 } },
      },
      { method: 'post', path: 'test/atom/checkRightAction', controller: testAtomRight, middlewares: 'test',
        meta: { right: { type: 'atom', action: 101 } },
      },

      // test/function/right
      { method: 'post', path: 'test/function/checkRightFunctionUser', controller: testFunctionRight, middlewares: 'test',
        meta: { right: { type: 'function', module: 'a-baseadmin', name: 'user' } },
      },
      // test/function/all
      { method: 'post', path: 'test/function/all', controller: testFunctionAll, middlewares: 'test', meta: { auth: { enable: false } } },
      // test/function/public
      { method: 'post', path: 'test/function/functionPublic', controller: testFunctionPublic, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/role/userRole
      { method: 'post', path: 'test/role/userRole', controller: testRoleUserRole, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/ctx/performAction
      { method: 'post', path: 'test/ctx/performAction', controller: testCtxPerformAction, middlewares: 'test' },
      { method: 'post', path: 'test/ctx/performAction/echo', controller: testCtxPerformAction, middlewares: 'test' },
      // test/ctx/transaction
      { method: 'post', path: 'test/ctx/transaction', controller: testCtxTransaction, middlewares: 'test,transaction' },
      // test/ctx/tail
      { method: 'post', path: 'test/ctx/tail', controller: testCtxTail, middlewares: 'test' },
      // test/ctx/session
      { method: 'post', path: 'test/ctx/session', controller: testCtxSession, middlewares: 'test' },
      { method: 'post', path: 'test/ctx/session/echo1', controller: testCtxSession, middlewares: 'test' },
      { method: 'post', path: 'test/ctx/session/echo2', controller: testCtxSession, middlewares: 'test' },
      // test/ctx/request
      { method: 'post', path: 'test/ctx/request/:id', controller: testCtxRequest, action: 'request', middlewares: 'test', meta: { auth: { enable: false } } },
      // test/ctx/response
      { method: 'post', path: 'test/ctx/response/success', controller: testCtxResponse, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/ctx/response/successMore', controller: testCtxResponse, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/ctx/response/fail', controller: testCtxResponse, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/ctx/response/throwError', controller: testCtxResponse, middlewares: 'test', meta: { auth: { enable: false } } },
      // test/ctx/config
      { method: 'post', path: 'test/ctx/config/test', controller: testCtxConfig, middlewares: 'test', meta: { auth: { enable: false } } },
      // test/ctx/locale
      { method: 'post', path: 'test/ctx/locale/enus', controller: testCtxLocale, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/ctx/locale/zhcn', controller: testCtxLocale, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/event/hello
      { method: 'post', path: 'test/event/hello', controller: testEventHello, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/event/helloEcho', controller: testEventHello, middlewares: 'test,inner', meta: { auth: { enable: false } } },
      // test/event/userVerify
      { method: 'post', path: 'test/event/userVerify', controller: testEventUserVerify, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/cache
      { method: 'post', path: 'test/cache/mem', controller: testCacheMem, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/cache/db', controller: testCacheDb, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/feat/httpLog
      { method: 'post', path: 'test/feat/httpLog', controller: testFeatHttpLog, middlewares: 'test,httpLog', meta: { auth: { enable: false } } },

      // test/feat/startup
      { method: 'post', path: 'test/feat/startup/all', controller: testFeatStartup, middlewares: 'inner', meta: { instance: { enable: false } } },
      { method: 'post', path: 'test/feat/startup/instance', controller: testFeatStartup, middlewares: 'inner', meta: { auth: { enable: false } } },

      // test/feat/sendMail
      { method: 'post', path: 'test/feat/sendMail', controller: testFeatSendMail, middlewares: 'test,mail', meta: { auth: { enable: false } } },

      // test/feat/hook
      { method: 'post', path: 'test/feat/hook/echo', controller: testFeatHook, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/feat/hook/echoBefore', controller: testFeatHook, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/feat/hook/echoAfter', controller: testFeatHook, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/feat/hook
      { method: 'post', path: 'test/feat/instance', controller: testFeatInstance, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/feat/progress
      { method: 'post', path: 'test/feat/progress', controller: testFeatProgress, middlewares: 'progress', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/feat/progressInBackground', controller: testFeatProgress, middlewares: 'inner,progress', meta: { auth: { enable: false } } },

      // test/feat/sequence
      { method: 'post', path: 'test/feat/sequence', controller: testFeatSequence, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/feat/settings
      { method: 'post', path: 'test/feat/settings', controller: testFeatSettings, middlewares: 'test' },

      // test/feat/status
      { method: 'post', path: 'test/feat/status', controller: testFeatStatus, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/feat/validation
      { method: 'post', path: 'test/feat/validation/success', controller: testFeatValidation, middlewares: 'test,validate',
        meta: { auth: { enable: false }, validate: { validator: 'userTest' } },
      },
      { method: 'post', path: 'test/feat/validation/fail', controller: testFeatValidation, middlewares: 'test,validate',
        meta: { auth: { enable: false }, validate: { validator: 'userTest' } },
      },
      { method: 'post', path: 'test/feat/validation/schema', controller: testFeatValidation, middlewares: 'test,validate',
        meta: { auth: { enable: false }, validate: { validator: 'userTest', schema: 'settingsUserExtra' } },
      },

      // test/feat/middleware
      { method: 'post', path: 'test/feat/middleware/interception', controller: testFeatMiddleware, middlewares: 'test,testInterception' },
      { method: 'post', path: 'test/feat/middleware/restructuring', controller: testFeatMiddleware, middlewares: 'test,testInterception,testRestructuring' },
      { method: 'post', path: 'test/feat/middleware/injection', controller: testFeatMiddleware, middlewares: 'test,testInterception,testRestructuring,testInjection' },

      // kitchen-sink/guide
      { method: 'post', path: 'kitchen-sink/guide/echo', controller: testKitchensinkGuide },
      { method: 'post', path: 'kitchen-sink/guide/echo3', controller: testKitchensinkGuide },
      { method: 'post', path: 'kitchen-sink/guide/echo4', controller: testKitchensinkGuide },

      // kitchen-sink/autocomplete
      { method: 'get', path: 'kitchen-sink/autocomplete/languages/:query', controller: testKitchensinkAutocomplete, action: 'languages', meta: { auth: { enable: false } } },
      // kitchen-sink/form-schema-validation
      { method: 'get', path: 'kitchen-sink/form-schema-validation/load', controller: testKitchensinkFormSchemaValidation },
      { method: 'post', path: 'kitchen-sink/form-schema-validation/saveSimple', controller: testKitchensinkFormSchemaValidation },
      { method: 'post', path: 'kitchen-sink/form-schema-validation/saveValidation', controller: testKitchensinkFormSchemaValidation, middlewares: 'validate',
        meta: {
          validate: { validator: 'formTest' },
        },
      },
      // kitchen-sink/ptr-is-loadmore
      { method: 'post', path: 'kitchen-sink/ptr-is-loadmore/list', controller: testKitchensinkPtrIsLoadMore },

    ]);
  }
  return routes;
};


/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, exports) {

module.exports = app => {

  class PartyController extends app.Controller {

    async create() {
      const res = await this.ctx.service.party.create(this.ctx.request.body);
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.party.read(this.ctx.request.body);
      this.ctx.success(res);
    }

    async select() {
      const res = await this.ctx.service.party.select(this.ctx.request.body);
      this.ctx.success(res);
    }

    async write() {
      await this.ctx.service.party.write(this.ctx.request.body);
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.party.delete(this.ctx.request.body);
      this.ctx.success();
    }

    async action() {
      const res = await this.ctx.service.party.action(this.ctx.request.body);
      this.ctx.success(res);
    }

    async enable() {
      const res = await this.ctx.service.party.enable(this.ctx.request.body);
      this.ctx.success(res);
    }

    async types() {
      const res = await this.ctx.service.party.types(this.ctx.request.body);
      this.ctx.success(res);
    }

  }

  return PartyController;
};



/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = app => {

  class PartyPublicController extends app.Controller {

    async create() {
      const res = await this.ctx.service.partyPublic.create(this.ctx.request.body);
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.party.read(this.ctx.request.body);
      this.ctx.success(res);
    }

    async select() {
      const res = await this.ctx.service.party.select(this.ctx.request.body);
      this.ctx.success(res);
    }

    async write() {
      await this.ctx.service.partyPublic.write(this.ctx.request.body);
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.partyPublic.delete(this.ctx.request.body);
      this.ctx.success();
    }

    async action() {
      const res = await this.ctx.service.party.action(this.ctx.request.body);
      this.ctx.success(res);
    }

    async enable() {
      const res = await this.ctx.service.party.enable(this.ctx.request.body);
      this.ctx.success(res);
    }

  }

  return PartyPublicController;
};



/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class StarLabelController extends app.Controller {

    async starLabel() {
      // atomClass
      const atomClass = await this.ctx.meta.atomClass.get({ atomClassName: 'party' });
      // user
      const user = this.ctx.user.op;

      // add party:star
      const partyKey = await this.ctx.meta.atom.create({
        atomClass,
        user,
      });

      // write party
      await this.ctx.meta.atom.write({
        key: partyKey,
        item: { atomName: 'test:starLabel' },
        user,
      });

      // get party
      let party = await this.ctx.meta.atom.read({ key: partyKey, user });
      assert.equal(party.star, null);
      assert.equal(party.labels, null);

      // set star/label
      await this.ctx.meta.atom.star({ key: partyKey, atom: { star: 1 }, user });
      await this.ctx.meta.atom.labels({ key: partyKey, atom: { labels: [ 1 ] }, user });

      // get party
      party = await this.ctx.meta.atom.read({ key: partyKey, user });
      assert.equal(party.star, 1);
      assert.equal(party.labels, '[1]');

      // select parties
      let parties = await this.ctx.meta.atom.select({
        user,
        options: {
          star: 1,
          where: { atomName: 'test:starLabel' },
        },
      });
      assert.equal(parties.length, 1);

      parties = await this.ctx.meta.atom.select({
        user,
        options: {
          label: 1,
          where: { atomName: 'test:starLabel' },
        },
      });
      assert.equal(parties.length, 1);

      parties = await this.ctx.meta.atom.select({
        user,
        options: {
          label: 2,
          where: { atomName: 'test:starLabel' },
        },
      });
      assert.equal(parties.length, 0);

      // clear star/label
      await this.ctx.meta.atom.star({ key: partyKey, atom: { star: 0 }, user });
      await this.ctx.meta.atom.labels({ key: partyKey, atom: { labels: null }, user });

      // get party
      party = await this.ctx.meta.atom.read({ key: partyKey, user });
      assert.equal(party.star, null);
      assert.equal(party.labels, null);

      // delete party
      await this.ctx.meta.atom.delete({ key: partyKey, user });

      // done
      this.ctx.success();
    }

  }

  return StarLabelController;
};



/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class AllController extends app.Controller {

    async all() {
      // atomClass
      const atomClass = await this.ctx.meta.atomClass.get({ atomClassName: 'party' });
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');

      // user->atom
      await this._testCheckList(userIds, [
        [ 'Tom', 0 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // Tom add party
      const partyKey = await this.ctx.meta.atom.create({
        atomClass,
        user: { id: userIds.Tom },
      });
      await this.ctx.meta.atom.write({
        key: partyKey,
        item: { atomName: 'test:all', personCount: 3 },
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 1 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // Tom enable(submit) party
      await this.ctx.meta.atom.enable({
        key: partyKey,
        atom: {
          atomEnabled: 1,
        },
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 1 ],
        [ 'Jane', 1 ],
        [ 'Jimmy', 1 ],
        [ 'Smith', 1 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // Tom update party
      await this.ctx.meta.atom.write({
        key: partyKey,
        item: { personCount: 8 },
        user: { id: userIds.Tom },
      });

      // Tom get party
      const party = await this.ctx.meta.atom.read({ key: partyKey, user: { id: userIds.Tom } });
      assert.equal(party.personCount, 8);

      // Tom list party
      const parties = await this.ctx.meta.atom.select({
        atomClass,
        options: {
          where: { atomName: { val: 'test:all', op: 'likeRight' } },
          orders: [[ 'a.createdAt', 'desc' ]],
          page: { index: 0, size: 0 },
        },
        user: { id: userIds.Tom },
      });
      assert.equal(parties.length, 1);

      // checkRightRead
      const checkRightReads = [[ 'Tom', partyKey.atomId, true ]];
      for (const [ userName, atomId, right ] of checkRightReads) {
        const res = await this.ctx.meta.atom.checkRightRead({
          atom: { id: atomId },
          user: { id: userIds[userName] },
        });
        assert.equal(!!res, right, userName);
      }

      // checkRightWrite
      const checkRightWrites = [[ 'Tom', partyKey.atomId, true ], [ 'Tomson', partyKey.atomId, false ]];
      for (const [ userName, atomId, right ] of checkRightWrites) {
        const res = await this.ctx.meta.atom.checkRightUpdate({
          atom: { id: atomId, action: this.ctx.constant.module('a-base').atom.action.write },
          user: { id: userIds[userName] },
        });
        assert.equal(!!res, right, userName);
      }

      // checkRightDelete
      const checkRightDeletes = [[ 'Tom', partyKey.atomId, true ], [ 'Tomson', partyKey.atomId, false ]];
      for (const [ userName, atomId, right ] of checkRightDeletes) {
        const res = await this.ctx.meta.atom.checkRightUpdate({
          atom: { id: atomId, action: this.ctx.constant.module('a-base').atom.action.delete },
          user: { id: userIds[userName] },
        });
        assert.equal(!!res, right, userName);
      }

      // checkRightCreate
      const checkRightCreates = [[ 'Tom', true ], [ 'Jimmy', true ], [ 'Smith', false ]];
      for (const [ userName, right ] of checkRightCreates) {
        const res = await this.ctx.meta.atom.checkRightCreate({
          atomClass,
          user: { id: userIds[userName] },
        });
        assert.equal(!!res, right, userName);
      }

      // checkRightAction:review(flag=1)
      const checkRightActions_1 = [[ 'Tom', partyKey.atomId, false ], [ 'Jane', partyKey.atomId, true ]];
      for (const [ userName, atomId, right ] of checkRightActions_1) {
        const res = await this.ctx.meta.atom.checkRightAction({
          atom: { id: atomId, action: 101 },
          user: { id: userIds[userName] },
        });
        assert.equal(!!res, right, userName);
      }

      // action: review
      await this.ctx.meta.atom.action({
        action: 101,
        key: partyKey,
        user: { id: userIds.Jane },
      });

      // checkRightAction:review(flag=2)
      const checkRightActions_2 = [[ 'Tom', partyKey.atomId, false ], [ 'Jane', partyKey.atomId, false ]];
      for (const [ userName, atomId, right ] of checkRightActions_2) {
        const res = await this.ctx.meta.atom.checkRightAction({
          atom: { id: atomId, action: 101 },
          user: { id: userIds[userName] },
        });
        assert.equal(!!res, right, userName);
      }

      // action: review again
      try {
        await this.ctx.meta.atom.action({
          action: 101,
          key: partyKey,
          user: { id: userIds.Jane },
        });
      } catch (e) {
        assert.equal(e.code, 405);
      }

      // Tom delete party
      await this.ctx.meta.atom.delete({
        key: partyKey,
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 0 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // done
      this.ctx.success();
    }

    async _testCheckList(userIds, userAtoms, cb) {
      for (const [ userName, atomCountExpected ] of userAtoms) {
        const list = await this.ctx.meta.atom.select({
          options: {
            where: {
              atomName: 'test:all',
              'b.module': 'test-party',
            },
            orders: null,
            page: null,
          },
          user: { id: userIds[userName] },
        });
        // callback
        cb(list.length, atomCountExpected, userName);
      }
    }

  }

  return AllController;
};



/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class PublicFlowController extends app.Controller {

    async publicFlow() {
      // atomClass
      const atomClass = await this.ctx.meta.atomClass.get({ atomClassName: 'partyPublic' });
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');

      // user->atom
      await this._testCheckList(userIds, [
        [ 'Tom', 0 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // Tom add party
      const partyKey = await this.ctx.meta.atom.create({
        atomClass,
        user: { id: userIds.Tom },
      });
      await this.ctx.meta.atom.write({
        key: partyKey,
        item: { atomName: 'test:publicFlow' },
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 1 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // Tom enable(submit) party
      await this.ctx.meta.atom.enable({
        key: partyKey,
        atom: {
          atomEnabled: 1,
        },
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 1 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // checkRightRead 1
      let checkRightReads = [[ 'Jane', partyKey.atomId, false ]];
      for (const [ userName, atomId, right ] of checkRightReads) {
        const res = await this.ctx.meta.atom.checkRightRead({
          atom: { id: atomId },
          user: { id: userIds[userName] },
        });
        assert.equal(!!res, right, userName);
      }

      // close atomFlow
      await this.ctx.meta.atom.flow({
        key: partyKey,
        atom: {
          atomFlow: 0,
        },
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 1 ],
        [ 'Jane', 1 ],
        [ 'Jimmy', 1 ],
        [ 'Smith', 1 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // checkRightRead 2
      checkRightReads = [[ 'Jane', partyKey.atomId, true ]];
      for (const [ userName, atomId, right ] of checkRightReads) {
        const res = await this.ctx.meta.atom.checkRightRead({
          atom: { id: atomId },
          user: { id: userIds[userName] },
        });
        assert.equal(!!res, right, userName);
      }

      // Jane read party
      const party = await this.ctx.meta.atom.read({ key: partyKey, user: { id: userIds.Jane } });
      assert(party);

      // Tom delete party
      await this.ctx.meta.atom.delete({
        key: partyKey,
        user: { id: userIds.Tom },
      });

      await this._testCheckList(userIds, [
        [ 'Tom', 0 ],
        [ 'Jane', 0 ],
        [ 'Jimmy', 0 ],
        [ 'Smith', 0 ],
      ], (actual, expected, userName) => {
        assert.equal(actual, expected, userName);
      });

      // done
      this.ctx.success();
    }

    async _testCheckList(userIds, userAtoms, cb) {
      for (const [ userName, atomCountExpected ] of userAtoms) {
        const list = await this.ctx.meta.atom.select({
          options: {
            where: {
              atomName: 'test:publicFlow',
              'b.module': 'test-party',
            },
            orders: null,
            page: null,
          },
          user: { id: userIds[userName] },
        });
        // callback
        cb(list.length, atomCountExpected, userName);
      }
    }

  }

  return PublicFlowController;
};



/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = app => {

  class RightController extends app.Controller {

    async checkRightCreate() {
      // checked by route/middleware
      this.ctx.success(this.ctx.meta._atomClass);
    }

    async checkRightRead() {
      // checked by route/middleware
      this.ctx.success(this.ctx.meta._atom);
    }

    async checkRightWrite() {
      // checked by route/middleware
      this.ctx.success(this.ctx.meta._atom);
    }

    async checkRightAction() {
      // checked by route/middleware
      this.ctx.success(this.ctx.meta._atom);
    }

  }

  return RightController;
};



/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = app => {

  class RightController extends app.Controller {

    async checkRightFunctionUser() {
      // checked by route/middleware
      this.ctx.success(this.ctx.meta._function);
    }

  }

  return RightController;
};



/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

const functionCount = 3;

module.exports = app => {

  class AllController extends app.Controller {

    async all() {
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');
      const userTom = { id: userIds.Tom };

      // Tom list all
      let list = await this.ctx.meta.function.list({
        options: {
          where: { 'a.module': 'test-party' },
          orders: [[ 'id', 'asc' ]],
          page: { index: 0, size: 0 },
          locale: '',
        },
        user: userTom,
      });
      assert.equal(list.length, functionCount);
      assert(!list[0].titleLocale);

      // Tom menu list zh-cn
      list = await this.ctx.meta.function.list({
        options: {
          where: { 'a.module': 'test-party' },
          orders: [[ 'id', 'asc' ]],
          page: { index: 0, size: 0 },
          locale: 'zh-cn',
        },
        user: userTom,
      });
      assert.equal(list.length, functionCount);
      assert.equal(!!list[0].titleLocale, true);

      // hold first
      const function1 = list[0];

      // clear locales
      await this.ctx.meta.function.clearLocales();

      // select star
      list = await this.ctx.meta.function.list({
        user: userTom,
        options: {
          where: { 'a.module': 'test-party' },
          star: 1,
          page: { index: 0, size: 0 },
        },
      });
      assert.equal(list.length, 0);

      // star 1
      await this.ctx.meta.function.star({
        id: function1.id,
        star: 1,
        user: userTom,
      });
      list = await this.ctx.meta.function.list({
        user: userTom,
        options: {
          where: { 'a.module': 'test-party' },
          star: 1,
          page: { index: 0, size: 0 },
        },
      });
      assert.equal(list.length, 1);

      // star 0
      await this.ctx.meta.function.star({
        id: function1.id,
        star: 0,
        user: userTom,
      });
      list = await this.ctx.meta.function.list({
        user: userTom,
        options: {
          where: { 'a.module': 'test-party' },
          star: 1,
          page: { index: 0, size: 0 },
        },
      });
      assert.equal(list.length, 0);

      // check
      list = await this.ctx.meta.function.check({
        functions: [
          { module: function1.module, name: function1.name },
        ],
        user: userTom,
      });
      assert.equal(list[0].passed, true);

      // done
      this.ctx.success();
    }

  }

  return AllController;
};



/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class PublicController extends app.Controller {

    async functionPublic() {
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');
      const userTom = { id: userIds.Tom };

      // check right function
      const pass = await this.ctx.meta.function.checkRightFunction({
        function: {
          module: 'test-party',
          name: 'testFunctionPublic',
        },
        user: userTom,
      });
      assert.equal(!!pass, true);

      // Tom list all
      const list = await this.ctx.meta.function.list({
        options: {
          where: {
            'a.module': 'test-party',
            'a.public': 1,
          },
          orders: [[ 'id', 'asc' ]],
          page: { index: 0, size: 0 },
          locale: '',
        },
        user: userTom,
      });
      assert.equal(list.length, 1);

      // delete function
      await this.ctx.model.query('delete from aFunction where id=?', [ list[0].id ]);

      // done
      this.ctx.success();
    }

  }

  return PublicController;
};



/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = app => {

  class PerformActionController extends app.Controller {

    async performAction() {
      // param: id
      const id = this.ctx.request.body.id;
      // performAction
      const res = await this.ctx.performAction({
        method: 'post',
        url: 'test/ctx/performAction/echo',
        body: {
          id,
        },
      });
      this.ctx.success(res);
    }

    async echo() {
      // body: id
      const id = this.ctx.request.body.id;
      // echo back
      this.ctx.success(id);
    }

  }

  return PerformActionController;
};



/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = app => {

  class TransactionController extends app.Controller {

    async transaction() {
      // user
      const user = this.ctx.user.op;
      // atomKey
      const atomKey = this.ctx.request.body.key;
      // itemNew
      const itemNew = this.ctx.request.body.item;

      // write
      await this.ctx.meta.atom.write({
        key: atomKey,
        item: { atomName: itemNew.atomName },
        user,
      });
      // write: throw error when personCount is 0
      await this.ctx.meta.atom.write({
        key: atomKey,
        item: { personCount: itemNew.personCount },
        user,
      });
      // done
      this.ctx.success();
    }

  }

  return TransactionController;
};



/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class TailController extends app.Controller {

    async tail() {
      // 1
      this.ctx.meta._cache = 1;

      // tail
      this.ctx.tail(() => {
        assert.equal(this.ctx.meta._cache, 2);
      });

      // 2
      this.ctx.meta._cache = 2;

      // done
      this.ctx.success();
    }

  }

  return TailController;
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class SessionController extends app.Controller {

    async session() {
      // key1
      this.ctx.session._key1 = 1;
      // echo1
      const res = await this.ctx.performAction({
        method: 'post',
        url: 'test/ctx/session/echo1',
      });
      assert.equal(res.user.op.id, this.ctx.user.op.id);
      assert.equal(res.instance.id, this.ctx.instance.id);
      assert.equal(this.ctx.session._key2, 2);
      // done
      this.ctx.success();
    }

    async echo1() {
      // echo2
      const res = await this.ctx.performAction({
        method: 'post',
        url: 'test/ctx/session/echo2',
      });
      // echo back
      this.ctx.success(res);
    }

    async echo2() {
      // check
      assert.equal(this.ctx.session._key1, 1);
      // key2
      this.ctx.session._key2 = 2;
      // echo back
      this.ctx.success({
        user: this.ctx.user,
        instance: this.ctx.instance,
      });
    }

  }

  return SessionController;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class RequestController extends app.Controller {

    async request() {
      // param
      assert.equal(this.ctx.params.id, '1');
      assert.equal(this.ctx.getInt('id'), 1);

      // query
      assert.equal(this.ctx.query.age, '18');
      assert.equal(this.ctx.getInt('age'), 18);

      // body
      assert.equal(this.ctx.request.body.userName, 'zhennann');
      assert.equal(this.ctx.getStr('userName'), 'zhennann');

      // done
      this.ctx.success();
    }

  }

  return RequestController;
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = app => {

  class ResponseController extends app.Controller {

    async success() {
      const res = {
        userName: 'zhennann',
      };
      this.ctx.success(res);
    }

    async successMore() {
      const page = this.ctx.request.body.page;
      const items = [
        { userName: 'zhennann' },
        { userName: 'root' },
      ];
      this.ctx.successMore(items, page.index, page.size);
    }

    async fail() {
      // Error Test
      this.ctx.fail(1001);
    }

    async throwError() {
      this.ctx.throw(1001);
    }

  }

  return ResponseController;
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class ConfigController extends app.Controller {

    async test() {
      // current module
      let message = this.ctx.config.message;
      assert.equal(message, 'Hello World');

      // other module
      message = this.ctx.config.module('test-party').message;
      assert.equal(message, 'Hello World');

      // done
      this.ctx.success();
    }

  }

  return ConfigController;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class LocaleController extends app.Controller {

    async enus() {
      const message = this.ctx.config.message;
      const data = {
        enus: this.ctx.text(message),
        zhcn: this.ctx.text.locale('zh-cn', message),
      };

      // done
      this.ctx.success(data);
    }

    async zhcn() {
      const message = this.ctx.config.message;
      const data = {
        zhcn: this.ctx.text(message),
        enus: this.ctx.text.locale('en-us', message),
      };

      // done
      this.ctx.success(data);
    }

  }

  return LocaleController;
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class MemController extends app.Controller {

    async mem() {

      // name
      const name = '__test:name';

      // set
      this.ctx.cache.mem.set(name, 'zhennann');

      // has
      let res = this.ctx.cache.mem.has(name);
      assert.equal(!!res, true);

      // get
      let value = this.ctx.cache.mem.get(name);
      assert.equal(value, 'zhennann');

      // remove
      this.ctx.cache.mem.remove(name);
      res = this.ctx.cache.mem.has(name);
      assert.equal(res, null);

      // set with timeout
      this.ctx.cache.mem.set(name, 'zhennann', 1000);

      // get
      value = this.ctx.cache.mem.get(name);
      assert.equal(value, 'zhennann');

      // other module's cache
      const moduleCache = this.ctx.cache.mem.module(this.ctx.module.info.relativeName);
      value = moduleCache.get(name);
      assert.equal(value, 'zhennann');

      // get after timeout
      await sleep(1200);
      value = this.ctx.cache.mem.get(name);
      assert.equal(value, null);

      // clear
      //   not clear, hold other caches
      // this.ctx.cache.mem.clear();

      // done
      this.ctx.success();
    }

  }
  return MemController;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class DbController extends app.Controller {

    async db() {

      // name
      const name = '__test:name';

      // set
      await this.ctx.cache.db.set(name, 'zhennann');

      // has
      let res = await this.ctx.cache.db.has(name);
      assert.equal(!!res, true);

      // get
      let value = await this.ctx.cache.db.get(name);
      assert.equal(value, 'zhennann');

      // remove
      await this.ctx.cache.db.remove(name);
      res = await this.ctx.cache.db.has(name);
      assert.equal(res, null);

      // set with timeout
      await this.ctx.cache.db.set(name, 'zhennann', 1000);

      // get
      value = await this.ctx.cache.db.get(name);
      assert.equal(value, 'zhennann');

      // other module's cache
      const moduleCache = this.ctx.cache.db.module(this.ctx.module.info.relativeName);
      value = await moduleCache.get(name);
      assert.equal(value, 'zhennann');

      // get after timeout
      await sleep(1200);
      value = await this.ctx.cache.db.get(name);
      assert.equal(value, undefined);

      // clear
      //   not clear, hold other caches
      // await this.ctx.cache.db.clear();

      // done
      this.ctx.success();
    }

  }
  return DbController;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class UserRoleController extends app.Controller {

    async userRole() {
      // userIds
      const userIds = this.ctx.cache.mem.get('userIds');
      // roleIds
      const roleIds = this.ctx.cache.mem.get('roleIds');

      // direct
      let list = await this.ctx.meta.role.getUserRolesDirect({ userId: userIds.root });
      assert.equal(list.length, 1);
      // parent
      list = await this.ctx.meta.role.getUserRolesParent({ userId: userIds.root });
      assert.equal(list.length, 3);
      // expand
      list = await this.ctx.meta.role.getUserRolesExpand({ userId: userIds.root });
      assert(list.length > 3);

      // direct
      let res = await this.ctx.meta.role.userInRoleDirect({
        userId: userIds.root, roleId: roleIds.superuser,
      });
      assert.equal(res, true);
      // parent
      res = await this.ctx.meta.role.userInRoleParent({
        userId: userIds.root, roleId: roleIds.root,
      });
      assert.equal(res, true);
      // expand
      res = await this.ctx.meta.role.userInRoleExpand({
        userId: userIds.root, roleId: roleIds.system,
      });
      assert.equal(res, true);

      // done
      this.ctx.success();
    }

  }

  return UserRoleController;
};



/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);

  class HelloController extends app.Controller {

    async hello() {
      const data = {
        text: 'hello',
      };
      const res = await this.ctx.meta.event.invoke({
        module: moduleInfo.relativeName, name: 'hello', data,
      });
      assert.equal(data.text, 'hello echo');
      assert.equal(res, 'returnValue');
      this.ctx.success(res);
    }

    async helloEcho() {
      const event = this.ctx.request.body.event;
      const data = this.ctx.request.body.data;
      data.text = 'hello echo';
      event.break = true;
      this.ctx.success('returnValue');
    }

  }

  return HelloController;
};



/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class UserVerifyController extends app.Controller {

    async userVerify() {
      const data = this.ctx.request.body.data;
      // console.log('onUserVerify profileId: ', data.profileUser.profileId);
      assert(data.profileUser.profileId > 0);
      this.ctx.success();
    }

  }

  return UserVerifyController;
};



/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = app => {

  class HttpLogController extends app.Controller {

    async httpLog() {
      // please see: {projectDir}/src/backend/logs/{projectName}/{projectName}-web.log
      this.ctx.success('this is a test for httpLog');
    }

  }

  return HttpLogController;
};



/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class StartupController extends app.Controller {

    async all() {
      console.log('test/feat/startup: all');
      assert.equal(this.ctx.instance, undefined);
      this.ctx.success();
    }

    async instance() {
      console.log(`test/feat/startup: instance:${this.ctx.instance.id}`);
      assert(this.ctx.instance.id > 0);
      this.ctx.success();
    }

  }

  return StartupController;
};


/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = app => {

  class SendMailController extends app.Controller {

    async sendMail() {
      // send
      await this.ctx.meta.mail.send({
        scene: 'test',
        message: {
          to: 'test@cabloy.com',
          subject: 'this is a test',
          text: 'message body!',
        },
      });
      // done
      this.ctx.success();
    }

  }

  return SendMailController;

};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class HookController extends app.Controller {

    async echo() {
      const data = this.ctx.request.body.data;
      assert.equal(data.text, 'before');
      data.text = 'before:echo';
      this.ctx.success();
    }

    async echoBefore() {
      const ctxCaller = this.ctx.ctxCaller;
      ctxCaller.request.body.data = { text: 'before' };
      this.ctx.success();
    }
    async echoAfter() {
      const ctxCaller = this.ctx.ctxCaller;
      const data = ctxCaller.request.body.data;
      assert.equal(data.text, 'before:echo');
      this.ctx.success();
    }

  }

  return HookController;
};



/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class InstanceController extends app.Controller {

    async instance() {
      assert.equal(!!this.ctx.instance.id, true);
      assert.equal(!!this.ctx.instance.config, true);
      this.ctx.success();
    }

  }
  return InstanceController;
};


/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = app => {

  class ProgressController extends app.Controller {

    async progress() {
      // create progress
      const progressId = await this.ctx.meta.progress.create();
      // background
      this.ctx.performActionInBackground({
        method: 'post',
        url: 'test/feat/progressInBackground',
        body: {
          progressId,
        },
      });
      // return progressId
      this.ctx.success({ progressId });
    }

    async progressInBackground() {
      const progressId = this.ctx.request.body.progressId;
      try {
        // level one
        await this._levelOne({ progressId, progressNo: 0 });
        // progress done
        await this.ctx.meta.progress.done({ progressId, message: this.ctx.text('Well Done') });
        // ok
        this.ctx.success(true);
      } catch (err) {
        // progress error
        await this.ctx.meta.progress.error({ progressId, message: err.message });
        // throw err
        throw err;
      }
    }

    async _levelOne({ progressId, progressNo }) {
      const total = 2;
      let current = 0;
      for (let i = 0; i < total; i++) {
        const text = `${this.ctx.text('Level One')}: ${i + 1}`;
        await this.ctx.meta.progress.update({
          progressId,
          progressNo,
          total,
          progress: current++,
          text,
        });
        // sleep
        await this.ctx.meta.util.sleep(1500);
        // level two
        await this._levelTwo({ progressId, progressNo: progressNo + 1 });
      }
    }

    async _levelTwo({ progressId, progressNo }) {
      const total = 2;
      let current = 0;
      for (let i = 0; i < total; i++) {
        const text = `${this.ctx.text('Level Two')}: ${i + 1}`;
        await this.ctx.meta.progress.update({
          progressId,
          progressNo,
          total,
          progress: current++,
          text,
        });
        // sleep
        await this.ctx.meta.util.sleep(1500);
        // level two
        await this._levelThree({ progressId, progressNo: progressNo + 1 });
      }
    }

    async _levelThree({ progressId, progressNo }) {
      const total = 3;
      let current = 0;
      for (let i = 0; i < total; i++) {
        const text = `${this.ctx.text('Level Three')}: ${i + 1}`;
        await this.ctx.meta.progress.update({
          progressId,
          progressNo,
          total,
          progress: current++,
          text,
        });
        // sleep
        await this.ctx.meta.util.sleep(1500);
      }
    }

  }
  return ProgressController;
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');
const pMap = require3('p-map');

module.exports = app => {

  class SequenceController extends app.Controller {

    async sequence() {

      // current
      let current = await this.ctx.meta.sequence.current('test');
      assert.equal(current, 0);

      // next
      let next = await this.ctx.meta.sequence.next('test');
      assert.equal(next, 1);

      // current
      current = await this.ctx.meta.sequence.current('test');
      assert.equal(current, 1);

      // reset
      await this.ctx.meta.sequence.reset('test');

      // other module's sequence
      const moduleSequence = this.ctx.meta.sequence.module(this.ctx.module.info.relativeName);

      // next
      next = await moduleSequence.next('test');
      assert.equal(next, 1);

      // current
      current = await moduleSequence.current('test');
      assert.equal(current, 1);

      // reset
      await moduleSequence.reset('test');

      // concurrency
      const results = await pMap([ 1, 2, 3, 4, 5 ], async () => {
        return await moduleSequence.next('test');
      });
      assert.equal(results.join(','), '1,2,3,4,5');

      // reset
      await moduleSequence.reset('test');

      // done
      this.ctx.success();
    }

  }
  return SequenceController;
};



/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class SettingsController extends app.Controller {

    async settings() {

      // user

      // get settings from config
      let data = await this.ctx.meta.settings.getUser({ name: '/groupInfo/username' });
      assert.equal(data, 'zhennann');
      data = await this.ctx.meta.settings.getUser({ name: '/groupExtra/panelExtra/groupInfo/language' });
      assert.equal(data, 'en-us');

      // load settings
      data = await this.ctx.meta.settings.loadSettingsUser();
      assert.equal(data.groupInfo.username, 'zhennann');
      // save settings
      data.groupExtra.panelExtra.groupInfo.language = 'zh-cn';
      await this.ctx.meta.settings.saveSettingsUser({ data });

      // get settings from db
      data = await this.ctx.meta.settings.getUser({ name: '/groupExtra/panelExtra/groupInfo/language' });
      assert.equal(data, 'zh-cn');

      // instance

      // get settings from config
      data = await this.ctx.meta.settings.getInstance({ name: '/groupInfo/slogan' });
      assert.equal(data, '');

      // load settings
      data = await this.ctx.meta.settings.loadSettingsInstance();
      assert.equal(data.groupInfo.slogan, '');
      // save settings
      data.groupInfo.slogan = 'Less is more, while more is less';
      await this.ctx.meta.settings.saveSettingsInstance({ data });

      // get settings from db
      data = await this.ctx.meta.settings.getInstance({ name: '/groupInfo/slogan' });
      assert.equal(data, 'Less is more, while more is less');

      // ok
      this.ctx.success();
    }

  }
  return SettingsController;
};



/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {

  class StatusController extends app.Controller {

    async status() {

      // name
      const name = '__test_enable';

      // get
      let value = await this.ctx.meta.status.get(name);
      assert.equal(value, undefined);

      // set
      await this.ctx.meta.status.set(name, true);

      // get
      value = await this.ctx.meta.status.get(name);
      assert.equal(value, true);

      // other module's status
      const moduleStatus = this.ctx.meta.status.module(this.ctx.module.info.relativeName);
      value = await moduleStatus.get(name);
      assert.equal(value, true);

      // set
      await this.ctx.meta.status.set(name, false);

      // get
      value = await this.ctx.meta.status.get(name);
      assert.equal(value, false);

      // done
      this.ctx.success();
    }

  }
  return StatusController;
};



/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = app => {

  class ValidationController extends app.Controller {

    async success() {
      this.ctx.success();
    }

    async fail() {
      this.ctx.success();
    }

    async schema() {
      this.ctx.success();
    }

  }

  return ValidationController;
};



/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = app => {

  class TestController extends app.Controller {

    async interception() {
      const { a, b } = this.ctx.request.body;
      const c = parseInt(a) + parseInt(b);
      this.ctx.success(c);
    }

    async restructuring() {
      const { a, b } = this.ctx.request.body;
      const c = a + b;
      this.ctx.success(c);
    }

    async injection() {
      const { a, b } = this.ctx.request.body;
      const c = this.ctx.meta.__plus(a, b);
      this.ctx.success(c);
    }

  }

  return TestController;
};



/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

const languages = __webpack_require__(46);

module.exports = app => {

  class AutocompleteController extends app.Controller {

    async languages() {
      const query = this.ctx.params.query;
      let data;
      if (!query) {
        data = [];
      } else {
        data = languages.filter(item => {
          return item.name.toLowerCase().indexOf(query.toLowerCase()) === 0;
        });
      }
      this.ctx.success(data);
    }

  }

  return AutocompleteController;
};



/***/ }),
/* 46 */
/***/ (function(module) {

module.exports = [{"id":0,"name":"A# .NET"},{"id":1,"name":"A# (Axiom)"},{"id":2,"name":"A-0 System"},{"id":3,"name":"A+"},{"id":4,"name":"A++"},{"id":5,"name":"ABAP"},{"id":6,"name":"ABC"},{"id":7,"name":"ABC ALGOL"},{"id":8,"name":"ABLE"},{"id":9,"name":"ABSET"},{"id":10,"name":"ABSYS"},{"id":11,"name":"ACC"},{"id":12,"name":"Accent"},{"id":13,"name":"Ace DASL"},{"id":14,"name":"ACL2"},{"id":15,"name":"ACT-III"},{"id":16,"name":"Action!"},{"id":17,"name":"ActionScript"},{"id":18,"name":"Ada"},{"id":19,"name":"Adenine"},{"id":20,"name":"Agda"},{"id":21,"name":"Agilent VEE"},{"id":22,"name":"Agora"},{"id":23,"name":"AIMMS"},{"id":24,"name":"Alef"},{"id":25,"name":"ALF"},{"id":26,"name":"ALGOL 58"},{"id":27,"name":"ALGOL 60"},{"id":28,"name":"ALGOL 68"},{"id":29,"name":"ALGOL W"},{"id":30,"name":"Alice"},{"id":31,"name":"Alma-0"},{"id":32,"name":"AmbientTalk"},{"id":33,"name":"Amiga E"},{"id":34,"name":"AMOS"},{"id":35,"name":"AMPL"},{"id":36,"name":"Apex"},{"id":37,"name":"APL"},{"id":38,"name":"App Inventor for Android's visual block language"},{"id":39,"name":"AppleScript"},{"id":40,"name":"Arc"},{"id":41,"name":"ARexx"},{"id":42,"name":"Argus"},{"id":43,"name":"AspectJ"},{"id":44,"name":"Assembly language"},{"id":45,"name":"ATS"},{"id":46,"name":"Ateji PX"},{"id":47,"name":"AutoHotkey"},{"id":48,"name":"Autocoder"},{"id":49,"name":"AutoIt"},{"id":50,"name":"AutoLISP / Visual LISP"},{"id":51,"name":"Averest"},{"id":52,"name":"AWK"},{"id":53,"name":"Axum"},{"id":54,"name":"B"},{"id":55,"name":"Babbage"},{"id":56,"name":"Bash"},{"id":57,"name":"BASIC"},{"id":58,"name":"bc"},{"id":59,"name":"BCPL"},{"id":60,"name":"BeanShell"},{"id":61,"name":"Batch (Windows/Dos)"},{"id":62,"name":"Bertrand"},{"id":63,"name":"BETA"},{"id":64,"name":"Bigwig"},{"id":65,"name":"Bistro"},{"id":66,"name":"BitC"},{"id":67,"name":"BLISS"},{"id":68,"name":"Blue"},{"id":69,"name":"Boo"},{"id":70,"name":"Boomerang"},{"id":71,"name":"Bourne shell"},{"id":72,"name":"bash"},{"id":73,"name":"ksh"},{"id":74,"name":"BREW"},{"id":75,"name":"BPEL"},{"id":76,"name":"C"},{"id":77,"name":"C--"},{"id":78,"name":"C++"},{"id":79,"name":"C#"},{"id":80,"name":"C/AL"},{"id":81,"name":"Caché ObjectScript"},{"id":82,"name":"C Shell"},{"id":83,"name":"Caml"},{"id":84,"name":"Cayenne"},{"id":85,"name":"CDuce"},{"id":86,"name":"Cecil"},{"id":87,"name":"Cel"},{"id":88,"name":"Cesil"},{"id":89,"name":"Ceylon"},{"id":90,"name":"CFEngine"},{"id":91,"name":"CFML"},{"id":92,"name":"Cg"},{"id":93,"name":"Ch"},{"id":94,"name":"Chapel"},{"id":95,"name":"CHAIN"},{"id":96,"name":"Charity"},{"id":97,"name":"Charm"},{"id":98,"name":"Chef"},{"id":99,"name":"CHILL"},{"id":100,"name":"CHIP-8"},{"id":101,"name":"chomski"},{"id":102,"name":"ChucK"},{"id":103,"name":"CICS"},{"id":104,"name":"Cilk"},{"id":105,"name":"CL"},{"id":106,"name":"Claire"},{"id":107,"name":"Clarion"},{"id":108,"name":"Clean"},{"id":109,"name":"Clipper"},{"id":110,"name":"CLIST"},{"id":111,"name":"Clojure"},{"id":112,"name":"CLU"},{"id":113,"name":"CMS-2"},{"id":114,"name":"COBOL"},{"id":115,"name":"Cobra"},{"id":116,"name":"CODE"},{"id":117,"name":"CoffeeScript"},{"id":118,"name":"Cola"},{"id":119,"name":"ColdC"},{"id":120,"name":"ColdFusion"},{"id":121,"name":"COMAL"},{"id":122,"name":"Combined Programming Language"},{"id":123,"name":"COMIT"},{"id":124,"name":"Common Intermediate Language"},{"id":125,"name":"Common Lisp"},{"id":126,"name":"COMPASS"},{"id":127,"name":"Component Pascal"},{"id":128,"name":"Constraint Handling Rules"},{"id":129,"name":"Converge"},{"id":130,"name":"Cool"},{"id":131,"name":"Coq"},{"id":132,"name":"Coral 66"},{"id":133,"name":"Corn"},{"id":134,"name":"CorVision"},{"id":135,"name":"COWSEL"},{"id":136,"name":"CPL"},{"id":137,"name":"csh"},{"id":138,"name":"CSP"},{"id":139,"name":"Cryptol"},{"id":140,"name":"Csound"},{"id":141,"name":"CUDA"},{"id":142,"name":"Curl"},{"id":143,"name":"Curry"},{"id":144,"name":"Cyclone"},{"id":145,"name":"Cython"},{"id":146,"name":"D"},{"id":147,"name":"DASL"},{"id":148,"name":"DASL"},{"id":149,"name":"Dart"},{"id":150,"name":"DataFlex"},{"id":151,"name":"Datalog"},{"id":152,"name":"DATATRIEVE"},{"id":153,"name":"dBase"},{"id":154,"name":"dc"},{"id":155,"name":"DCL"},{"id":156,"name":"Deesel"},{"id":157,"name":"Delphi"},{"id":158,"name":"DinkC"},{"id":159,"name":"DIBOL"},{"id":160,"name":"Dog"},{"id":161,"name":"Draco"},{"id":162,"name":"DRAKON"},{"id":163,"name":"Dylan"},{"id":164,"name":"DYNAMO"},{"id":165,"name":"E"},{"id":166,"name":"E#"},{"id":167,"name":"Ease"},{"id":168,"name":"Easy PL/I"},{"id":169,"name":"Easy Programming Language"},{"id":170,"name":"EASYTRIEVE PLUS"},{"id":171,"name":"ECMAScript"},{"id":172,"name":"Edinburgh IMP"},{"id":173,"name":"EGL"},{"id":174,"name":"Eiffel"},{"id":175,"name":"ELAN"},{"id":176,"name":"Elixir"},{"id":177,"name":"Elm"},{"id":178,"name":"Emacs Lisp"},{"id":179,"name":"Emerald"},{"id":180,"name":"Epigram"},{"id":181,"name":"EPL"},{"id":182,"name":"Erlang"},{"id":183,"name":"es"},{"id":184,"name":"Escher"},{"id":185,"name":"ESPOL"},{"id":186,"name":"Esterel"},{"id":187,"name":"Etoys"},{"id":188,"name":"Euclid"},{"id":189,"name":"Euler"},{"id":190,"name":"Euphoria"},{"id":191,"name":"EusLisp Robot Programming Language"},{"id":192,"name":"CMS EXEC"},{"id":193,"name":"EXEC 2"},{"id":194,"name":"Executable UML"},{"id":195,"name":"F"},{"id":196,"name":"F#"},{"id":197,"name":"Factor"},{"id":198,"name":"Falcon"},{"id":199,"name":"Fantom"},{"id":200,"name":"FAUST"},{"id":201,"name":"FFP"},{"id":202,"name":"Fjölnir"},{"id":203,"name":"FL"},{"id":204,"name":"Flavors"},{"id":205,"name":"Flex"},{"id":206,"name":"FLOW-MATIC"},{"id":207,"name":"FOCAL"},{"id":208,"name":"FOCUS"},{"id":209,"name":"FOIL"},{"id":210,"name":"FORMAC"},{"id":211,"name":"@Formula"},{"id":212,"name":"Forth"},{"id":213,"name":"Fortran"},{"id":214,"name":"Fortress"},{"id":215,"name":"FoxBase"},{"id":216,"name":"FoxPro"},{"id":217,"name":"FP"},{"id":218,"name":"FPr"},{"id":219,"name":"Franz Lisp"},{"id":220,"name":"Frege"},{"id":221,"name":"F-Script"},{"id":222,"name":"G"},{"id":223,"name":"Google Apps Script"},{"id":224,"name":"Game Maker Language"},{"id":225,"name":"GameMonkey Script"},{"id":226,"name":"GAMS"},{"id":227,"name":"GAP"},{"id":228,"name":"G-code"},{"id":229,"name":"Genie"},{"id":230,"name":"GDL"},{"id":231,"name":"GJ"},{"id":232,"name":"GEORGE"},{"id":233,"name":"GLSL"},{"id":234,"name":"GNU E"},{"id":235,"name":"GM"},{"id":236,"name":"Go"},{"id":237,"name":"Go!"},{"id":238,"name":"GOAL"},{"id":239,"name":"Gödel"},{"id":240,"name":"Godiva"},{"id":241,"name":"GOM (Good Old Mad)"},{"id":242,"name":"Goo"},{"id":243,"name":"Gosu"},{"id":244,"name":"GOTRAN"},{"id":245,"name":"GPSS"},{"id":246,"name":"GraphTalk"},{"id":247,"name":"GRASS"},{"id":248,"name":"Groovy"},{"id":249,"name":"Hack"},{"id":250,"name":"HAL/S"},{"id":251,"name":"Hamilton C shell"},{"id":252,"name":"Harbour"},{"id":253,"name":"Hartmann pipelines"},{"id":254,"name":"Haskell"},{"id":255,"name":"Haxe"},{"id":256,"name":"High Level Assembly"},{"id":257,"name":"HLSL"},{"id":258,"name":"Hop"},{"id":259,"name":"Hope"},{"id":260,"name":"Hugo"},{"id":261,"name":"Hume"},{"id":262,"name":"HyperTalk"},{"id":263,"name":"IBM Basic assembly language"},{"id":264,"name":"IBM HAScript"},{"id":265,"name":"IBM Informix-4GL"},{"id":266,"name":"IBM RPG"},{"id":267,"name":"ICI"},{"id":268,"name":"Icon"},{"id":269,"name":"Id"},{"id":270,"name":"IDL"},{"id":271,"name":"Idris"},{"id":272,"name":"IMP"},{"id":273,"name":"Inform"},{"id":274,"name":"Io"},{"id":275,"name":"Ioke"},{"id":276,"name":"IPL"},{"id":277,"name":"IPTSCRAE"},{"id":278,"name":"ISLISP"},{"id":279,"name":"ISPF"},{"id":280,"name":"ISWIM"},{"id":281,"name":"J"},{"id":282,"name":"J#"},{"id":283,"name":"J++"},{"id":284,"name":"JADE"},{"id":285,"name":"Jako"},{"id":286,"name":"JAL"},{"id":287,"name":"Janus"},{"id":288,"name":"JASS"},{"id":289,"name":"Java"},{"id":290,"name":"JavaScript"},{"id":291,"name":"JCL"},{"id":292,"name":"JEAN"},{"id":293,"name":"Join Java"},{"id":294,"name":"JOSS"},{"id":295,"name":"Joule"},{"id":296,"name":"JOVIAL"},{"id":297,"name":"Joy"},{"id":298,"name":"JScript"},{"id":299,"name":"JScript .NET"},{"id":300,"name":"JavaFX Script"},{"id":301,"name":"Julia"},{"id":302,"name":"Jython"},{"id":303,"name":"K"},{"id":304,"name":"Kaleidoscope"},{"id":305,"name":"Karel"},{"id":306,"name":"Karel++"},{"id":307,"name":"KEE"},{"id":308,"name":"Kixtart"},{"id":309,"name":"Klerer-May System"},{"id":310,"name":"KIF"},{"id":311,"name":"Kojo"},{"id":312,"name":"Kotlin"},{"id":313,"name":"KRC"},{"id":314,"name":"KRL"},{"id":315,"name":"KUKA"},{"id":316,"name":"KRYPTON"},{"id":317,"name":"ksh"},{"id":318,"name":"L"},{"id":319,"name":"L# .NET"},{"id":320,"name":"LabVIEW"},{"id":321,"name":"Ladder"},{"id":322,"name":"Lagoona"},{"id":323,"name":"LANSA"},{"id":324,"name":"Lasso"},{"id":325,"name":"LaTeX"},{"id":326,"name":"Lava"},{"id":327,"name":"LC-3"},{"id":328,"name":"Leda"},{"id":329,"name":"Legoscript"},{"id":330,"name":"LIL"},{"id":331,"name":"LilyPond"},{"id":332,"name":"Limbo"},{"id":333,"name":"Limnor"},{"id":334,"name":"LINC"},{"id":335,"name":"Lingo"},{"id":336,"name":"Linoleum"},{"id":337,"name":"LIS"},{"id":338,"name":"LISA"},{"id":339,"name":"Lisaac"},{"id":340,"name":"Lisp"},{"id":341,"name":"Lite-C"},{"id":342,"name":"Lithe"},{"id":343,"name":"Little b"},{"id":344,"name":"Logo"},{"id":345,"name":"Logtalk"},{"id":346,"name":"LotusScript"},{"id":347,"name":"LPC"},{"id":348,"name":"LSE"},{"id":349,"name":"LSL"},{"id":350,"name":"LiveCode"},{"id":351,"name":"LiveScript"},{"id":352,"name":"Lua"},{"id":353,"name":"Lucid"},{"id":354,"name":"Lustre"},{"id":355,"name":"LYaPAS"},{"id":356,"name":"Lynx"},{"id":357,"name":"M2001"},{"id":358,"name":"M4"},{"id":359,"name":"M#"},{"id":360,"name":"Machine code"},{"id":361,"name":"MAD"},{"id":362,"name":"MAD/I"},{"id":363,"name":"Magik"},{"id":364,"name":"Magma"},{"id":365,"name":"make"},{"id":366,"name":"Maple"},{"id":367,"name":"MAPPER"},{"id":368,"name":"MARK-IV"},{"id":369,"name":"Mary"},{"id":370,"name":"MASM Microsoft Assembly x86"},{"id":371,"name":"Mathematica"},{"id":372,"name":"MATLAB"},{"id":373,"name":"Maxima"},{"id":374,"name":"Macsyma"},{"id":375,"name":"Max"},{"id":376,"name":"MaxScript"},{"id":377,"name":"Maya (MEL)"},{"id":378,"name":"MDL"},{"id":379,"name":"Mercury"},{"id":380,"name":"Mesa"},{"id":381,"name":"Metacard"},{"id":382,"name":"Metafont"},{"id":383,"name":"Microcode"},{"id":384,"name":"MicroScript"},{"id":385,"name":"MIIS"},{"id":386,"name":"MillScript"},{"id":387,"name":"MIMIC"},{"id":388,"name":"Mirah"},{"id":389,"name":"Miranda"},{"id":390,"name":"MIVA Script"},{"id":391,"name":"ML"},{"id":392,"name":"Moby"},{"id":393,"name":"Model 204"},{"id":394,"name":"Modelica"},{"id":395,"name":"Modula"},{"id":396,"name":"Modula-2"},{"id":397,"name":"Modula-3"},{"id":398,"name":"Mohol"},{"id":399,"name":"MOO"},{"id":400,"name":"Mortran"},{"id":401,"name":"Mouse"},{"id":402,"name":"MPD"},{"id":403,"name":"CIL"},{"id":404,"name":"MSL"},{"id":405,"name":"MUMPS"},{"id":406,"name":"Mystic Programming Language"},{"id":407,"name":"NASM"},{"id":408,"name":"NATURAL"},{"id":409,"name":"Napier88"},{"id":410,"name":"Neko"},{"id":411,"name":"Nemerle"},{"id":412,"name":"nesC"},{"id":413,"name":"NESL"},{"id":414,"name":"Net.Data"},{"id":415,"name":"NetLogo"},{"id":416,"name":"NetRexx"},{"id":417,"name":"NewLISP"},{"id":418,"name":"NEWP"},{"id":419,"name":"Newspeak"},{"id":420,"name":"NewtonScript"},{"id":421,"name":"NGL"},{"id":422,"name":"Nial"},{"id":423,"name":"Nice"},{"id":424,"name":"Nickle"},{"id":425,"name":"Nim"},{"id":426,"name":"NPL"},{"id":427,"name":"Not eXactly C"},{"id":428,"name":"Not Quite C"},{"id":429,"name":"NSIS"},{"id":430,"name":"Nu"},{"id":431,"name":"NWScript"},{"id":432,"name":"NXT-G"},{"id":433,"name":"o:XML"},{"id":434,"name":"Oak"},{"id":435,"name":"Oberon"},{"id":436,"name":"OBJ2"},{"id":437,"name":"Object Lisp"},{"id":438,"name":"ObjectLOGO"},{"id":439,"name":"Object REXX"},{"id":440,"name":"Object Pascal"},{"id":441,"name":"Objective-C"},{"id":442,"name":"Objective-J"},{"id":443,"name":"Obliq"},{"id":444,"name":"OCaml"},{"id":445,"name":"occam"},{"id":446,"name":"occam-π"},{"id":447,"name":"Octave"},{"id":448,"name":"OmniMark"},{"id":449,"name":"Onyx"},{"id":450,"name":"Opa"},{"id":451,"name":"Opal"},{"id":452,"name":"OpenCL"},{"id":453,"name":"OpenEdge ABL"},{"id":454,"name":"OPL"},{"id":455,"name":"OPS5"},{"id":456,"name":"OptimJ"},{"id":457,"name":"Orc"},{"id":458,"name":"ORCA/Modula-2"},{"id":459,"name":"Oriel"},{"id":460,"name":"Orwell"},{"id":461,"name":"Oxygene"},{"id":462,"name":"Oz"},{"id":463,"name":"P′′"},{"id":464,"name":"P#"},{"id":465,"name":"ParaSail (programming language)"},{"id":466,"name":"PARI/GP"},{"id":467,"name":"Pascal"},{"id":468,"name":"PCASTL"},{"id":469,"name":"PCF"},{"id":470,"name":"PEARL"},{"id":471,"name":"PeopleCode"},{"id":472,"name":"Perl"},{"id":473,"name":"PDL"},{"id":474,"name":"Perl6"},{"id":475,"name":"PHP"},{"id":476,"name":"Phrogram"},{"id":477,"name":"Pico"},{"id":478,"name":"Picolisp"},{"id":479,"name":"Pict"},{"id":480,"name":"Pike"},{"id":481,"name":"PIKT"},{"id":482,"name":"PILOT"},{"id":483,"name":"Pipelines"},{"id":484,"name":"Pizza"},{"id":485,"name":"PL-11"},{"id":486,"name":"PL/0"},{"id":487,"name":"PL/B"},{"id":488,"name":"PL/C"},{"id":489,"name":"PL/I"},{"id":490,"name":"PL/M"},{"id":491,"name":"PL/P"},{"id":492,"name":"PL/SQL"},{"id":493,"name":"PL360"},{"id":494,"name":"PLANC"},{"id":495,"name":"Plankalkül"},{"id":496,"name":"Planner"},{"id":497,"name":"PLEX"},{"id":498,"name":"PLEXIL"},{"id":499,"name":"Plus"},{"id":500,"name":"POP-11"},{"id":501,"name":"PostScript"},{"id":502,"name":"PortablE"},{"id":503,"name":"Powerhouse"},{"id":504,"name":"PowerBuilder"},{"id":505,"name":"PowerShell"},{"id":506,"name":"PPL"},{"id":507,"name":"Processing"},{"id":508,"name":"Processing.js"},{"id":509,"name":"Prograph"},{"id":510,"name":"PROIV"},{"id":511,"name":"Prolog"},{"id":512,"name":"PROMAL"},{"id":513,"name":"Promela"},{"id":514,"name":"PROSE modeling language"},{"id":515,"name":"PROTEL"},{"id":516,"name":"ProvideX"},{"id":517,"name":"Pro*C"},{"id":518,"name":"Pure"},{"id":519,"name":"Python"},{"id":520,"name":"Q (equational programming language)"},{"id":521,"name":"Q (programming language from Kx Systems)"},{"id":522,"name":"Qalb"},{"id":523,"name":"QtScript"},{"id":524,"name":"QuakeC"},{"id":525,"name":"QPL"},{"id":526,"name":"R"},{"id":527,"name":"R++"},{"id":528,"name":"Racket"},{"id":529,"name":"RAPID"},{"id":530,"name":"Rapira"},{"id":531,"name":"Ratfiv"},{"id":532,"name":"Ratfor"},{"id":533,"name":"rc"},{"id":534,"name":"REBOL"},{"id":535,"name":"Red"},{"id":536,"name":"Redcode"},{"id":537,"name":"REFAL"},{"id":538,"name":"Reia"},{"id":539,"name":"Revolution"},{"id":540,"name":"rex"},{"id":541,"name":"REXX"},{"id":542,"name":"Rlab"},{"id":543,"name":"ROOP"},{"id":544,"name":"RPG"},{"id":545,"name":"RPL"},{"id":546,"name":"RSL"},{"id":547,"name":"RTL/2"},{"id":548,"name":"Ruby"},{"id":549,"name":"RuneScript"},{"id":550,"name":"Rust"},{"id":551,"name":"S"},{"id":552,"name":"S2"},{"id":553,"name":"S3"},{"id":554,"name":"S-Lang"},{"id":555,"name":"S-PLUS"},{"id":556,"name":"SA-C"},{"id":557,"name":"SabreTalk"},{"id":558,"name":"SAIL"},{"id":559,"name":"SALSA"},{"id":560,"name":"SAM76"},{"id":561,"name":"SAS"},{"id":562,"name":"SASL"},{"id":563,"name":"Sather"},{"id":564,"name":"Sawzall"},{"id":565,"name":"SBL"},{"id":566,"name":"Scala"},{"id":567,"name":"Scheme"},{"id":568,"name":"Scilab"},{"id":569,"name":"Scratch"},{"id":570,"name":"Script.NET"},{"id":571,"name":"Sed"},{"id":572,"name":"Seed7"},{"id":573,"name":"Self"},{"id":574,"name":"SenseTalk"},{"id":575,"name":"SequenceL"},{"id":576,"name":"SETL"},{"id":577,"name":"SIMPOL"},{"id":578,"name":"SIGNAL"},{"id":579,"name":"SiMPLE"},{"id":580,"name":"SIMSCRIPT"},{"id":581,"name":"Simula"},{"id":582,"name":"Simulink"},{"id":583,"name":"SISAL"},{"id":584,"name":"SLIP"},{"id":585,"name":"SMALL"},{"id":586,"name":"Smalltalk"},{"id":587,"name":"Small Basic"},{"id":588,"name":"SML"},{"id":589,"name":"Snap!"},{"id":590,"name":"SNOBOL"},{"id":591,"name":"SPITBOL"},{"id":592,"name":"Snowball"},{"id":593,"name":"SOL"},{"id":594,"name":"Span"},{"id":595,"name":"SPARK"},{"id":596,"name":"Speedcode"},{"id":597,"name":"SPIN"},{"id":598,"name":"SP/k"},{"id":599,"name":"SPS"},{"id":600,"name":"SQR"},{"id":601,"name":"Squeak"},{"id":602,"name":"Squirrel"},{"id":603,"name":"SR"},{"id":604,"name":"S/SL"},{"id":605,"name":"Stackless Python"},{"id":606,"name":"Starlogo"},{"id":607,"name":"Strand"},{"id":608,"name":"Stata"},{"id":609,"name":"Stateflow"},{"id":610,"name":"Subtext"},{"id":611,"name":"SuperCollider"},{"id":612,"name":"SuperTalk"},{"id":613,"name":"Swift (Apple programming language)"},{"id":614,"name":"Swift (parallel scripting language)"},{"id":615,"name":"SYMPL"},{"id":616,"name":"SyncCharts"},{"id":617,"name":"SystemVerilog"},{"id":618,"name":"T"},{"id":619,"name":"TACL"},{"id":620,"name":"TACPOL"},{"id":621,"name":"TADS"},{"id":622,"name":"TAL"},{"id":623,"name":"Tcl"},{"id":624,"name":"Tea"},{"id":625,"name":"TECO"},{"id":626,"name":"TELCOMP"},{"id":627,"name":"TeX"},{"id":628,"name":"TEX"},{"id":629,"name":"TIE"},{"id":630,"name":"Timber"},{"id":631,"name":"TMG"},{"id":632,"name":"Tom"},{"id":633,"name":"TOM"},{"id":634,"name":"TouchDevelop"},{"id":635,"name":"Topspeed"},{"id":636,"name":"TPU"},{"id":637,"name":"Trac"},{"id":638,"name":"TTM"},{"id":639,"name":"T-SQL"},{"id":640,"name":"TTCN"},{"id":641,"name":"Turing"},{"id":642,"name":"TUTOR"},{"id":643,"name":"TXL"},{"id":644,"name":"TypeScript"},{"id":645,"name":"Turbo C++"},{"id":646,"name":"Ubercode"},{"id":647,"name":"UCSD Pascal"},{"id":648,"name":"Umple"},{"id":649,"name":"Unicon"},{"id":650,"name":"Uniface"},{"id":651,"name":"UNITY"},{"id":652,"name":"Unix shell"},{"id":653,"name":"UnrealScript"},{"id":654,"name":"Vala"},{"id":655,"name":"VBA"},{"id":656,"name":"VBScript"},{"id":657,"name":"Verilog"},{"id":658,"name":"VHDL"},{"id":659,"name":"Visual Basic"},{"id":660,"name":"Visual Basic .NET"},{"id":661,"name":"Visual DataFlex"},{"id":662,"name":"Visual DialogScript"},{"id":663,"name":"Visual Fortran"},{"id":664,"name":"Visual FoxPro"},{"id":665,"name":"Visual J++"},{"id":666,"name":"Visual J#"},{"id":667,"name":"Visual Objects"},{"id":668,"name":"Visual Prolog"},{"id":669,"name":"VSXu"},{"id":670,"name":"vvvv"},{"id":671,"name":"WATFIV, WATFOR"},{"id":672,"name":"WebDNA"},{"id":673,"name":"WebQL"},{"id":674,"name":"Windows PowerShell"},{"id":675,"name":"Winbatch"},{"id":676,"name":"Wolfram Language"},{"id":677,"name":"Wyvern"},{"id":678,"name":"X++"},{"id":679,"name":"X#"},{"id":680,"name":"X10"},{"id":681,"name":"XBL"},{"id":682,"name":"XC"},{"id":683,"name":"XMOS architecture"},{"id":684,"name":"xHarbour"},{"id":685,"name":"XL"},{"id":686,"name":"Xojo"},{"id":687,"name":"XOTcl"},{"id":688,"name":"XPL"},{"id":689,"name":"XPL0"},{"id":690,"name":"XQuery"},{"id":691,"name":"XSB"},{"id":692,"name":"XSLT"},{"id":693,"name":"XPath"},{"id":694,"name":"Xtend"},{"id":695,"name":"Yorick"},{"id":696,"name":"YQL"},{"id":697,"name":"Z notation"},{"id":698,"name":"Zeno"},{"id":699,"name":"ZOPL"},{"id":700,"name":"ZPL"}];

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = app => {

  class GuideController extends app.Controller {

    async echo() {
      const message = 'Hello World';
      this.ctx.success(message);
    }

    async echo2() {
      const message = this.ctx.config.message;
      this.ctx.success(message);
    }

    async echo3() {
      const message = this.ctx.text('Hello World');
      this.ctx.success(message);
    }

    async echo4() {
      const { message, markCount } = this.ctx.request.body;
      const res = `${message}${new Array(markCount + 1).join('!')}`;
      this.ctx.success(res);
    }

  }

  return GuideController;
};



/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = app => {

  class FormSchemaValidationController extends app.Controller {

    async load() {
      // try load from db cache
      const cacheName = this._getCacheName();
      let item = await this.ctx.cache.db.get(cacheName);
      if (!item) {
        item = {
          userName: '',
          password: '',
          passwordAgain: '',
          sex: 0,
          language: '',
          avatar: '',
          rememberMe: false,
        };
      }
      // ok
      this.ctx.success(item);
    }

    async saveSimple() {
      // item
      const item = this.ctx.request.body.data;
      // save to db cache
      const cacheName = this._getCacheName();
      await this.ctx.cache.db.set(cacheName, item);
      // ok
      this.ctx.success();
    }

    async saveValidation() {
      await this.saveSimple();
    }

    _getCacheName() {
      // get the operation user
      const user = this.ctx.user.op;
      return `__formTest:${user.id}`;
    }

  }

  return FormSchemaValidationController;
};



/***/ }),
/* 49 */
/***/ (function(module, exports) {


const gTestListMax = 89;

module.exports = app => {

  class PtrIsLoadMoreController extends app.Controller {

    async list() {
      // page
      let page = this.ctx.request.body.page;
      // adjust page
      page = this.ctx.meta.util.page(page, false);
      // items
      const items = [];
      for (let i = 0; i < page.size; i++) {
        const itemId = page.index + i + 1;
        if (itemId > gTestListMax) break;
        items.push({
          id: itemId,
          title: `${this.ctx.text('Item')} - ${itemId}`,
        });
      }
      // ok
      this.ctx.successMore(items, page.index, page.size);
    }

  }

  return PtrIsLoadMoreController;
};



/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(51);
const party = __webpack_require__(54);
const partyPublic = __webpack_require__(55);

module.exports = app => {
  const services = {
    version,
  };
  if (app.meta.isTest || app.meta.isLocal) {
    Object.assign(services, {
      party,
      partyPublic,
    });
  }
  return services;
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

const VersionTestFn = __webpack_require__(52);

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      // only in test/local
      if (!this.app.meta.isTest && !this.app.meta.isLocal) return;

      // update
      if (options.version === 1) {
        let sql = `
          CREATE TABLE testParty (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            personCount int(11) DEFAULT '0',
            partyTypeId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        sql = `
          CREATE TABLE testPartyType (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            name varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        sql = `
          CREATE VIEW testPartyView as
            select a.*,b.name as partyTypeName from testParty a
              left join testPartyType b on a.partyTypeId=b.id
        `;
        await this.ctx.model.query(sql);

        sql = `
          CREATE TABLE testPartyPublic (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      // only in test/local
      if (!this.app.meta.isTest && !this.app.meta.isLocal) return;

      // init
      if (options.version === 1) {
        // types
        for (const name of [ 'Birthday', 'Dance', 'Garden' ]) {
          await this.ctx.model.partyType.insert({ name });
        }
      }

      //
      if (options.version === 2) {
        // // roleFunctions
        // const roleRoot = await this.ctx.meta.role.getSystemRole({ roleName: 'root' });
        // const functions = [ 'kichenSink' ];
        // for (const functionName of functions) {
        //   const func = await this.ctx.meta.function.get({
        //     name: functionName,
        //   });
        //   await this.ctx.meta.role.addRoleFunction({
        //     roleId: roleRoot.id,
        //     functionId: func.id,
        //   });
        // }
      }

      //
      if (options.version === 3) {
        // delete old function
        await this.ctx.meta.function.delete({ name: 'kichenSink' });

        // roleFunctions
        const roleFunctions = [
          { roleName: 'root', name: 'kitchenSink' },
        ];
        await this.ctx.meta.role.addRoleFunctionBatch({ roleFunctions });
      }

      //
      if (options.version === 4) {
        // add role rights
        const roleRights = [
          { roleName: 'system', action: 'create' },
          { roleName: 'system', action: 'write', scopeNames: 0 },
          { roleName: 'system', action: 'delete', scopeNames: 0 },
          { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'review', scopeNames: 'authenticated' },
        ];
        await this.ctx.meta.role.addRoleRightBatch({ atomClassName: 'party', roleRights });
      }

    }

    async test() {
      const versionTest = new (VersionTestFn(this.ctx))();
      await versionTest.run();
    }

  }

  return Version;
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

const testData = __webpack_require__(53);

module.exports = function(ctx) {

  class VersionTest {

    async run() {

      // roles
      const roleIds = await this._testRoles();

      // role includes
      await this._testRoleIncs(roleIds);

      // set role dirty
      await ctx.meta.role.setDirty(true);

      // users
      const userIds = await this._testUsers(roleIds);

      // role rights
      await this._testRoleRights(roleIds);

      // cache
      this._testCache(roleIds, userIds);
    }

    _testCache(roleIds, userIds) {
      // cache roles
      ctx.cache.mem.set('roleIds', roleIds);
      // cache users
      ctx.cache.mem.set('userIds', userIds);
    }

    // roles
    async _testRoles() {
      const roleIds = {};
      // system roles
      for (const roleName of ctx.constant.module('a-base').systemRoles) {
        const role = await ctx.meta.role.getSystemRole({ roleName });
        roleIds[roleName] = role.id;
      }
      // roles
      for (const [ roleName, leader, catalog, roleNameParent ] of testData.roles) {
        roleIds[roleName] = await ctx.meta.role.add({
          roleName,
          leader,
          catalog,
          roleIdParent: roleIds[roleNameParent],
        });
      }

      return roleIds;
    }

    // role incs
    async _testRoleIncs(roleIds) {
      for (const [ roleId, roleIdInc ] of testData.roleIncs) {
        await ctx.meta.role.addRoleInc({
          roleId: roleIds[roleId],
          roleIdInc: roleIds[roleIdInc],
        });
      }
    }

    // users
    async _testUsers(roleIds) {
      // userIds
      const userIds = {};
      for (const [ userName, roleName ] of testData.users) {
        // add
        userIds[userName] = await ctx.meta.user.add({
          userName,
          realName: userName,
        });
        // activated
        await ctx.meta.user.save({
          user: { id: userIds[userName], activated: 1 },
        });
        // role
        await ctx.meta.role.addUserRole({
          userId: userIds[userName],
          roleId: roleIds[roleName],
        });
      }

      // auths
      await this._testAuths(userIds);

      // root
      const userRoot = await ctx.meta.user.get({ userName: 'root' });
      userIds.root = userRoot.id;
      return userIds;
    }

    // role rights
    async _testRoleRights() {
      await ctx.meta.role.addRoleRightBatch({ atomClassName: 'party', roleRights: testData.roleRights });
    }

    // auths
    async _testAuths(userIds) {
      for (const userName in userIds) {
        await ctx.performAction({
          method: 'post',
          url: '/a/authsimple/auth/add',
          body: {
            userId: userIds[userName],
            password: '',
          },
        });
      }
    }

  }

  return VersionTest;
};


/***/ }),
/* 53 */
/***/ (function(module, exports) {

// roleName, leader, catalog, roleNameParent
const roles = [
  [ 'friend', 0, 0, 'external' ],
  [ 'consultant', 0, 1, 'external' ],
  [ 'study', 0, 0, 'consultant' ],
  [ 'work', 0, 0, 'consultant' ],
  [ 'life', 0, 0, 'consultant' ],
  [ 'family', 0, 1, 'internal' ],
  [ 'father', 0, 0, 'family' ],
  [ 'mother', 1, 0, 'family' ],
  [ 'son', 0, 0, 'family' ],
  [ 'daughter', 0, 0, 'family' ],
];

// friend->family
const roleIncs = [
  [ 'friend', 'family' ],
];

// family and friend
//   userName, roleName
const users = [
  [ 'Tom', 'father' ], [ 'Jane', 'mother' ], [ 'Tomson', 'son' ], [ 'Jannie', 'daughter' ],
  [ 'Jimmy', 'friend' ], [ 'Rose', 'friend' ],
  [ 'Smith', 'life' ],
];

// roleRights
const roleRights = [
  { roleName: 'family', action: 'create' },
  { roleName: 'family', action: 'read', scopeNames: 'family' },
  { roleName: 'mother', action: 'review', scopeNames: 'family' },
  { roleName: 'authenticated', action: 'write', scopeNames: 0 },
  { roleName: 'authenticated', action: 'delete', scopeNames: 0 },
  { roleName: 'consultant', action: 'read', scopeNames: 'family' },
];

module.exports = {
  roles,
  roleIncs,
  users,
  roleRights,
};


/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = app => {

  const gPartyTypeEmojis = {
    Birthday: '🎂',
    Dance: '💃',
    Garden: '🏡',
  };

  class Party extends app.Service {

    async create({ atomClass, key, item, user }) {
      // add party
      const res = await this.ctx.model.party.insert({
        atomId: key.atomId,
      });
      return { atomId: key.atomId, itemId: res.insertId };
    }

    _getMeta(item) {
      // flags
      const flags = [];
      if (item.personCount) {
        flags.push(item.personCount);
      }
      // summary
      let summary;
      if (item.partyTypeName) {
        summary = `${gPartyTypeEmojis[item.partyTypeName]}${this.ctx.text(item.partyTypeName)}`;
      }
      // meta
      const meta = {
        flags,
        summary,
      };
      // ok
      item._meta = meta;
    }

    async read({ atomClass, key, item, user }) {
      // read
      this._getMeta(item);
    }

    async select({ atomClass, options, items, user }) {
      // select
      for (const item of items) {
        this._getMeta(item);
      }
    }

    async write({ atomClass, key, item, user }) {
      // update party
      await this.ctx.model.party.update({
        id: key.itemId,
        personCount: item.personCount,
        partyTypeId: item.partyTypeId,
      });
    }

    async delete({ atomClass, key, user }) {
      // delete party
      await this.ctx.model.party.delete({
        id: key.itemId,
      });
    }

    async action({ action, atomClass, key, user }) {
      if (action === 101) {
        // change flag
        await this.ctx.meta.atom.flag({
          key,
          atom: { atomFlag: 2 },
          user,
        });
      }
    }

    async enable({ atomClass, key, atom, user }) {
      // enable
      const atomFlag = atom.atomEnabled ? 1 : 0;
      // change flag
      await this.ctx.meta.atom.flag({
        key,
        atom: { atomFlag },
        user,
      });
    }

    async types({ empty }) {
      const items = await this.ctx.model.partyType.select();
      return items.map(item => {
        return {
          id: item.id,
          name: this.ctx.text(item.name),
        };
      });
    }

  }

  return Party;
};


/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = app => {

  class PartyPublic extends app.Service {

    async create({ atomClass, key, item, user }) {
      const res = await this.ctx.model.partyPublic.insert({
        atomId: key.atomId,
      });
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, key, item, user }) {
    }

    async select({ atomClass, options, items, user }) {
    }

    async write({ atomClass, key, item, user }) {
    }

    async delete({ atomClass, key, user }) {
      await this.ctx.model.partyPublic.delete({
        id: key.itemId,
      });
    }

    async action({ action, atomClass, key, user }) {
    }

    async enable({ atomClass, key, atom, user }) {
    }

  }

  return PartyPublic;
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

const party = __webpack_require__(57);
const partyType = __webpack_require__(58);
const partyPublic = __webpack_require__(59);

module.exports = app => {
  const models = {
  };
  if (app.meta.isTest || app.meta.isLocal) {
    Object.assign(models, {
      party,
      partyType,
      partyPublic,
    });
  }
  return models;
};


/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = app => {

  class Party extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'testParty', options: { disableDeleted: false } });
    }

  }

  return Party;
};


/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = app => {

  class PartyType extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'testPartyType', options: { disableDeleted: true } });
    }

  }

  return PartyType;
};


/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = app => {

  class PartyPublic extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'testPartyPublic', options: { disableDeleted: false } });
    }

  }

  return PartyPublic;
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');

module.exports = app => {
  const meta = {
  };
  if (app.meta.isTest || app.meta.isLocal) {
    // schemas
    const schemas = __webpack_require__(61)(app);
    // keywords
    const keywords = __webpack_require__(62)(app);
    // meta
    extend(true, meta, {
      base: {
        atoms: {
          party: {
            info: {
              title: 'Party',
              tableName: 'testPartyView',
              flow: 0,
            },
            actions: {
              review: {
                code: 101,
                title: 'Review',
                flag: '1',
              },
            },
            flags: {
              1: {
                title: 'Reviewing',
              },
              2: {
                title: 'Reviewed',
              },
            },
            validator: 'party',
            search: {
              validator: 'partySearch',
            },
          },
        },
        functions: {
          createParty: {
            title: 'Create Party',
            scene: 'create',
            autoRight: 1,
            atomClassName: 'party',
            action: 'create',
            sorting: 1,
            menu: 1,
          },
          listParty: {
            title: 'Party List',
            scene: 'list',
            autoRight: 1,
            atomClassName: 'party',
            action: 'read',
            sorting: 1,
            menu: 1,
          },
          kitchenSink: {
            title: 'Kitchen-sink',
            scene: 'tools',
            actionPath: 'kitchen-sink/index',
            sorting: 1,
            menu: 1,
          },
        },
      },
      validation: {
        validators: {
          party: {
            schemas: 'party',
          },
          partySearch: {
            schemas: 'partySearch',
          },
          userTest: {
            schemas: 'settingsUser,settingsUserExtra',
          },
          instanceTest: {
            schemas: 'settingsInstance',
          },
          formTest: {
            schemas: 'formTest',
          },
        },
        keywords: {
          'x-languages': keywords.languages,
        },
        schemas: {
          party: schemas.party,
          partySearch: schemas.partySearch,
          settingsUser: schemas.settingsUser,
          settingsUserExtra: schemas.settingsUserExtra,
          settingsInstance: schemas.settingsInstance,
          formTest: schemas.formTest,
        },
      },
      settings: {
        user: {
          validator: 'userTest',
        },
        instance: {
          validator: 'instanceTest',
        },
      },
    });
  }
  if (app.meta.isTest) {
    // meta
    extend(true, meta, {
      base: {
        atoms: {
          partyPublic: {
            info: {
              tableName: 'testPartyPublic',
              public: 1,
              flow: 1,
            },
          },
        },
        functions: {
          testFunctionPublic: {
            scene: 'tools',
            menu: 1,
            public: 1,
          },
        },
      },
      event: {
        declarations: {
          hello: 'This is a test for event',
        },
        implementations: {
          'test-party:hello': 'test/event/helloEcho',
          'a-base:userVerify': 'test/event/userVerify',
        },
      },
      hook: {
        before: [
          { path: '/test/party/test/feat/hook/echo', route: 'test/feat/hook/echoBefore' },
        ],
        after: [
          { path: '/test/party/test/feat/hook/echo', route: 'test/feat/hook/echoAfter' },
        ],
      },
      sequence: {
        providers: {
          test: {
            start: 0,
            expression({ ctx, value }) {
              return ++value;
            },
          },
        },
      },
    });
  }
  return meta;
};


/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  // party
  schemas.party = {
    type: 'object',
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Party Name',
        notEmpty: true,
      },
      personCount: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Person Count',
        notEmpty: true,
      },
      partyTypeId: {
        type: 'number',
        ebType: 'select',
        ebTitle: 'Party Type',
        ebOptionsUrl: '/test/party/party/types',
        ebOptionTitleKey: 'name',
        ebOptionValueKey: 'id',
        ebOptionsBlankAuto: true,
        notEmpty: true,
      },
    },
  };
  // party search
  schemas.partySearch = {
    type: 'object',
    properties: {
      partyTypeId: {
        type: 'number',
        ebType: 'select',
        ebTitle: 'Party Type',
        ebOptionsUrl: '/test/party/party/types',
        ebOptionTitleKey: 'name',
        ebOptionValueKey: 'id',
        ebOptionsBlankAuto: true,
      },
    },
  };

  // settings
  schemas.settingsUser = {
    type: 'object',
    properties: {
      groupInfo: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          username: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'My Name',
            notEmpty: true,
          },
        },
      },
      groupExtra: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Extra Group',
        properties: {
          panelExtra: {
            ebType: 'panel',
            ebTitle: 'Extra',
            $ref: 'settingsUserExtra',
          },
        },
      },
    },
  };
  schemas.settingsUserExtra = {
    type: 'object',
    ebTitle: 'Extra',
    properties: {
      groupInfo: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          mobile: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'Mobile',
            notEmpty: true,
          },
          sex: {
            type: 'number',
            ebType: 'select',
            ebTitle: 'Sex',
            ebMultiple: false,
            ebOptions: [
              { title: 'Male', value: 1 },
              { title: 'Female', value: 2 },
            ],
            ebParams: {
              openIn: 'page',
              closeOnSelect: true,
            },
            notEmpty: true,
          },
          language: {
            type: 'string',
            ebType: 'select',
            ebTitle: 'Language',
            ebOptionsUrl: '/a/base/base/locales',
            ebOptionsUrlParams: null,
            'x-languages': true,
            notEmpty: true,
          },
        },
      },
    },
  };
  schemas.settingsInstance = {
    type: 'object',
    properties: {
      groupInfo: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          slogan: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'Slogan',
            notEmpty: true,
          },
        },
      },
    },
  };
  schemas.formTest = {
    type: 'object',
    properties: {
      userName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        notEmpty: true,
        'x-exists': true,
      },
      password: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Password',
        ebSecure: true,
        notEmpty: true,
        minLength: 6,
      },
      passwordAgain: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Password again',
        ebSecure: true,
        notEmpty: true,
        const: { $data: '1/password' },
      },
      sex: {
        type: 'number',
        ebType: 'select',
        ebTitle: 'Sex',
        ebMultiple: false,
        ebOptions: [
          { title: 'Male', value: 1 },
          { title: 'Female', value: 2 },
        ],
        ebOptionsBlankAuto: true,
        ebParams: {
          openIn: 'page',
          closeOnSelect: true,
        },
        notEmpty: true,
      },
      language: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Language',
        ebOptionsUrl: '/a/base/base/locales',
        ebOptionsUrlParams: null,
        ebOptionsBlankAuto: true,
        'x-languages': true,
        notEmpty: true,
      },
      avatar: {
        type: 'string',
        ebType: 'file',
        ebTitle: 'Avatar',
        ebParams: { mode: 1 },
        notEmpty: true,
      },
      rememberMe: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Remember me',
      },
    },
  };

  return schemas;
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const Ajv = require3('ajv');

module.exports = app => {
  const keywords = {};
  keywords.languages = {
    async: true,
    type: 'string',
    errors: true,
    compile(sch, parentSchema) {
      const func = async function(data) {
        const ctx = this;
        const context = arguments.callee.context;
        const locales = await ctx.performAction({
          method: 'post',
          url: context.parentSchema.ebOptionsUrl,
          body: context.parentSchema.ebOptionsUrlParams,
        });
        const index = locales.findIndex(item => item.value === data);
        if (index > -1) return true;
        const errors = [{ keyword: 'x-languages', params: [], message: ctx.text('Not expected value') }];
        throw new Ajv.ValidationError(errors);
      };
      func.context = {
        sch, parentSchema,
      };
      return func;
    },
  };
  return keywords;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map