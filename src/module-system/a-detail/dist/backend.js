/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 456:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const detail_0 = __webpack_require__(208);
const detail_copy = __webpack_require__(709);
const detail_delete = __webpack_require__(334);

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(
    detail_0,
    [
      detail_copy, //
      detail_delete,
    ],
    ctx
  );
};


/***/ }),

/***/ 208:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Detail extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'detail');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get modelDetailBase() {
      return ctx.model.module(moduleInfo.relativeName).detailBase;
    }

    async _loopDetailClasses({ atomClass, fn }) {
      // all details of atom
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      const atomClassDetails = atomClassBase.details;
      if (!atomClassDetails) return; // do nothing
      // loop
      for (let atomClassDetail of atomClassDetails) {
        atomClassDetail = await ctx.bean.atomClass.get(atomClassDetail);
        const atomClassBaseDetail = await ctx.bean.atomClass.atomClass(atomClassDetail);
        await fn({ atomClassDetail, atomClassBaseDetail });
      }
    }
  }

  return Detail;
};


/***/ }),

/***/ 709:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Detail {
    async _copyDetails({ atomClass, target, srcKeyAtom, destKeyAtom, srcAtom, destAtom, options, user }) {
      await this._loopDetailClasses({
        atomClass,
        fn: async ({ atomClassDetail, atomClassBaseDetail }) => {
          await this._copyDetails_Class({
            atomClassDetail,
            atomClassBaseDetail,
            atomClass,
            target,
            srcKeyAtom,
            destKeyAtom,
            srcAtom,
            destAtom,
            options,
            user,
          });
        },
      });
    }

    async _copyDetails_Class({
      atomClassDetail,
      atomClassBaseDetail,
      atomClass,
      target,
      srcKeyAtom,
      destKeyAtom,
      srcAtom,
      destAtom,
      options,
      user,
    }) {
      // select all details src
      const detailsSrc = await ctx.bean.atom.select({
        atomClass: atomClassDetail,
        options: {
          atomIdMain: srcKeyAtom.atomId,
          mode: 'full',
        },
        pageForce: false,
      });
      // special for clone
      if (target === 'clone') {
        for (const detailSrc of detailsSrc) {
          await this._copyDetail({
            atomClassDetail,
            atomClassBaseDetail,
            atomClass,
            target,
            srcKeyAtom,
            destKeyAtom,
            srcAtom,
            destAtom,
            options,
            user,
            detailSrc,
          });
        }
        return;
      }
      // select all details dest
      const detailsDest = await ctx.bean.atom.select({
        atomClass: atomClassDetail,
        options: {
          atomIdMain: destKeyAtom.atomId,
          // mode: 'full',
        },
      });
      // detailStaticKey
      const detailBasesSrc = await this._copyDetails_prepareStaticKey({
        atomClassDetail,
        atomClassBaseDetail,
        atomClass,
        target,
        srcKeyAtom,
        destKeyAtom,
        srcAtom,
        destAtom,
        options,
        user,
        detailsSrc,
      });
      // select all details base dest
      const detailBasesDest = await this.modelDetailBase.select({
        where: {
          atomIdMain: destKeyAtom.atomId,
          atomClassIdMain: atomClass.id,
        },
      });
      // loop
      for (const detailBaseDest of detailBasesDest) {
        const detailDest = detailsDest.find(item => item.atomId === detailBaseDest.detailId);
        const detailKeyDest = {
          atomId: detailDest.atomId,
          itemId: detailDest.itemId,
        };
        const detailBaseSrc = detailBasesSrc.find(item => item.detailStaticKey === detailBaseDest.detailStaticKey);
        if (!detailBaseSrc) {
          // delete
          await ctx.bean.atom.delete({
            key: detailKeyDest,
            atomClass: atomClassDetail,
            user,
          });
        } else {
          const detailSrc = detailsSrc.find(item => item.atomId === detailBaseSrc.detailId);
          // write
          await this._copyDetail({
            atomClassDetail,
            atomClassBaseDetail,
            atomClass,
            target,
            srcKeyAtom,
            destKeyAtom,
            srcAtom,
            destAtom,
            options,
            user,
            detailSrc,
            detailKeyDest,
          });
          // set flag
          detailBaseSrc.__copied = true;
        }
      }
      // loop: append the remains
      for (const detailBaseSrc of detailBasesSrc) {
        if (detailBaseSrc.__copied) continue;
        const detailSrc = detailsSrc.find(item => item.atomId === detailBaseSrc.detailId);
        await this._copyDetail({
          atomClassDetail,
          atomClassBaseDetail,
          atomClass,
          target,
          srcKeyAtom,
          destKeyAtom,
          srcAtom,
          destAtom,
          options,
          user,
          detailBaseSrc,
          detailSrc,
        });
      }
    }

    async _copyDetail({
      atomClassDetail,
      atomClassBaseDetail,
      atomClass,
      target,
      /* srcKeyAtom,*/
      destKeyAtom,
      /* srcAtom,*/
      destAtom,
      options,
      user,
      detailBaseSrc,
      detailSrc,
      detailKeyDest,
    }) {
      // create detail
      if (!detailKeyDest) {
        detailKeyDest = await ctx.bean.atom.create({
          atomClass: atomClassDetail,
          item: null,
          options: { atomIdMain: destKeyAtom.atomId },
          user,
        });
      }
      // create detail base
      if (detailBaseSrc) {
        const data = {
          atomIdMain: destKeyAtom.atomId,
          atomClassIdMain: atomClass.id,
          atomStage: destAtom.atomStage,
          detailId: detailKeyDest.atomId,
          detailClassId: atomClassDetail.id,
          detailStaticKey: detailBaseSrc.detailStaticKey,
        };
        await this.modelDetailBase.insert(data);
      }
      // write
      const fieldNameAtomIdMain = atomClassBaseDetail.detail.atomIdMain;
      const item = {
        ...detailSrc,
        atomId: detailKeyDest.atomId,
        itemId: detailKeyDest.itemId,
        [fieldNameAtomIdMain]: destKeyAtom.atomId,
      };
      if (target === 'clone') {
        item.createdAt = new Date();
        item.updatedAt = new Date();
      }
      await ctx.bean.atom.write({
        key: detailKeyDest,
        atomClass: atomClassDetail,
        item,
        options: { ignoreValidate: true },
        user,
      });
    }

    async _copyDetails_prepareStaticKey({
      atomClassDetail,
      /* atomClassBaseDetail,*/
      atomClass,
      /* target,*/
      srcKeyAtom,
      /* destKeyAtom,*/
      srcAtom,
      /* destAtom,*/
      options,
      user,
      detailsSrc,
    }) {
      // detailBasesSrc
      const detailBasesSrc = await this.modelDetailBase.select({
        where: {
          atomIdMain: srcKeyAtom.atomId,
          atomClassIdMain: atomClass.id,
        },
      });
      // find missing detailStaticKey
      const detailBasesId = detailBasesSrc.map(item => item.detailId);
      const detailsSrcMissing = detailsSrc.filter(item => !detailBasesId.includes(item.id));
      // create detail base
      for (const detailSrcMissing of detailsSrcMissing) {
        const data = {
          atomIdMain: srcKeyAtom.atomId,
          atomClassIdMain: atomClass.id,
          atomStage: srcAtom.atomStage,
          detailId: detailSrcMissing.atomId,
          detailClassId: atomClassDetail.id,
          detailStaticKey: ctx.bean.util.uuidv4(),
        };
        const res = await this.modelDetailBase.insert(data);
        data.id = res.insertId;
        detailBasesSrc.push(data);
      }
      return detailBasesSrc;
    }
  }

  return Detail;
};


/***/ }),

/***/ 334:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Detail {
    async _deleteDetails({ atomClass, atomKey, user }) {
      await this._loopDetailClasses({
        atomClass,
        fn: async ({ atomClassDetail, atomClassBaseDetail }) => {
          await this._deleteDetails_Class({ atomClassDetail, atomClassBaseDetail, atomClass, atomKey, user });
        },
      });
    }

    async _deleteDetails_Class({ atomClassDetail, /* atomClassBaseDetail, atomClass,*/ atomKey, user }) {
      // select all details
      const details = await ctx.bean.atom.select({
        atomClass: atomClassDetail,
        options: {
          atomIdMain: atomKey.atomId,
          // mode: 'full',
        },
      });
      // loop
      for (const detail of details) {
        const detailKey = {
          atomId: detail.atomId,
          itemId: detail.itemId,
        };
        // delete
        await ctx.bean.atom.delete({
          key: detailKey,
          atomClass: atomClassDetail,
          user,
        });
      }
    }

    async _deleteDetailBase({ atomClass, key, options, user }) {
      await this.modelDetailBase.delete({
        detailId: key.atomId,
        detailClassId: atomClass.id,
      });
    }
  }

  return Detail;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // // create table: aDetail
        // let sql = `
        //   CREATE TABLE aDetail (
        //     id int(11) NOT NULL AUTO_INCREMENT,
        //     createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        //     updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        //     deleted int(11) DEFAULT '0',
        //     iid int(11) DEFAULT '0',
        //     atomId int(11) DEFAULT '0',
        //     atomStage int(11) DEFAULT '0',
        //     detailItemId int(11) DEFAULT '0',
        //     detailClassId int(11) DEFAULT '0',
        //     detailCodeId int(11) DEFAULT '0',
        //     detailCode varchar(255) DEFAULT NULL,
        //     detailName varchar(255) DEFAULT NULL,
        //     detailLineNo int(11) DEFAULT '0',
        //     detailStatic int(11) DEFAULT '0',
        //     detailStaticKey varchar(255) DEFAULT NULL,
        //     userIdCreated int(11) DEFAULT '0',
        //     userIdUpdated int(11) DEFAULT '0',
        //     PRIMARY KEY (id)
        //   )
        // `;
        // await this.ctx.model.query(sql);
        // // create table: aDetailClass
        // sql = `
        //   CREATE TABLE aDetailClass (
        //     id int(11) NOT NULL AUTO_INCREMENT,
        //     createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        //     updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        //     deleted int(11) DEFAULT '0',
        //     iid int(11) DEFAULT '0',
        //     module varchar(255) DEFAULT NULL,
        //     detailClassName varchar(255) DEFAULT NULL,
        //     PRIMARY KEY (id)
        //   )
        // `;
        // await this.ctx.model.query(sql);
      }
      if (options.version === 2) {
        // create table: aDetailBase
        const sql = `
          CREATE TABLE aDetailBase (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomIdMain int(11) DEFAULT '0',
            atomClassIdMain int(11) DEFAULT '0',
            atomStage int(11) DEFAULT '0',
            detailId int(11) DEFAULT '0',
            detailClassId int(11) DEFAULT '0',
            detailStaticKey varchar(255) DEFAULT NULL,
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
const beanDetail = __webpack_require__(456);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // global
    detail: {
      mode: 'ctx',
      bean: beanDetail,
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

/***/ 479:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return {
    detail: {
      // action: {
      //   create: 1,
      //   read: 2,
      //   write: 3,
      //   delete: 4,
      //   clone: 5,
      //   moveUp: 6,
      //   moveDown: 7,

      //   save: 51,

      //   custom: 100, // custom action start from custom
      // },
      actionMeta: {
        create: {
          title: 'Create',
          actionModule: 'a-base',
          actionComponent: 'action',
          bulk: true,
          select: false,
          icon: { f7: '::add' },
          rightInherit: 'write',
          mode: 'edit',
          stage: 'draft',
        },
        read: {
          title: 'View',
          actionModule: 'a-base',
          actionComponent: 'action',
          icon: { f7: '::visibility' },
          rightInherit: 'read',
          mode: 'view',
          stage: '',
        },
        write: {
          title: 'Edit',
          actionModule: 'a-base',
          actionComponent: 'action',
          icon: { f7: '::edit' },
          color: 'orange',
          rightInherit: 'write',
          mode: 'edit',
          stage: 'draft',
          directShowOnSwipeout: true,
          directShowOnList: true,
        },
        delete: {
          title: 'Delete',
          actionModule: 'a-base',
          actionComponent: 'action',
          icon: { f7: '::delete' },
          color: 'red',
          rightInherit: 'write',
          mode: 'edit',
          stage: 'draft',
          directShowOnSwipeout: true,
          directShowOnList: true,
        },
        clone: {
          title: 'Clone',
          actionModule: 'a-base',
          actionComponent: 'action',
          icon: { f7: ':outline:copy-outline' },
          rightInherit: 'write',
          mode: 'edit',
          stage: 'draft',
        },
        moveUp: {
          title: 'Move Up',
          actionModule: 'a-base',
          actionComponent: 'action',
          icon: { f7: '::arrow-up' },
          rightInherit: 'write',
          mode: 'edit',
          stage: 'draft',
          directShowOnList: true,
          disableOnItem: true,
        },
        moveDown: {
          title: 'Move Down',
          actionModule: 'a-base',
          actionComponent: 'action',
          icon: { f7: '::arrow-down' },
          rightInherit: 'write',
          mode: 'edit',
          stage: 'draft',
          directShowOnList: true,
          disableOnItem: true,
        },
        save: {
          title: 'Save',
          actionModule: 'a-base',
          actionComponent: 'action',
          authorize: false,
          icon: { f7: '::save' },
          rightInherit: 'write',
          mode: 'edit',
          stage: 'draft',
        },
        custom: {
          title: 'Custom',
        },
      },
    },
  };
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

module.exports = {
  'Base(Details)': '基础(明细)',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 251:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          view: {
            small: 'list',
            medium: 'table',
            large: 'table',
          },
          edit: {
            small: 'list',
            medium: 'table',
            large: 'table',
          },
        },
      },
      filter: false,
    },
    layouts: {
      base: {
        blocks: {
          title: {
            component: {
              module: 'a-detail',
              name: 'listLayoutBlockListTitle',
            },
          },
        },
      },
      list: {
        title: 'LayoutList',
        component: {
          module: 'a-detail',
          name: 'listLayoutList',
        },
        blocks: {
          items: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockListItems',
            },
          },
          item: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockListItem',
            },
            options: {
              mapper: {
                media: '_indexTotal', // false/true/_index/_indexTotal/mediaFieldName
              },
            },
          },
        },
      },
      table: {
        title: 'LayoutTable',
        component: {
          module: 'a-detail',
          name: 'listLayoutTable',
        },
        blocks: {
          items: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockTableItems',
            },
            enableTableHeight: false,
            sorter: false,
            columns: [
              {
                dataIndex: 'detailLineNo',
                title: '#',
                align: 'center',
                width: 50,
                component: {
                  module: 'a-detail',
                  name: 'listLayoutTableCellDetailLineNo',
                },
              },
            ],
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Base(Details)',
    atomStaticKey: 'layoutDetailListBase',
    atomRevision: 7,
    description: '',
    layoutTypeCode: 5,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 512:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const layoutDetailListBase = __webpack_require__(251);

module.exports = app => {
  const layouts = [
    //
    layoutDetailListBase(app),
  ];
  return layouts;
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ }),

/***/ 95:
/***/ ((module) => {

module.exports = app => {
  const controllers = {};
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
  // constants
  const constants = __webpack_require__(479)(app);
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
    constants,
    meta,
  };
};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const schemas = __webpack_require__(232)(app);
  const staticLayouts = __webpack_require__(512)(app);
  const meta = {
    base: {
      atoms: {},
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
      },
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
  };
  return meta;
};


/***/ }),

/***/ 374:
/***/ ((module) => {

module.exports = app => {
  class Detail extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDetailBase', options: { disableDeleted: false } });
    }
  }

  return Detail;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const detailBase = __webpack_require__(374);

module.exports = app => {
  const models = {
    detailBase,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [];
  return routes;
};


/***/ }),

/***/ 214:
/***/ ((module) => {

module.exports = app => {
  const services = {};
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