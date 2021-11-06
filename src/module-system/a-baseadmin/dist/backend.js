/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // empty
      }
    }

    async init(options) {
      if (options.version === 1) {
        // empty
      }

      if (options.version === 2) {
        // empty
      }

      if (options.version === 3) {
        // empty
      }
    }
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
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

module.exports = {
  'Atom Right Management': 'Data Right Management',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  'Basic Admin': '基础管理',
  'User Management': '用户管理',
  'Role Management': '角色管理',
  'Atom Right Management': '数据权限管理',
  'Resource Right Management': '资源权限管理',
  'Menu Right Management': '菜单权限管理',
  'Function Right Management': '功能权限管理',
  'Auth Management': '认证管理',
  'Menu Management': '菜单管理',
  'Category Management': '目录管理',
  'Tag Management': '标签管理',
  'Select Users': '选择用户',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 429:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // function
    {
      atomName: 'User Management',
      atomStaticKey: 'user',
      atomRevision: 0,
      atomCategoryId: 'a-base:function.Basic',
      resourceType: 'a-base:function',
      resourceConfig: JSON.stringify({
        actionPath: '/a/baseadmin/user/list',
      }),
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Role Management',
      atomStaticKey: 'role',
      atomRevision: 0,
      atomCategoryId: 'a-base:function.Basic',
      resourceType: 'a-base:function',
      resourceConfig: JSON.stringify({
        actionPath: '/a/baseadmin/role/list',
      }),
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Atom Right Management',
      atomStaticKey: 'atomRight',
      atomRevision: 1,
      atomCategoryId: 'a-base:function.Basic',
      resourceType: 'a-base:function',
      resourceConfig: JSON.stringify({
        actionPath: '/a/baseadmin/atomRight/list',
      }),
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Resource Right Management',
      atomStaticKey: 'resourceRight',
      atomRevision: 0,
      atomCategoryId: 'a-base:function.Basic',
      resourceType: 'a-base:function',
      resourceConfig: JSON.stringify({
        actionPath: '/a/baseadmin/resourceRight/list',
      }),
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Auth Management',
      atomStaticKey: 'auth',
      atomRevision: 0,
      atomCategoryId: 'a-base:function.Basic',
      resourceType: 'a-base:function',
      resourceConfig: JSON.stringify({
        actionPath: '/a/baseadmin/auth/list',
      }),
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Category Management',
      atomStaticKey: 'category',
      atomRevision: 0,
      atomCategoryId: 'a-base:function.Basic',
      resourceType: 'a-base:function',
      resourceConfig: JSON.stringify({
        actionPath: '/a/baseadmin/category/management',
      }),
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Tag Management',
      atomStaticKey: 'tag',
      atomRevision: 0,
      atomCategoryId: 'a-base:function.Basic',
      resourceType: 'a-base:function',
      resourceConfig: JSON.stringify({
        actionPath: '/a/baseadmin/tag/management',
      }),
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Select Users',
      atomStaticKey: 'selectUsers',
      atomRevision: 0,
      atomCategoryId: 'a-base:function.Basic',
      resourceType: 'a-base:function',
      resourceConfig: JSON.stringify({}),
      resourceRoles: 'template.system',
    },
  ];
  return resources;
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // role
  schemas.role = {
    type: 'object',
    properties: {
      roleName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Role name',
        notEmpty: true,
      },
      leader: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'Leader',
      },
      sorting: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Sorting',
      },
    },
  };
  // auth
  schemas.auth = {
    type: 'object',
    properties: {
      clientID: {
        type: 'string',
        ebType: 'text',
      },
      clientSecret: {
        type: 'string',
        ebType: 'text',
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 457:
/***/ ((module) => {

module.exports = app => {
  class AtomRightController extends app.Controller {
    async rights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.atomRight.rights({
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async add() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.atomRight.add({
        roleId: this.ctx.request.body.roleId,
        atomClass: this.ctx.request.body.atomClass,
        actionCode: this.ctx.request.body.actionCode,
        scopeSelf: this.ctx.request.body.scopeSelf,
        scope: this.ctx.request.body.scope,
      });
      this.ctx.success(res);
    }

    async delete() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.atomRight.delete({
        id: this.ctx.request.body.id,
      });
      this.ctx.success(res);
    }

    async spreads() {
      const page = this.ctx.request.body.page;
      const items = await this.service.atomRight.spreads({
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }
  }
  return AtomRightController;
};


/***/ }),

/***/ 523:
/***/ ((module) => {

module.exports = app => {
  class AuthController extends app.Controller {
    async list() {
      const res = await this.service.auth.list();
      this.ctx.success(res);
    }

    async disable() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.auth.disable({
        id: this.ctx.request.body.id,
        disabled: this.ctx.request.body.disabled,
      });
      this.ctx.success(res);
    }

    async item() {
      const res = await this.service.auth.item({
        id: this.ctx.request.body.id,
      });
      this.ctx.success(res);
    }

    async save() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.auth.save({
        id: this.ctx.request.body.id,
        config: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }
  }
  return AuthController;
};


/***/ }),

/***/ 595:
/***/ ((module) => {

module.exports = app => {
  class ResourceRightController extends app.Controller {
    async rights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.resourceRight.rights({
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async add() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.resourceRight.add({
        roleId: this.ctx.request.body.roleId,
        atomIds: this.ctx.request.body.atomIds,
      });
      this.ctx.success(res);
    }

    async delete() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.resourceRight.delete({
        id: this.ctx.request.body.id,
      });
      this.ctx.success(res);
    }

    async spreads() {
      const page = this.ctx.request.body.page;
      const items = await this.service.resourceRight.spreads({
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }
  }
  return ResourceRightController;
};


/***/ }),

/***/ 479:
/***/ ((module) => {

module.exports = app => {
  class RoleController extends app.Controller {
    async children() {
      const page = this.ctx.request.body.page;
      const items = await this.service.role.children({
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async item() {
      const res = await this.service.role.item({
        roleId: this.ctx.request.body.roleId,
      });
      this.ctx.success(res);
    }

    async save() {
      // check demo
      this.ctx.bean.util.checkDemo();
      await this.service.role.save({
        roleId: this.ctx.request.body.roleId,
        data: this.ctx.request.body.data,
      });
      this.ctx.success();
    }

    async add() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.add({
        roleIdParent: this.ctx.request.body.roleIdParent,
      });
      this.ctx.success(res);
    }

    async move() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.move({
        roleId: this.ctx.request.body.roleId,
        roleIdParent: this.ctx.request.body.roleIdParent,
      });
      this.ctx.success(res);
    }

    async delete() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.delete({
        roleId: this.ctx.request.body.roleId,
      });
      this.ctx.success(res);
    }

    async includes() {
      const page = this.ctx.request.body.page;
      const items = await this.service.role.includes({
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async addRoleInc() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.addRoleInc({
        roleId: this.ctx.request.body.roleId,
        roleIdInc: this.ctx.request.body.roleIdInc,
      });
      this.ctx.success(res);
    }

    async removeRoleInc() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.removeRoleInc({
        id: this.ctx.request.body.id,
      });
      this.ctx.success(res);
    }

    async dirty() {
      const res = await this.service.role.dirty();
      this.ctx.success(res);
    }

    async build() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.build();
      this.ctx.success(res);
    }
  }
  return RoleController;
};


/***/ }),

/***/ 37:
/***/ ((module) => {

module.exports = app => {
  class UserController extends app.Controller {
    async select() {
      const page = this.ctx.bean.util.page(this.ctx.request.body.page);
      const items = await this.service.user.select({
        query: this.ctx.request.body.query,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async list() {
      const page = this.ctx.bean.util.page(this.ctx.request.body.page);
      const items = await this.service.user.list({
        roleId: this.ctx.request.body.roleId,
        query: this.ctx.request.body.query,
        anonymous: this.ctx.request.body.anonymous,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async item() {
      const res = await this.service.user.item({
        userId: this.ctx.request.body.userId,
      });
      this.ctx.success(res);
    }

    async disable() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.disable({
        userId: this.ctx.request.body.userId,
        disabled: this.ctx.request.body.disabled,
      });
      this.ctx.success(res);
    }

    async delete() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.delete({
        userId: this.ctx.request.body.userId,
      });
      this.ctx.success(res);
    }

    async roles() {
      const page = this.ctx.request.body.page;
      const items = await this.service.user.roles({
        userId: this.ctx.request.body.userId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async addRole() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.addRole({
        userId: this.ctx.request.body.userId,
        roleId: this.ctx.request.body.roleId,
      });
      this.ctx.success(res);
    }

    async removeRole() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.removeRole({
        id: this.ctx.request.body.id,
      });
      this.ctx.success(res);
    }

    async atomRights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.user.atomRights({
        userId: this.ctx.request.body.userId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async resourceRights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.user.resourceRights({
        userId: this.ctx.request.body.userId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }
  }
  return UserController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const role = __webpack_require__(479);
const user = __webpack_require__(37);
const atomRight = __webpack_require__(457);
const resourceRight = __webpack_require__(595);
const auth = __webpack_require__(523);

module.exports = app => {
  const controllers = {
    role,
    user,
    atomRight,
    resourceRight,
    auth,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

// eslint-disable-next-line
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
  // schemas
  const schemas = __webpack_require__(232)(app);
  // static
  const staticResources = __webpack_require__(429)(app);
  // meta
  const meta = {
    base: {
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {
        role: {
          schemas: 'role',
        },
        auth: {
          schemas: 'auth',
        },
      },
      keywords: {},
      schemas: {
        role: schemas.role,
        auth: schemas.auth,
      },
    },
    settings: {
      instance: {
        actionPath: 'settings/list',
      },
    },
  };

  return meta;
};


/***/ }),

/***/ 842:
/***/ ((module) => {

module.exports = app => {
  class AuthProvider extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aAuthProvider', options: { disableDeleted: true } });
    }
  }

  return AuthProvider;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const authProvider = __webpack_require__(842);

module.exports = app => {
  const models = {
    authProvider,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // role
    {
      method: 'post',
      path: 'role/children',
      controller: 'role',
      meta: { right: { type: 'resource,atom', name: 'role', action: 25 } },
    },
    { method: 'post', path: 'role/item', controller: 'role', meta: { right: { type: 'resource', name: 'role' } } },
    {
      method: 'post',
      path: 'role/save',
      controller: 'role',
      middlewares: 'validate',
      meta: { validate: { validator: 'role' }, right: { type: 'resource', name: 'role' } },
    },
    { method: 'post', path: 'role/add', controller: 'role', meta: { right: { type: 'resource', name: 'role' } } },
    { method: 'post', path: 'role/move', controller: 'role', meta: { right: { type: 'resource', name: 'role' } } },
    {
      method: 'post',
      path: 'role/delete',
      controller: 'role',
      middlewares: 'transaction',
      meta: { right: { type: 'resource', name: 'role' } },
    },
    { method: 'post', path: 'role/includes', controller: 'role', meta: { right: { type: 'resource', name: 'role' } } },
    {
      method: 'post',
      path: 'role/addRoleInc',
      controller: 'role',
      meta: { right: { type: 'resource', name: 'role' } },
    },
    {
      method: 'post',
      path: 'role/removeRoleInc',
      controller: 'role',
      meta: { right: { type: 'resource', name: 'role' } },
    },
    { method: 'post', path: 'role/dirty', controller: 'role', meta: { right: { type: 'resource', name: 'role' } } },
    { method: 'post', path: 'role/build', controller: 'role', meta: { right: { type: 'resource', name: 'role' } } },
    // user
    {
      method: 'post',
      path: 'user/select',
      controller: 'user',
      meta: { right: { type: 'resource', name: 'user,selectUsers' } },
    },
    { method: 'post', path: 'user/list', controller: 'user', meta: { right: { type: 'resource', name: 'user' } } },
    { method: 'post', path: 'user/item', controller: 'user', meta: { right: { type: 'resource', name: 'user' } } },
    { method: 'post', path: 'user/disable', controller: 'user', meta: { right: { type: 'resource', name: 'user' } } },
    { method: 'post', path: 'user/delete', controller: 'user', meta: { right: { type: 'resource', name: 'user' } } },
    { method: 'post', path: 'user/roles', controller: 'user', meta: { right: { type: 'resource', name: 'user' } } },
    { method: 'post', path: 'user/addRole', controller: 'user', meta: { right: { type: 'resource', name: 'user' } } },
    {
      method: 'post',
      path: 'user/removeRole',
      controller: 'user',
      meta: { right: { type: 'resource', name: 'user' } },
    },
    {
      method: 'post',
      path: 'user/atomRights',
      controller: 'user',
      meta: { right: { type: 'resource', name: 'user' } },
    },
    {
      method: 'post',
      path: 'user/resourceRights',
      controller: 'user',
      meta: { right: { type: 'resource', name: 'user' } },
    },
    // atomRight
    {
      method: 'post',
      path: 'atomRight/rights',
      controller: 'atomRight',
      meta: { right: { type: 'resource', name: 'atomRight' } },
    },
    {
      method: 'post',
      path: 'atomRight/add',
      controller: 'atomRight',
      meta: { right: { type: 'resource', name: 'atomRight' } },
    },
    {
      method: 'post',
      path: 'atomRight/delete',
      controller: 'atomRight',
      meta: { right: { type: 'resource', name: 'atomRight' } },
    },
    {
      method: 'post',
      path: 'atomRight/spreads',
      controller: 'atomRight',
      meta: { right: { type: 'resource', name: 'atomRight' } },
    },
    // resourceRight
    {
      method: 'post',
      path: 'resourceRight/rights',
      controller: 'resourceRight',
      meta: { right: { type: 'resource', name: 'resourceRight' } },
    },
    {
      method: 'post',
      path: 'resourceRight/add',
      controller: 'resourceRight',
      meta: { right: { type: 'resource', name: 'resourceRight' } },
    },
    {
      method: 'post',
      path: 'resourceRight/delete',
      controller: 'resourceRight',
      meta: { right: { type: 'resource', name: 'resourceRight' } },
    },
    {
      method: 'post',
      path: 'resourceRight/spreads',
      controller: 'resourceRight',
      meta: { right: { type: 'resource', name: 'resourceRight' } },
    },
    // functionRight
    {
      method: 'post',
      path: 'functionRight/rights',
      controller: 'functionRight',
      meta: { right: { type: 'resource', name: 'functionRight' } },
    },
    {
      method: 'post',
      path: 'functionRight/add',
      controller: 'functionRight',
      meta: { right: { type: 'resource', name: 'functionRight' } },
    },
    {
      method: 'post',
      path: 'functionRight/delete',
      controller: 'functionRight',
      meta: { right: { type: 'resource', name: 'functionRight' } },
    },
    {
      method: 'post',
      path: 'functionRight/spreads',
      controller: 'functionRight',
      meta: { right: { type: 'resource', name: 'functionRight' } },
    },
    // auth
    { method: 'post', path: 'auth/list', controller: 'auth', meta: { right: { type: 'resource', name: 'auth' } } },
    { method: 'post', path: 'auth/disable', controller: 'auth', meta: { right: { type: 'resource', name: 'auth' } } },
    { method: 'post', path: 'auth/item', controller: 'auth', meta: { right: { type: 'resource', name: 'auth' } } },
    { method: 'post', path: 'auth/save', controller: 'auth', meta: { right: { type: 'resource', name: 'auth' } } },
  ];
  return routes;
};


/***/ }),

/***/ 580:
/***/ ((module) => {

module.exports = app => {
  class AtomRight extends app.Service {
    async rights({ roleId, page }) {
      return await this.ctx.bean.role.roleRights({ roleId, page });
    }

    async add({ roleId, atomClass, actionCode, scopeSelf, scope }) {
      const _atomClass = await this.ctx.bean.atomClass.get(atomClass);
      if (scopeSelf) {
        scope = 0;
      }
      return await this.ctx.bean.role.addRoleRight({
        roleId,
        atomClassId: _atomClass.id,
        action: actionCode,
        scope,
      });
    }

    async delete({ id }) {
      return await this.ctx.bean.role.deleteRoleRight({ id });
    }

    async spreads({ roleId, page }) {
      return await this.ctx.bean.role.roleSpreads({ roleId, page });
    }
  }

  return AtomRight;
};


/***/ }),

/***/ 300:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const mparse = require3('egg-born-mparse').default;

module.exports = app => {
  class Auth extends app.Service {
    async list() {
      // list
      const list = await this.ctx.model.authProvider.select();
      // meta
      const authProviders = this.ctx.bean.base.authProviders();
      for (const item of list) {
        const key = `${item.module}:${item.providerName}`;
        const authProvider = authProviders[key];
        item.meta = authProvider ? authProvider.meta : null;
      }
      // ok
      return list;
    }

    async disable({ id, disabled }) {
      // update
      await this.ctx.model.authProvider.update({ id, disabled });
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // broadcast
      this.ctx.app.meta.broadcast.emit({
        subdomain: this.ctx.subdomain,
        module: 'a-base',
        broadcastName: 'authProviderChanged',
        data: {
          module: item.module,
          providerName: item.providerName,
        },
      });
    }

    async item({ id }) {
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // meta
      const authProviders = this.ctx.bean.base.authProviders();
      const authProvider = authProviders[`${item.module}:${item.providerName}`];
      if (authProvider.meta.mode === 'redirect') {
        const moduleInfo = mparse.parseInfo(item.module);
        const loginURL = this.ctx.bean.base.getAbsoluteUrl(
          `/api/${moduleInfo.url}/passport/${item.module}/${item.providerName}`
        );
        const callbackURL = this.ctx.bean.base.getAbsoluteUrl(
          `/api/${moduleInfo.url}/passport/${item.module}/${item.providerName}/callback`
        );
        item._meta = {
          loginURL,
          callbackURL,
        };
      }
      // ok
      return item;
    }

    async save({ id, config }) {
      // update
      await this.ctx.model.authProvider.update({ id, config: JSON.stringify(config) });
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // broadcast
      this.ctx.app.meta.broadcast.emit({
        subdomain: this.ctx.subdomain,
        module: 'a-base',
        broadcastName: 'authProviderChanged',
        data: {
          module: item.module,
          providerName: item.providerName,
        },
      });
    }
  }

  return Auth;
};


/***/ }),

/***/ 510:
/***/ ((module) => {

module.exports = app => {
  class ResourceRight extends app.Service {
    async rights({ roleId, page }) {
      return await this.ctx.bean.resource.resourceRights({ roleId, page });
    }

    async add({ roleId, atomIds }) {
      return await this.ctx.bean.resource.addResourceRoles({ roleId, atomIds });
    }

    async delete({ id }) {
      return await this.ctx.bean.resource.deleteResourceRole({ id });
    }

    async spreads({ roleId, page }) {
      return await this.ctx.bean.resource.resourceSpreads({ roleId, page });
    }
  }

  return ResourceRight;
};


/***/ }),

/***/ 889:
/***/ ((module) => {

module.exports = app => {
  class Role extends app.Service {
    async children({ roleId, page }) {
      return await this.ctx.bean.role.children({ roleId, page });
    }

    async item({ roleId }) {
      return await this.ctx.bean.role.get({ id: roleId });
    }

    async save({ roleId, data }) {
      return await this.ctx.bean.role.save({ roleId, data });
    }

    async add({ roleIdParent }) {
      return await this.ctx.bean.role.add({ roleIdParent });
    }

    async move({ roleId, roleIdParent }) {
      return await this.ctx.bean.role.move({ roleId, roleIdParent });
    }

    async delete({ roleId }) {
      return await this.ctx.bean.role.delete({ roleId });
    }

    async includes({ roleId, page }) {
      return await this.ctx.bean.role.includes({ roleId, page });
    }

    async addRoleInc({ roleId, roleIdInc }) {
      return await this.ctx.bean.role.addRoleInc({ roleId, roleIdInc });
    }

    async removeRoleInc({ id }) {
      return await this.ctx.bean.role.removeRoleInc({ id });
    }

    async dirty() {
      return await this.ctx.bean.role.getDirty();
    }

    async build() {
      const progressId = await this.ctx.bean.progress.create();
      this.ctx.runInBackground(async () => {
        await this._buildInBackground({ progressId });
      });
      return { progressId };
    }

    async _buildInBackground({ progressId }) {
      return await this.ctx.bean.role.build({ progressId });
    }
  }

  return Role;
};


/***/ }),

/***/ 323:
/***/ ((module) => {

module.exports = app => {
  class User extends app.Service {
    async select(params) {
      return await this.ctx.bean.user.selectGeneral({ params });
    }

    async list({ roleId, query, anonymous, page }) {
      return await this.ctx.bean.user.list({ roleId, query, anonymous, page });
    }

    async item({ userId }) {
      return await this.ctx.bean.user.get({ id: userId });
    }

    async disable({ userId, disabled }) {
      return await this.ctx.bean.user.disable({ userId, disabled });
    }

    async delete({ userId }) {
      return await this.ctx.bean.user.delete({ userId });
    }

    async roles({ userId, page }) {
      return await this.ctx.bean.user.roles({ userId, page });
    }

    async addRole({ userId, roleId }) {
      return await this.ctx.bean.role.addUserRole({ userId, roleId });
    }

    async removeRole({ id }) {
      return await this.ctx.bean.role.deleteUserRole({ id });
    }

    async atomRights({ userId, page }) {
      return await this.ctx.bean.role.atomRightsOfUser({ userId, page });
    }

    async resourceRights({ userId, page }) {
      return await this.ctx.bean.resource.resourceRightsOfUser({ userId, page });
    }
  }

  return User;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const role = __webpack_require__(889);
const user = __webpack_require__(323);
const atomRight = __webpack_require__(580);
const resourceRight = __webpack_require__(510);
const auth = __webpack_require__(300);

module.exports = app => {
  const services = {
    role,
    user,
    atomRight,
    resourceRight,
    auth,
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