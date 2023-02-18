/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 413:
/***/ ((module) => {

module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // add userOnline
      const res = await this.ctx.model.userOnline.insert({
        atomId: key.atomId,
        userId: item.userId,
      });
      // return key
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      await this._getMeta(item, options);
      // ok
      return item;
    }

    async selectBefore({ atomClass, options, user }) {
      // super
      await super.selectBefore({ atomClass, options, user });
      // orders
      for (const order of options.orders) {
        if (order[0] === 'f.onlineStatus') {
          order[0] = 'f.expireTime';
        }
      }
      // where
      for (const key of Object.keys(options.where)) {
        if (key === 'f.onlineStatus') {
          let clause = options.where[key];
          if (clause.val === 1) {
            // offline
            clause = { op: '<=', val: new Date() };
          } else {
            // online
            clause = { op: '>', val: new Date() };
          }
          delete options.where['f.onlineStatus'];
          options.where['f.expireTime'] = clause;
        }
      }
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        await this._getMeta(item, options);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update userOnline
      const data = await this.ctx.model.userOnline.prepareData(item);
      await this.ctx.model.userOnline.update(data);
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete userOnline
      await this.ctx.model.userOnline.delete({
        id: key.itemId,
      });
    }

    async checkRightAction({ atom, atomClass, action, stage, user, checkFlow }) {
      // super
      const res = await super.checkRightAction({ atom, atomClass, action, stage, user, checkFlow });
      if (!res) return res;
      if (atom.atomStage !== 1) return res;
      if (action !== 101) return res;
      // kickOut
      const item = await this.ctx.model.userOnline.get({ id: atom.itemId });
      if (action === 101 && this._getOnlineStatus(item) === 2) return res;
      return null;
    }

    _getOnlineStatus(item) {
      return item.expireTime <= new Date() ? 1 : 2;
    }

    async _translate(item) {
      item.onlineStatus = this._getOnlineStatus(item);
      const dictItem = await this.ctx.bean.dict.findItem({
        dictKey: 'a-dictbooster:dictOnlineStatus',
        code: item.onlineStatus,
      });
      item._onlineStatusTitle = dictItem.titleFull;
      item._onlineStatusTitleLocale = dictItem.titleLocaleFull;
    }

    async _getMeta(item, options) {
      // layout: list/table/mobile/pc
      const layout = options && options.layout;
      // online status
      await this._translate(item);
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.flags
      if (layout !== 'table' && item.onlineStatus === 2) {
        meta.flags.push(item._onlineStatusTitleLocale);
      }
      // meta.summary
      meta.summary = item.description;
    }
  }

  return Atom;
};


/***/ }),

/***/ 228:
/***/ ((module) => {

module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // add userOnlineHistory
      const res = await this.ctx.model.userOnlineHistory.insert({
        atomId: key.atomId,
      });
      // return key
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(item);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update userOnlineHistory
      const data = await this.ctx.model.userOnlineHistory.prepareData(item);
      await this.ctx.model.userOnlineHistory.update(data);
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete userOnlineHistory
      await this.ctx.model.userOnlineHistory.delete({
        id: key.itemId,
      });
    }

    _getMeta(item) {
      const meta = this._ensureItemMeta(item);
      // meta.flags
      // meta.summary
      meta.summary = item.description;
    }
  }

  return Atom;
};


/***/ }),

/***/ 504:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassUserOnline = {
    module: moduleInfo.relativeName,
    atomClassName: 'userOnline',
  };
  const __atomClassUserOnlineHistory = {
    module: moduleInfo.relativeName,
    atomClassName: 'userOnlineHistory',
  };
  class UserOnline extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'userOnline');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get modelUserOnline() {
      return ctx.model.module(moduleInfo.relativeName).userOnline;
    }

    get configUserOnline() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    get configUserOnlineExpired() {
      return this.configUserOnline.userOnline.expired;
    }

    async register({ user, isLogin }) {
      user = user.agent || user.op;
      // data
      const data = {
        onlineIPLast: ctx.ip,
        onlineTimeLast: new Date(),
        expireTime: this._combineExpireTime(),
      };
      // userOnline
      const res = await this._insertUserOnline({ user, data, isLogin });
      if (res) {
        // userOnlineHistory
        const res2 = await this._insertUserOnlineHistory({ user, data, isLogin });
        Object.assign(res, res2);
      }
      return res;
    }

    async heartBeat({ user }) {
      user = user.agent || user.op;
      const userId = user.id;
      const item = await this.modelUserOnline.get({ userId });
      if (!item) return false;
      if (item.expireTime <= Date.now()) return false;
      // Renewal
      if (item.expireTime - Date.now() < this.configUserOnlineExpired / 2) {
        await this.modelUserOnline.update({
          id: item.id,
          expireTime: this._combineExpireTime(),
        });
      }
      return true;
    }

    async kickOut({ user }) {
      // redis
      await ctx.bean.auth._clearRedisAuthAll({ user });
      // offline
      await this._offline({ user });
      // publish
      await this.sendMessageSystemLogout({ user, type: 'all' });
    }

    async _offline({ user }) {
      const userId = user.id;
      await this.modelUserOnline.update({ expireTime: new Date() }, { where: { userId } });
    }

    async sendMessageSystemLogout({ user, type, provider }) {
      const userId = user.id;
      // content
      const content = {
        code: 401,
        message: 'logout',
        type,
      };
      if (provider) {
        content.provider = provider;
      }
      // send message-system
      const message = {
        userIdTo: userId,
        content,
      };
      ctx.bean.io.publishMessageSystem({ message });
    }

    _combineExpireTime() {
      return new Date(Date.now() + this.configUserOnlineExpired);
    }

    async _insertUserOnline({ user, data, isLogin }) {
      const userId = user.id;
      // check if exists
      let item = await this.modelUserOnline.get({ userId });
      if (!item) {
        //   create
        const atomKey = await ctx.bean.atom.create({
          atomClass: __atomClassUserOnline,
          user,
          item: {
            atomName: user.userName,
            userId,
          },
        });
        item = {
          id: atomKey.itemId,
          loginCount: 0,
          onlineCount: 0,
          expireTime: 0,
        };
      }
      // isLogin
      if (isLogin) {
        data = {
          loginCount: item.loginCount + 1,
          loginIPLast: data.onlineIPLast,
          loginTimeLast: data.onlineTimeLast,
          onlineCount: item.onlineCount + 1,
          ...data,
        };
      } else {
        // check expireTime
        if (item.expireTime > Date.now()) return null;
        data = {
          onlineCount: item.onlineCount + 1,
          ...data,
        };
      }
      // update
      await this.modelUserOnline.update({
        id: item.id,
        ...data,
      });
      // ok
      return {
        userOnlineId: item.id,
      };
    }

    async _insertUserOnlineHistory({ user, data, isLogin }) {
      const userId = user.id;
      //   atomName
      const atomName = user.userName;
      //   create
      const atomKey = await ctx.bean.atom.create({
        atomClass: __atomClassUserOnlineHistory,
        user,
        item: {
          atomName,
        },
      });
      //   write
      await ctx.bean.atom.write({
        key: atomKey,
        item: {
          userId,
          onlineIP: data.onlineIPLast,
          onlineTime: data.onlineTimeLast,
          isLogin,
        },
        options: {
          ignoreValidate: true,
        },
        user,
      });
      // ok
      return {
        userOnlineHistoryId: atomKey.itemId,
      };
    }
  }
  return UserOnline;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // create table: aUserOnline
        let sql = `
          CREATE TABLE aUserOnline (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            loginCount int(11) DEFAULT '0',
            loginIPLast varchar(50) DEFAULT NULL,
            loginTimeLast timestamp DEFAULT NULL,
            onlineCount int(11) DEFAULT '0',
            onlineIPLast varchar(50) DEFAULT NULL,
            onlineTimeLast timestamp DEFAULT NULL,
            expireTime timestamp DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
        // create table: aUserOnlineHistory
        sql = `
          CREATE TABLE aUserOnlineHistory (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            onlineIP varchar(50) DEFAULT NULL,
            onlineTime timestamp DEFAULT NULL,
            isLogin int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        // add role rights
        let roleRights = [
          //
          { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
          // custom
          { roleName: 'system', action: 'kickOut', scopeNames: 'authenticated' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'userOnline', roleRights });
        //
        roleRights = [
          //
          { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'userOnlineHistory', roleRights });
      }
    }

    async test() {}
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const atomUserOnline = __webpack_require__(413);
const atomUserOnlineHistory = __webpack_require__(228);
const beanUserOnline = __webpack_require__(504);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.userOnline': {
      mode: 'app',
      bean: atomUserOnline,
    },
    'atom.userOnlineHistory': {
      mode: 'app',
      bean: atomUserOnlineHistory,
    },
    // global
    userOnline: {
      mode: 'ctx',
      bean: beanUserOnline,
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
  // userOnline
  config.userOnline = {
    expired: 20 * 60 * 1000, // 20 minutes
  };
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

module.exports = {
  ActionKickOut: 'Kick Out',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  ActionKickOut: '下线',
  'Online Users': '在线用户',
  'Online Users(History)': '在线用户（历史）',
  'Users Status': '用户状态',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 694:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      ordersBase: [
        //
        { name: 'onlineStatus', title: 'Status', by: 'desc', tableAlias: 'f', default: true },
      ],
    },
    layouts: {
      table: {
        blocks: {
          items: {
            columns: [
              {
                dataIndex: 'atomName',
                title: 'Username',
                align: 'left',
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutTableCellAtomName',
                  options: {
                    props: {
                      mapper: {
                        avatar: true,
                      },
                    },
                  },
                },
              },
              {
                dataIndex: 'onlineStatus',
                title: 'Status',
                align: 'left',
                params: {
                  computed: {
                    expression: 'record._onlineStatusTitleLocale',
                  },
                },
              },
              {
                dataIndex: 'loginCount',
                title: 'LoginCount',
                align: 'left',
              },
              {
                dataIndex: 'onlineCount',
                title: 'OnlineCount',
                align: 'left',
              },
              {
                dataIndex: 'onlineIPLast',
                title: 'OnlineIPLast',
                align: 'left',
              },
              {
                dataIndex: 'onlineTimeLast',
                title: 'OnlineTimeLast',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
            ],
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Online Users',
    atomStaticKey: 'layoutAtomListUserOnline',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 512:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const layoutAtomListUserOnline = __webpack_require__(694);

module.exports = app => {
  const layouts = [layoutAtomListUserOnline(app)];
  return layouts;
};


/***/ }),

/***/ 429:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    // {
    //   atomName: 'Create UserOnline',
    //   atomStaticKey: 'createUserOnline',
    //   atomRevision: 0,
    //   atomCategoryId: 'a-base:menu.Create',
    //   resourceType: 'a-base:menu',
    //   resourceConfig: JSON.stringify({
    //     module: moduleInfo.relativeName,
    //     atomClassName: 'userOnline',
    //     atomAction: 'create',
    //   }),
    //   resourceRoles: 'authenticated',
    // },
    {
      atomName: 'Users Status',
      atomStaticKey: 'listUserStatus',
      atomRevision: 1,
      atomCategoryId: 'a-base:menu.Tools',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'userOnline',
        atomAction: 'read',
      }),
      resourceIcon: '::people',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
    // {
    //   atomName: 'Online Users(History)',
    //   atomStaticKey: 'listUserOnlineHistory',
    //   atomRevision: 0,
    //   atomCategoryId: 'a-base:menu.List',
    //   resourceType: 'a-base:menu',
    //   resourceConfig: JSON.stringify({
    //     module: moduleInfo.relativeName,
    //     atomClassName: 'userOnlineHistory',
    //     atomAction: 'read',
    //   }),
    //   resourceRoles: 'template.system',
    // },
  ];
  return resources;
};


/***/ }),

/***/ 977:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // userOnline
  schemas.userOnline = {
    type: 'object',
    properties: {
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        notEmpty: true,
      },
      onlineStatus: {
        type: 'number',
        ebType: 'dict',
        ebTitle: 'Status',
        ebParams: {
          dictKey: 'a-dictbooster:dictOnlineStatus',
          mode: 'select',
        },
      },
      // Online Info
      __groupOnlineInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Online Info',
      },
      loginCount: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'LoginCount',
      },
      onlineCount: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'OnlineCount',
      },
      onlineIPLast: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'OnlineIPLast',
      },
      onlineTimeLast: {
        type: ['object', 'null'],
        ebType: 'text',
        ebTitle: 'OnlineTimeLast',
        ebParams: {
          dateFormat: true,
        },
      },
    },
  };
  // userOnline search
  schemas.userOnlineSearch = {
    type: 'object',
    properties: {
      onlineStatus: {
        type: 'number',
        ebType: 'dict',
        ebTitle: 'Status',
        ebParams: {
          dictKey: 'a-dictbooster:dictOnlineStatus',
          mode: 'select',
        },
        ebOptionsBlankAuto: true,
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 808:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // userOnlineHistory
  schemas.userOnlineHistory = {
    type: 'object',
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  // userOnlineHistory search
  schemas.userOnlineHistorySearch = {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const userOnline = __webpack_require__(977);
const userOnlineHistory = __webpack_require__(808);

module.exports = app => {
  const schemas = {};
  // userOnline
  Object.assign(schemas, userOnline(app));
  // userOnlineHistory
  Object.assign(schemas, userOnlineHistory(app));
  // ok
  return schemas;
};


/***/ }),

/***/ 339:
/***/ ((module) => {

module.exports = app => {
  class userOnlineController extends app.Controller {
    async kickOut() {
      const res = await this.ctx.service.userOnline.kickOut({
        key: this.ctx.request.body.key,
        // user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }

  return userOnlineController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const userOnline = __webpack_require__(339);

module.exports = app => {
  const controllers = {
    userOnline,
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
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  // schemas
  const schemas = __webpack_require__(232)(app);
  // static
  const staticLayouts = __webpack_require__(512)(app);
  const staticResources = __webpack_require__(429)(app);
  // meta
  const meta = {
    base: {
      atoms: {
        userOnline: {
          info: {
            bean: 'userOnline',
            title: 'Online Users',
            tableName: 'aUserOnline',
            language: false,
            category: false,
            tag: false,
            simple: true,
            history: false,
            inner: true,
            comment: false,
            attachment: false,
            layout: {
              config: {
                atomList: 'layoutAtomListUserOnline',
              },
            },
          },
          actions: {
            kickOut: {
              code: 101,
              title: 'ActionKickOut',
              actionModule: moduleInfo.relativeName,
              actionComponent: 'action',
              icon: { f7: ':outline:log-out-outline' },
              // enableOnOpened: true,
              stage: 'formal',
            },
          },
          validator: 'userOnline',
          search: {
            validator: 'userOnlineSearch',
          },
        },
        userOnlineHistory: {
          info: {
            bean: 'userOnlineHistory',
            title: 'Online Users(History)',
            tableName: 'aUserOnlineHistory',
            language: false,
            category: false,
            tag: false,
            simple: true,
            history: false,
            inner: true,
            comment: false,
            attachment: false,
          },
          actions: {},
          validator: 'userOnlineHistory',
          search: {
            validator: 'userOnlineHistorySearch',
          },
        },
      },
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {
        userOnline: {
          schemas: 'userOnline',
        },
        userOnlineSearch: {
          schemas: 'userOnlineSearch',
        },
        userOnlineHistory: {
          schemas: 'userOnlineHistory',
        },
        userOnlineHistorySearch: {
          schemas: 'userOnlineHistorySearch',
        },
      },
      keywords: {},
      schemas,
    },
    index: {
      indexes: {
        aUserOnline: 'createdAt,updatedAt,atomId,userId,onlineTimeLast,expireTime',
        aUserOnlineHistory: 'createdAt,updatedAt,atomId,userId,onlineTime',
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 130:
/***/ ((module) => {

module.exports = app => {
  class UserOnline extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aUserOnline', options: { disableDeleted: false } });
    }
  }
  return UserOnline;
};


/***/ }),

/***/ 775:
/***/ ((module) => {

module.exports = app => {
  class UserOnlineHistory extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aUserOnlineHistory', options: { disableDeleted: false } });
    }
  }
  return UserOnlineHistory;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const userOnline = __webpack_require__(130);
const userOnlineHistory = __webpack_require__(775);

module.exports = app => {
  const models = {
    userOnline,
    userOnlineHistory,
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
      path: 'userOnline/kickOut',
      controller: 'userOnline',
      meta: { right: { type: 'atom', atomClass: 'a-useronline:userOnline', action: 'kickOut' } },
    },
  ];
  return routes;
};


/***/ }),

/***/ 83:
/***/ ((module) => {

module.exports = app => {
  class userOnline extends app.Service {
    async kickOut({ key }) {
      const item = await this.ctx.model.userOnline.get({ id: key.itemId });
      const user = { id: item.userId };
      await this.ctx.bean.userOnline.kickOut({ user });
    }
  }

  return userOnline;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const userOnline = __webpack_require__(83);

module.exports = app => {
  const services = {
    userOnline,
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