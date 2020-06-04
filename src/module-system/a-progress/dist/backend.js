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

module.exports = app => {
  class Progress extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aProgress', options: { disableDeleted: true } });
    }
  }
  return Progress;
};


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
  const services = __webpack_require__(13)(app);
  // models
  const models = __webpack_require__(16)(app);
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
/* 2 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    progress: {
      global: false,
      dependencies: 'instance',
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
  'Operation Aborted': '操作已中止',
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'Operation Aborted',
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const progress = __webpack_require__(7);

module.exports = {
  progress,
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// progress
const ProgressFn = __webpack_require__(8);
const PROGRESS = Symbol('CTX#__PROGRESS');

module.exports = () => {
  return async function progress(ctx, next) {
    ctx.meta = ctx.meta || {};
    // progress
    Object.defineProperty(ctx.meta, 'progress', {
      get() {
        if (ctx.meta[PROGRESS] === undefined) {
          ctx.meta[PROGRESS] = new (ProgressFn(ctx))();
        }
        return ctx.meta[PROGRESS];
      },
    });

    // next
    await next();
  };
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(9);
const uuid = require3('uuid');

const modelProgressFn = __webpack_require__(0);

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Progress {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._modelProgress = null;
    }

    // other module's progress
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get modelProgress() {
      if (!this._modelProgress) this._modelProgress = new (modelProgressFn(ctx.app))(ctx);
      return this._modelProgress;
    }

    async create() {
      const progressId = uuid.v4().replace(/-/g, '');
      await this.modelProgress.insert({ progressId, userId: ctx.user.op.id });
      return progressId;
    }

    async update({ progressId, progressNo = 0, total, progress, text }) {
      const item = await this.modelProgress.get({ progressId });
      if (!item) {
        // same as abort
        // 1001: 'Operation Aborted',
        ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // abort
      if (item.abort) {
        // 1001: 'Operation Aborted',
        ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // data
      const data = item.data ? JSON.parse(item.data) : [];
      if (data.length > progressNo + 1) {
        data.splice(progressNo + 1, data.length - progressNo - 1);
      }
      data[progressNo] = { total, progress, text };
      // update
      await this.modelProgress.update({ id: item.id, counter: item.counter + 1, data: JSON.stringify(data) });
      // publish
      const ioMessage = {
        userIdTo: item.userId,
        content: {
          ...item,
          counter: item.counter + 1,
          data,
        },
      };
      await this._publish({ progressId, ioMessage });
    }

    async done({ progressId, message }) {
      const item = await this.modelProgress.get({ progressId });
      if (!item) {
        // same as abort
        // 1001: 'Operation Aborted',
        ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // data
      const data = { message };
      // update
      await this.modelProgress.update({ id: item.id, counter: item.counter + 1, done: 1, data: JSON.stringify(data) });
      // publish
      const ioMessage = {
        userIdTo: item.userId,
        content: {
          ...item,
          counter: item.counter + 1,
          done: 1,
          data,
        },
      };
      await this._publish({ progressId, ioMessage });
    }

    async error({ progressId, message }) {
      const item = await this.modelProgress.get({ progressId });
      if (!item) {
        // same as abort
        // 1001: 'Operation Aborted',
        ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // data
      const data = { message };
      // update
      await this.modelProgress.update({ id: item.id, counter: item.counter + 1, done: -1, data: JSON.stringify(data) });
      // publish
      const ioMessage = {
        userIdTo: item.userId,
        content: {
          ...item,
          counter: item.counter + 1,
          done: -1,
          data,
        },
      };
      await this._publish({ progressId, ioMessage });
    }

    async _publish({ progressId, ioMessage }) {
      await ctx.meta.io.publish({
        path: `/a/progress/update/${progressId}`,
        message: ioMessage,
        messageClass: {
          module: moduleInfo.relativeName,
          messageClassName: 'progress',
        },
      });
    }

  }
  return Progress;
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(11);
const progress = __webpack_require__(12);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // progress
    { method: 'post', path: 'progress/check', controller: progress, meta: { auth: { user: true } } },
    { method: 'post', path: 'progress/abort', controller: progress, meta: { auth: { user: true } } },
    { method: 'post', path: 'progress/delete', controller: progress, meta: { auth: { user: true } } },
  ];
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
  class ProgressController extends app.Controller {

    async check() {
      const res = await this.service.progress.check({
        progressId: this.ctx.request.body.progressId,
        counter: this.ctx.request.body.counter,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async abort() {
      await this.service.progress.abort({
        progressId: this.ctx.request.body.progressId,
        user: this.ctx.user.op,
      });
      this.ctx.success();
    }

    async delete() {
      await this.service.progress.delete({
        progressId: this.ctx.request.body.progressId,
        user: this.ctx.user.op,
      });
      this.ctx.success();
    }

  }
  return ProgressController;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(14);
const progress = __webpack_require__(15);

module.exports = app => {
  const services = {
    version,
    progress,
  };
  return services;
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // aProgress
        const sql = `
        CREATE TABLE aProgress (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            progressId varchar(50) DEFAULT NULL,
            counter int(11) DEFAULT '0',
            done int(11) DEFAULT '0',
            abort int(11) DEFAULT '0',
            data text DEFAULT NULL,
            PRIMARY KEY (id)
          )
                  `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 2) {
        // aProgress: add field userId
        const sql = `
        ALTER TABLE aProgress
          ADD COLUMN userId int(11) DEFAULT '0'
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
/* 15 */
/***/ (function(module, exports) {

module.exports = app => {

  class Progress extends app.Service {

    async check({ progressId, counter, user }) {
      return await this.ctx.model.queryOne(`
        select * from aProgress a
          where a.iid=? and a.progressId=? and a.counter>? and a.userId=?
        `, [ this.ctx.instance.id, progressId, counter, user.id ]);
    }

    async abort({ progressId, user }) {
      await this.ctx.model.query(`
        update aProgress set abort=1
          where iid=? and progressId=? and userId=?
        `, [ this.ctx.instance.id, progressId, user.id ]);
    }

    async delete({ progressId, user }) {
      await this.ctx.model.query(`
        delete from aProgress
          where iid=? and progressId=? and userId=?
        `, [ this.ctx.instance.id, progressId, user.id ]);
    }

  }

  return Progress;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const progress = __webpack_require__(0);

module.exports = app => {
  const models = {
    progress,
  };
  return models;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  // const schemas = require('./config/validation/schemas.js')(app);
  // socketio
  const socketioProgress = __webpack_require__(18)(app);
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
    socketio: {
      messages: {
        progress: socketioProgress,
      },
    },
  };
  return meta;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = app => {

  const progress = {
    info: {
      title: 'Progress',
      persistence: false,
    },
    callbacks: {
    },
  };
  return progress;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map