/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 133:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Share {
    get modelShare() {
      return ctx.model.module(moduleInfo.relativeName).share;
    }

    get modelShareRecordPV() {
      return ctx.model.module(moduleInfo.relativeName).shareRecordPV;
    }

    get modelShareRecordUV() {
      return ctx.model.module(moduleInfo.relativeName).shareRecordUV;
    }

    async generate({ host, atomId, url, user }) {
      const userId = user.id;
      // get
      let item = await this.modelShare.get({
        host,
        atomId,
        url,
        userId,
      });
      // insert
      if (!item) {
        item = {
          uuid: ctx.bean.util.uuidv4(),
          atomId,
          userId,
          host,
          url,
        };
        const res = await this.modelShare.insert(item);
        item.id = res.insertId;
      }
      // link
      const link = this._combine_shareLink(item.uuid);
      // ok
      return { link, uuid: item.uuid };
    }

    async shareGo({ uuid, user }) {
      const userId = user.id;
      // get share
      const item = await this.modelShare.get({ uuid });
      if (!item) ctx.throw(404);
      // anonymous
      if (user.anonymous) {
        // redirect to login
        const shareLink = this._combine_shareLink(uuid);
        const url = ctx.bean.base.getAbsoluteUrl(`/#!${shareLink}`);
        ctx.redirect(url);
        return;
      }
      // not self
      if (item.userId !== userId) {
        await this._share_record({ item, user });
      }
      // redirect to original url
      const url = item.url.indexOf('http') === 0 ? item.url : ctx.bean.base.getAbsoluteUrl(`/#!${item.url}`);
      // redirect
      ctx.redirect(url);
    }

    _combine_shareLink(uuid) {
      return ctx.bean.base.getAbsoluteUrl(`/api/a/share/go/${uuid}`);
    }

    async _share_record({ item, user }) {
      const userId = user.id;
      // aShareRecordPV
      await ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'shareRecordPV',
        data: { share: item, user },
        next: async (context, next) => {
          // record
          const res = await this.modelShareRecordPV.insert({
            shareId: item.id,
            userId,
          });
          context.result = {
            recordId: res.insertId,
          };
          // next
          await next();
        },
      });
      // aShareRecordUV
      const uvData = {
        atomId: item.atomId,
        userIdSource: item.userId,
        userIdTarget: userId,
      };
      const uv = await this.modelShareRecordUV.get(uvData);
      if (!uv) {
        await ctx.bean.event.invoke({
          module: moduleInfo.relativeName,
          name: 'shareRecordUV',
          data: { share: item, user },
          next: async (context, next) => {
            // record
            const res = await this.modelShareRecordUV.insert(uvData);
            context.result = {
              recordId: res.insertId,
            };
            // next
            await next();
          },
        });
      }
    }
  }

  return Share;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        let sql;

        // create table: aShare
        sql = `
          CREATE TABLE aShare (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            uuid varchar(50) DEFAULT NULL,
            atomId int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            host varchar(255) DEFAULT NULL,
            url varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aShareRecordPV
        sql = `
          CREATE TABLE aShareRecordPV (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            shareId int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aShareRecordUV
        sql = `
          CREATE TABLE aShareRecordUV (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            userIdSource int(11) DEFAULT '0',
            userIdTarget int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
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
const beanShare = __webpack_require__(133);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // global
    share: {
      mode: 'ctx',
      bean: beanShare,
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
  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ }),

/***/ 756:
/***/ ((module) => {

module.exports = app => {
  class ShareController extends app.Controller {
    async generate() {
      const res = await this.service.share.generate({
        host: this.ctx.request.body.host,
        atomId: this.ctx.request.body.atomId,
        url: this.ctx.request.body.url,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async shareGo() {
      await this.service.share.shareGo({
        uuid: this.ctx.params.uuid,
        user: this.ctx.state.user.op,
      });
    }
  }
  return ShareController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const share = __webpack_require__(756);

module.exports = app => {
  const controllers = {
    share,
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
  // aops
  const aops = __webpack_require__(224)(app);
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
    aops,
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
  const schemas = __webpack_require__(232)(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
    event: {
      declarations: {
        shareRecordPV: 'Share Record PV',
        shareRecordUV: 'Share Record UV',
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 34:
/***/ ((module) => {

module.exports = app => {
  class Share extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aShare', options: { disableDeleted: false } });
    }
  }
  return Share;
};


/***/ }),

/***/ 783:
/***/ ((module) => {

module.exports = app => {
  class ShareRecordPV extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aShareRecordPV', options: { disableDeleted: false } });
    }
  }
  return ShareRecordPV;
};


/***/ }),

/***/ 456:
/***/ ((module) => {

module.exports = app => {
  class ShareRecordUV extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aShareRecordUV', options: { disableDeleted: false } });
    }
  }
  return ShareRecordUV;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const share = __webpack_require__(34);
const shareRecordPV = __webpack_require__(783);
const shareRecordUV = __webpack_require__(456);

module.exports = app => {
  const models = {
    share,
    shareRecordPV,
    shareRecordUV,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    {
      method: 'post',
      path: 'share/generate',
      controller: 'share',
      meta: {
        auth: { user: true },
      },
    },
    { method: 'get', path: 'go/:uuid', controller: 'share', action: 'shareGo' },
  ];
  return routes;
};


/***/ }),

/***/ 460:
/***/ ((module) => {

module.exports = app => {
  class Share extends app.Service {
    async generate({ host, atomId, url, user }) {
      return await this.ctx.bean.share.generate({ host, atomId, url, user });
    }

    async shareGo({ uuid, user }) {
      return await this.ctx.bean.share.shareGo({ uuid, user });
    }
  }

  return Share;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const share = __webpack_require__(460);

module.exports = app => {
  const services = {
    share,
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