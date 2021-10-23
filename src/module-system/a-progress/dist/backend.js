/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 146:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const uuid = require3('uuid');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Progress extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'progress');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get modelProgress() {
      return ctx.model.module(moduleInfo.relativeName).progress;
    }

    async create() {
      if (!ctx.state.user || !ctx.state.user.op) return ctx.throw(403);
      const progressId = uuid.v4().replace(/-/g, '');
      await this.modelProgress.insert({ progressId, userId: ctx.state.user.op.id });
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

/***/ 210:
/***/ ((module) => {

module.exports = app => {
  class Progress extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aProgress', options: { disableDeleted: true } });
    }
  }
  return Progress;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const progress = __webpack_require__(210);

module.exports = app => {
  const models = {
    progress,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // progress
    { method: 'post', path: 'progress/check', controller: 'progress', meta: { auth: { user: true } } },
    { method: 'post', path: 'progress/abort', controller: 'progress', meta: { auth: { user: true } } },
    { method: 'post', path: 'progress/delete', controller: 'progress', meta: { auth: { user: true } } },
  ];
  return routes;
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  class Progress extends app.Service {
    async check({ progressId, counter, user }) {
      return await this.ctx.model.queryOne(
        `
        select * from aProgress a
          where a.iid=? and a.progressId=? and a.counter>? and a.userId=?
        `,
        [this.ctx.instance.id, progressId, counter, user.id]
      );
    }

    async abort({ progressId, user }) {
      await this.ctx.model.query(
        `
        update aProgress set abort=1
          where iid=? and progressId=? and userId=?
        `,
        [this.ctx.instance.id, progressId, user.id]
      );
    }

    async delete({ progressId, user }) {
      await this.ctx.model.query(
        `
        delete from aProgress
          where iid=? and progressId=? and userId=?
        `,
        [this.ctx.instance.id, progressId, user.id]
      );
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


/***/ }),

/***/ 638:
/***/ ((module) => {

"use strict";
module.exports = require("require3");

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