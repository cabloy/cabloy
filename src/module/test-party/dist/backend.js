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
  const services = __webpack_require__(37)(app);
  // models
  const models = __webpack_require__(43)(app);
  // meta
  const meta = __webpack_require__(47)(app);

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
  }

  if (appInfo.env === 'unittest' || appInfo.env === 'local') {
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
  'Create Party': '新建宴会',
  'Party List': '宴会列表',
  'Level One': '层级1',
  'Level Two': '层级2',
  'Level Three': '层级3',
  'Well Done': '干得好',
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
const party = __webpack_require__(9);
const partyPublic = __webpack_require__(10);
const testAtomStarLabel = __webpack_require__(11);
const testAtomAll = __webpack_require__(12);
const testAtomPublicFlow = __webpack_require__(13);
const testAtomRight = __webpack_require__(14);
const testFunctionRight = __webpack_require__(15);
const testFunctionAll = __webpack_require__(16);
const testFunctionPublic = __webpack_require__(17);
const testCtxPerformAction = __webpack_require__(18);
const testCtxTransaction = __webpack_require__(19);
const testCtxTail = __webpack_require__(20);
const testCtxSession = __webpack_require__(21);
const testCacheMem = __webpack_require__(22);
const testCacheDb = __webpack_require__(23);
const testRoleUserRole = __webpack_require__(24);
const testEventHello = __webpack_require__(25);
const testEventUserVerify = __webpack_require__(26);
const testFeatHttpLog = __webpack_require__(27);
const testFeatStartup = __webpack_require__(28);
const testFeatSendMail = __webpack_require__(29);
const testFeatHook = __webpack_require__(30);
const testFeatInstance = __webpack_require__(31);
const testFeatProgress = __webpack_require__(32);
const testFeatSequence = __webpack_require__(33);
const testFeatSettings = __webpack_require__(34);
const testFeatStatus = __webpack_require__(35);
const testFeatValidation = __webpack_require__(36);

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
      { method: 'post', path: 'partyPublic/write', controller: partyPublic, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'partyPublic/delete', controller: partyPublic, middlewares: 'inner', meta: { auth: { enable: false } } },

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

    ]);
  }
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
/* 10 */
/***/ (function(module, exports) {

module.exports = app => {

  class PartyPublicController extends app.Controller {

    async create() {
      const res = await this.ctx.service.partyPublic.create(this.ctx.request.body);
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

  }

  return PartyPublicController;
};



/***/ }),
/* 11 */
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
/* 12 */
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
/* 13 */
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
/* 14 */
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
/* 15 */
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
/* 16 */
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
/* 17 */
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
/* 18 */
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
/* 19 */
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
/* 20 */
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
/* 21 */
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
/* 22 */
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
      await sleep(1000);
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
/* 23 */
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
      await sleep(1000);
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
/* 24 */
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
/* 25 */
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
/* 26 */
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
/* 27 */
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
/* 28 */
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
/* 29 */
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
/* 30 */
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
/* 31 */
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
/* 32 */
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
/* 33 */
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
/* 34 */
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
/* 35 */
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
/* 36 */
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
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(38);
const party = __webpack_require__(41);
const partyPublic = __webpack_require__(42);

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
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

const VersionTestFn = __webpack_require__(39);

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
        // roleFunctions
        const roleRoot = await this.ctx.meta.role.getSystemRole({ roleName: 'root' });
        const functions = [ 'kichenSink' ];
        for (const functionName of functions) {
          const func = await this.ctx.meta.function.get({
            name: functionName,
          });
          await this.ctx.meta.role.addRoleFunction({
            roleId: roleRoot.id,
            functionId: func.id,
          });
        }
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
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

const testData = __webpack_require__(40);

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
    async _testRoleRights(roleIds) {
      const module = ctx.app.meta.modules[ctx.module.info.relativeName];
      for (const [ roleName, atomClassName, actionName, scopeNames ] of testData.roleRights) {
        const atomClass = await ctx.meta.atomClass.get({ atomClassName });
        await ctx.meta.role.addRoleRight({
          roleId: roleIds[roleName],
          atomClassId: atomClass.id,
          action: ctx.constant.module('a-base').atom.action[actionName] || module.main.meta.base.atoms[atomClassName]
            .actions[actionName].code,
          scope: scopeNames ? scopeNames.split(',').map(scopeName => roleIds[scopeName]) : 0,
        });
      }
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
/* 40 */
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
  [ 'system', 'party', 'create' ],
  [ 'system', 'party', 'read', 'family' ],
  [ 'system', 'party', 'review', 'family' ],
  [ 'system', 'party', 'review', 'authenticated' ],
  [ 'family', 'party', 'create' ],
  [ 'family', 'party', 'read', 'family' ],
  [ 'mother', 'party', 'review', 'family' ],
  [ 'authenticated', 'party', 'write', 0 ],
  [ 'authenticated', 'party', 'delete', 0 ],
  [ 'consultant', 'party', 'read', 'family' ],
];

module.exports = {
  roles,
  roleIncs,
  users,
  roleRights,
};


/***/ }),
/* 41 */
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
/* 42 */
/***/ (function(module, exports) {

module.exports = app => {

  class PartyPublic extends app.Service {

    async create({ atomClass, key, item, user }) {
      const res = await this.ctx.model.partyPublic.insert({
        atomId: key.atomId,
      });
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async write({ atomClass, key, item, user }) {
    }

    async delete({ atomClass, key, user }) {
      await this.ctx.model.partyPublic.delete({
        id: key.itemId,
      });
    }

  }

  return PartyPublic;
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

const party = __webpack_require__(44);
const partyType = __webpack_require__(45);
const partyPublic = __webpack_require__(46);

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
/* 44 */
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
/* 45 */
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
/* 46 */
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
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');

module.exports = app => {
  const meta = {
  };
  if (app.meta.isTest || app.meta.isLocal) {
    // schemas
    const schemas = __webpack_require__(48)(app);
    // keywords
    const keywords = __webpack_require__(49)(app);
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
          kichenSink: {
            title: 'Kichen-sink',
            scene: 'tools',
            actionPath: 'kichen-sink/index',
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
/* 48 */
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

  return schemas;
};


/***/ }),
/* 49 */
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