/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 146:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Progress extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'progress');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    get redis() {
      if (!this._redis) this._redis = ctx.app.redis.get('io') || ctx.app.redis.get('cache');
      return this._redis;
    }

    _getRedisKey({ progressId }) {
      return `progress:${ctx.instance.id}:${progressId}`;
    }

    async _getRedisValue({ progressId }) {
      const key = this._getRedisKey({ progressId });
      const content = await this.redis.get(key);
      return content ? JSON.parse(content) : null;
    }

    async _setRedisValue({ progressId, content, contentOld }) {
      const expireTime = this.configModule.progress.expireTime;
      const key = this._getRedisKey({ progressId });
      if (contentOld) {
        content = Object.assign({}, contentOld, content);
      }
      await this.redis.set(key, JSON.stringify(content), 'PX', expireTime);
    }

    async _updateRedisValue({ progressId, content }) {
      const contentOld = await this._getRedisValue({ progressId });
      await this._setRedisValue({ progressId, content, contentOld });
    }

    async _deleteRedisValue({ progressId }) {
      const key = this._getRedisKey({ progressId });
      await this.redis.del(key);
    }

    async create(options) {
      if (!ctx.state.user || !ctx.state.user.op) return ctx.throw(403);
      let progressId = options && options.progressId;
      // create
      if (!progressId) {
        progressId = ctx.bean.util.uuidv4();
      } else {
        // check if exists
        const item = await this._getRedisValue({ progressId });
        if (item) return ctx.throw(403);
      }
      // redis
      await this._setRedisValue({
        progressId,
        content: {
          userId: ctx.state.user.op.id,
          counter: 0,
          done: 0,
          abort: 0,
          data: null,
        },
      });
      // ok
      return progressId;
    }

    async update({ progressId, progressNo = 0, total, progress, text }) {
      if (!progressId) return;
      const item = await this._getRedisValue({ progressId });
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
      const data = item.data || [];
      if (data.length > progressNo + 1) {
        data.splice(progressNo + 1, data.length - progressNo - 1);
      }
      data[progressNo] = { total, progress, text };
      // update
      await this._setRedisValue({
        progressId,
        content: {
          counter: item.counter + 1,
          data,
        },
        contentOld: item,
      });
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
      if (!progressId) return;
      const item = await this._getRedisValue({ progressId });
      if (!item) {
        // same as abort
        // 1001: 'Operation Aborted',
        ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // data
      const data = { message };
      // update
      await this._setRedisValue({
        progressId,
        content: {
          counter: item.counter + 1,
          done: 1,
          data,
        },
        contentOld: item,
      });
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
      if (!progressId) return;
      const item = await this._getRedisValue({ progressId });
      if (!item) {
        // same as abort
        // 1001: 'Operation Aborted',
        ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // data
      const data = { message };
      // update
      await this._setRedisValue({
        progressId,
        content: {
          counter: item.counter + 1,
          done: -1,
          data,
        },
        contentOld: item,
      });
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

    async check({ progressId, counter, user }) {
      if (!progressId) return null;
      const item = await this._getRedisValue({ progressId });
      if (!item || item.userId !== user.id || item.counter <= counter) return null;
      return item;
    }

    async abort({ progressId, user }) {
      if (!progressId) return;
      const item = await this._getRedisValue({ progressId });
      if (!item || item.userId !== user.id) return;
      await this._setRedisValue({
        progressId,
        content: {
          abort: 1,
        },
        contentOld: item,
      });
    }

    async delete({ progressId, user }) {
      if (!progressId) return;
      const item = await this._getRedisValue({ progressId });
      if (!item || item.userId !== user.id) return;
      await this._deleteRedisValue({ progressId });
    }

    async _publish({ progressId, ioMessage }) {
      await ctx.bean.io.publish({
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

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
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

      if (options.version === 3) {
        // drop table: aProgress
        await this.ctx.model.query('drop table if exists aProgress');
      }
    }

    async init(options) {}

    async test() {}
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const beanProgress = __webpack_require__(146);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // global
    progress: {
      mode: 'ctx',
      bean: beanProgress,
      global: true,
    },
  };
  return beans;
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {};

  // progress
  config.progress = {
    expireTime: 2 * 3600 * 1000, // default is 2 hours
  };

  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
  1001: 'Operation Aborted',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  'Operation Aborted': '操作已中止',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 962:
/***/ ((module) => {

module.exports = app => {
  const progress = {
    info: {
      title: 'Progress',
      persistence: false,
    },
  };
  return progress;
};


/***/ }),

/***/ 69:
/***/ ((module) => {

module.exports = app => {
  class ProgressController extends app.Controller {
    async check() {
      const res = await this.service.progress.check({
        progressId: this.ctx.request.body.progressId,
        counter: this.ctx.request.body.counter,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async abort() {
      await this.service.progress.abort({
        progressId: this.ctx.request.body.progressId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success();
    }

    async delete() {
      await this.service.progress.delete({
        progressId: this.ctx.request.body.progressId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success();
    }
  }
  return ProgressController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const progress = __webpack_require__(69);

module.exports = app => {
  const controllers = {
    progress,
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

module.exports = app => {
  // const schemas = require('./config/validation/schemas.js')(app);
  // socketio
  const socketioProgress = __webpack_require__(962)(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {},
      keywords: {},
      schemas: {},
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

/***/ 230:
/***/ ((module) => {

module.exports = app => {
  const models = {};
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // progress
    {
      method: 'post',
      path: 'progress/check',
      controller: 'progress',
      meta: {
        auth: { user: true },
        right: { enableAuthOpen: true },
      },
    },
    {
      method: 'post',
      path: 'progress/abort',
      controller: 'progress',
      meta: {
        auth: { user: true },
        right: { enableAuthOpen: true },
      },
    },
    {
      method: 'post',
      path: 'progress/delete',
      controller: 'progress',
      meta: {
        auth: { user: true },
        right: { enableAuthOpen: true },
      },
    },
  ];
  return routes;
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  class Progress extends app.Service {
    async check({ progressId, counter, user }) {
      return await this.ctx.bean.progress.check({ progressId, counter, user });
    }

    async abort({ progressId, user }) {
      return await this.ctx.bean.progress.abort({ progressId, user });
    }

    async delete({ progressId, user }) {
      return await this.ctx.bean.progress.delete({ progressId, user });
    }
  }

  return Progress;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const progress = __webpack_require__(232);

module.exports = app => {
  const services = {
    progress,
  };
  return services;
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(421);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=backend.js.map