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

// eslint-disable-next-line
module.exports = app => {

  // routes
  const routes = __webpack_require__(7)(app);
  // services
  const services = __webpack_require__(15)(app);
  // models
  const models = __webpack_require__(22)(app);
  // meta
  const meta = __webpack_require__(24)(app);

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
  'Basic Admin': '基础管理',
  'User Management': '用户管理',
  'Role Management': '角色管理',
  'Atom Right Management': '原子权限管理',
  'Menu Right Management': '菜单权限管理',
  'Function Right Management': '功能权限管理',
  'Auth Management': '认证管理',
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
const role = __webpack_require__(9);
const user = __webpack_require__(10);
const atomRight = __webpack_require__(11);
const menuRight = __webpack_require__(12);
const functionRight = __webpack_require__(13);
const auth = __webpack_require__(14);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    // role
    { method: 'post', path: 'role/children', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/item', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/save', controller: role, middlewares: 'validate',
      meta: { validate: { validator: 'role' }, right: { type: 'function', name: 'role' } },
    },
    { method: 'post', path: 'role/add', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/move', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/delete', controller: role, middlewares: 'transaction', meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/includes', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/addRoleInc', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/removeRoleInc', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/dirty', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/build', controller: role, middlewares: 'progress', meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/buildInBackground', controller: role, middlewares: 'inner,progress', meta: { auth: { enable: false } } },
    // user
    { method: 'post', path: 'user/list', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/item', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/disable', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/delete', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/roles', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/addRole', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/removeRole', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/atomRights', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/functionRights', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    // atomRight
    { method: 'post', path: 'atomRight/rights', controller: atomRight, meta: { right: { type: 'function', name: 'atomRight' } } },
    { method: 'post', path: 'atomRight/add', controller: atomRight, meta: { right: { type: 'function', name: 'atomRight' } } },
    { method: 'post', path: 'atomRight/delete', controller: atomRight, meta: { right: { type: 'function', name: 'atomRight' } } },
    { method: 'post', path: 'atomRight/spreads', controller: atomRight, meta: { right: { type: 'function', name: 'atomRight' } } },
    // menuRight
    { method: 'post', path: 'menuRight/rights', controller: menuRight, meta: { right: { type: 'function', name: 'menuRight' } } },
    { method: 'post', path: 'menuRight/add', controller: menuRight, meta: { right: { type: 'function', name: 'menuRight' } } },
    { method: 'post', path: 'menuRight/delete', controller: menuRight, meta: { right: { type: 'function', name: 'menuRight' } } },
    { method: 'post', path: 'menuRight/spreads', controller: menuRight, meta: { right: { type: 'function', name: 'menuRight' } } },
    // functionRight
    { method: 'post', path: 'functionRight/rights', controller: functionRight, meta: { right: { type: 'function', name: 'functionRight' } } },
    { method: 'post', path: 'functionRight/add', controller: functionRight, meta: { right: { type: 'function', name: 'functionRight' } } },
    { method: 'post', path: 'functionRight/delete', controller: functionRight, meta: { right: { type: 'function', name: 'functionRight' } } },
    { method: 'post', path: 'functionRight/spreads', controller: functionRight, meta: { right: { type: 'function', name: 'functionRight' } } },
    // auth
    { method: 'post', path: 'auth/list', controller: auth, meta: { right: { type: 'function', name: 'auth' } } },
    { method: 'post', path: 'auth/disable', controller: auth, meta: { right: { type: 'function', name: 'auth' } } },
    { method: 'post', path: 'auth/item', controller: auth, meta: { right: { type: 'function', name: 'auth' } } },
    { method: 'post', path: 'auth/save', controller: auth, meta: { right: { type: 'function', name: 'auth' } } },
  ];
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

  }
  return VersionController;
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

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
      await this.service.role.save({
        roleId: this.ctx.request.body.roleId,
        data: this.ctx.request.body.data,
      });
      this.ctx.success();
    }

    async add() {
      const res = await this.service.role.add({
        roleIdParent: this.ctx.request.body.roleIdParent,
        catalog: this.ctx.request.body.catalog,
      });
      this.ctx.success(res);
    }

    async move() {
      const res = await this.service.role.move({
        roleId: this.ctx.request.body.roleId,
        roleIdParent: this.ctx.request.body.roleIdParent,
      });
      this.ctx.success(res);
    }

    async delete() {
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
      const res = await this.service.role.addRoleInc({
        roleId: this.ctx.request.body.roleId,
        roleIdInc: this.ctx.request.body.roleIdInc,
      });
      this.ctx.success(res);
    }

    async removeRoleInc() {
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
      const res = await this.service.role.build();
      this.ctx.success(res);
    }

    async buildInBackground() {
      const res = await this.service.role.buildInBackground({
        progressId: this.ctx.request.body.progressId,
      });
      this.ctx.success(res);
    }


  }
  return RoleController;
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = app => {
  class UserController extends app.Controller {

    async list() {
      const page = this.ctx.meta.util.page(this.ctx.request.body.page);
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
      const res = await this.service.user.disable({
        userId: this.ctx.request.body.userId,
        disabled: this.ctx.request.body.disabled,
      });
      this.ctx.success(res);
    }

    async delete() {
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
      const res = await this.service.user.addRole({
        userId: this.ctx.request.body.userId,
        roleId: this.ctx.request.body.roleId,
      });
      this.ctx.success(res);
    }

    async removeRole() {
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

    async functionRights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.user.functionRights({
        menu: this.ctx.request.body.menu,
        userId: this.ctx.request.body.userId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

  }
  return UserController;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

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
/* 12 */
/***/ (function(module, exports) {

module.exports = app => {
  class MenuRightController extends app.Controller {

    async rights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.functionRight.rights({
        menu: 1,
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async add() {
      const res = await this.service.functionRight.add({
        roleId: this.ctx.request.body.roleId,
        module: this.ctx.request.body.module,
        name: this.ctx.request.body.name,
      });
      this.ctx.success(res);
    }

    async delete() {
      const res = await this.service.functionRight.delete({
        id: this.ctx.request.body.id,
      });
      this.ctx.success(res);
    }

    async spreads() {
      const page = this.ctx.request.body.page;
      const items = await this.service.functionRight.spreads({
        menu: 1,
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

  }
  return MenuRightController;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = app => {
  class FunctionRightController extends app.Controller {

    async rights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.functionRight.rights({
        menu: 0,
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async add() {
      const res = await this.service.functionRight.add({
        roleId: this.ctx.request.body.roleId,
        module: this.ctx.request.body.module,
        name: this.ctx.request.body.name,
      });
      this.ctx.success(res);
    }

    async delete() {
      const res = await this.service.functionRight.delete({
        id: this.ctx.request.body.id,
      });
      this.ctx.success(res);
    }

    async spreads() {
      const page = this.ctx.request.body.page;
      const items = await this.service.functionRight.spreads({
        menu: 0,
        roleId: this.ctx.request.body.roleId,
        page,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

  }
  return FunctionRightController;
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {
  class AuthController extends app.Controller {

    async list() {
      const res = await this.service.auth.list();
      this.ctx.success(res);
    }

    async disable() {
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(16);
const role = __webpack_require__(17);
const user = __webpack_require__(18);
const atomRight = __webpack_require__(19);
const functionRight = __webpack_require__(20);
const auth = __webpack_require__(21);

module.exports = app => {
  const services = {
    version,
    role,
    user,
    atomRight,
    functionRight,
    auth,
  };
  return services;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
      }
    }

    async init(options) {
      if (options.version === 1) {
        // roleFunctions
        const roleFunctions = [
          { roleName: 'system', name: 'user' },
          { roleName: 'system', name: 'role' },
          { roleName: 'system', name: 'atomRight' },
          { roleName: 'system', name: 'menuRight' },
          { roleName: 'system', name: 'functionRight' },
          { roleName: 'system', name: 'auth' },
        ];
        await this.ctx.meta.role.addRoleFunctionBatch({ roleFunctions });
      }
    }

  }

  return Version;
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = app => {

  class Role extends app.Service {

    async children({ roleId, page }) {
      return await this.ctx.meta.role.children({ roleId, page });
    }

    async item({ roleId }) {
      return await this.ctx.meta.role.get({ id: roleId });
    }

    async save({ roleId, data }) {
      return await this.ctx.meta.role.save({ roleId, data });
    }

    async add({ roleIdParent, catalog }) {
      return await this.ctx.meta.role.add({ roleIdParent, catalog });
    }

    async move({ roleId, roleIdParent }) {
      return await this.ctx.meta.role.move({ roleId, roleIdParent });
    }

    async delete({ roleId }) {
      return await this.ctx.meta.role.delete({ roleId });
    }

    async includes({ roleId, page }) {
      return await this.ctx.meta.role.includes({ roleId, page });
    }

    async addRoleInc({ roleId, roleIdInc }) {
      return await this.ctx.meta.role.addRoleInc({ roleId, roleIdInc });
    }

    async removeRoleInc({ id }) {
      return await this.ctx.meta.role.removeRoleInc({ id });
    }

    async dirty() {
      return await this.ctx.meta.role.getDirty();
    }

    async build() {
      const progressId = await this.ctx.meta.progress.create();
      this.ctx.performActionInBackground({
        method: 'post',
        url: 'role/buildInBackground',
        body: {
          progressId,
        },
      });
      return { progressId };
    }

    async buildInBackground({ progressId }) {
      return await this.ctx.meta.role.build({ progressId });
    }

  }

  return Role;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = app => {

  class User extends app.Service {

    async list({ roleId, query, anonymous, page }) {
      return await this.ctx.meta.user.list({ roleId, query, anonymous, page });
    }

    async item({ userId }) {
      return await this.ctx.meta.user.get({ id: userId });
    }

    async disable({ userId, disabled }) {
      return await this.ctx.meta.user.disable({ userId, disabled });
    }

    async delete({ userId }) {
      return await this.ctx.meta.user.delete({ userId });
    }

    async roles({ userId, page }) {
      return await this.ctx.meta.user.roles({ userId, page });
    }

    async addRole({ userId, roleId }) {
      return await this.ctx.meta.role.addUserRole({ userId, roleId });
    }

    async removeRole({ id }) {
      return await this.ctx.meta.role.deleteUserRole({ id });
    }

    async atomRights({ userId, page }) {
      return await this.ctx.meta.role.atomRightsOfUser({ userId, page });
    }

    async functionRights({ menu, userId, page }) {
      return await this.ctx.meta.role.functionRightsOfUser({ menu, userId, page });
    }


  }

  return User;
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomRight extends app.Service {

    async rights({ roleId, page }) {
      return await this.ctx.meta.role.roleRights({ roleId, page });
    }

    async add({ roleId, atomClass, actionCode, scopeSelf, scope }) {
      const _atomClass = await this.ctx.meta.atomClass.get(atomClass);
      if (actionCode === 1 || ((actionCode === 3 || actionCode === 4) && scopeSelf)) scope = 0;
      return await this.ctx.meta.role.addRoleRight({
        roleId,
        atomClassId: _atomClass.id,
        action: actionCode,
        scope,
      });
    }

    async delete({ id }) {
      return await this.ctx.meta.role.deleteRoleRight({ id });
    }

    async spreads({ roleId, page }) {
      return await this.ctx.meta.role.roleSpreads({ roleId, page });
    }

  }

  return AtomRight;
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = app => {

  class FunctionRight extends app.Service {

    async rights({ menu, roleId, page }) {
      return await this.ctx.meta.role.functionRights({ menu, roleId, page });
    }

    async add({ roleId, module, name }) {
      const func = await this.ctx.meta.function.get({ module, name });
      if (func.autoRight) {
        return await this.ctx.meta.role.addRoleRight({
          roleId,
          atomClassId: func.atomClassId,
          action: func.action,
          scope: 0,
        });
      }
      return await this.ctx.meta.role.addRoleFunction({
        roleId,
        functionId: func.id,
        roleRightId: 0,
      });
    }

    async delete({ id }) {
      const sql = `
        select a.*,b.* from aRoleFunction a 
          left join aFunction b on a.functionId=b.id 
            where a.iid=? and a.id=?
      `;
      const roleFunction = await this.ctx.model.queryOne(sql, [ this.ctx.instance.id, id ]);
      if (roleFunction.autoRight) {
        return await this.ctx.meta.role.deleteRoleRight({ id: roleFunction.roleRightId });
      }
      return await this.ctx.meta.role.deleteRoleFunction({ id });
    }

    async spreads({ menu, roleId, page }) {
      return await this.ctx.meta.role.functionSpreads({ menu, roleId, page });
    }

  }

  return FunctionRight;
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const mparse = require3('egg-born-mparse').default;

module.exports = app => {

  class Auth extends app.Service {

    async list() {
      // list
      const list = await this.ctx.model.authProvider.select();
      // meta
      const authProviders = this.ctx.meta.base.authProviders();
      for (const item of list) {
        const key = `${item.module}:${item.providerName}`;
        const authProvider = authProviders[key];
        item.meta = authProvider.meta;
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
      const authProviders = this.ctx.meta.base.authProviders();
      const authProvider = authProviders[`${item.module}:${item.providerName}`];
      if (authProvider.meta.mode === 'redirect') {
        const moduleInfo = mparse.parseInfo(item.module);
        const loginURL = this.ctx.meta.base.getAbsoluteUrl(`/api/${moduleInfo.url}/passport/${item.module}/${item.providerName}`);
        const callbackURL = this.ctx.meta.base.getAbsoluteUrl(`/api/${moduleInfo.url}/passport/${item.module}/${item.providerName}/callback`);
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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const authProvider = __webpack_require__(23);

module.exports = app => {
  const models = {
    authProvider,
  };
  return models;
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = app => {

  class AuthProvider extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAuthProvider', options: { disableDeleted: true } });
    }

  }

  return AuthProvider;
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');

module.exports = app => {
  // schemas
  const schemas = __webpack_require__(25)(app);
  // meta
  const meta = {
    base: {
      functions: {
        user: {
          title: 'User Management',
          scene: 'tools',
          actionPath: 'user/list',
          sorting: 11,
          menu: 1,
        },
        role: {
          title: 'Role Management',
          scene: 'tools',
          actionPath: 'role/list',
          sorting: 12,
          menu: 1,
        },
        atomRight: {
          title: 'Atom Right Management',
          scene: 'tools',
          actionPath: 'atomRight/list',
          sorting: 13,
          menu: 1,
        },
        menuRight: {
          title: 'Menu Right Management',
          scene: 'tools',
          actionPath: 'menuRight/list',
          sorting: 14,
          menu: 1,
        },
        functionRight: {
          title: 'Function Right Management',
          scene: 'tools',
          actionPath: 'functionRight/list',
          sorting: 15,
          menu: 1,
        },
        auth: {
          title: 'Auth Management',
          scene: 'tools',
          actionPath: 'auth/list',
          sorting: 16,
          menu: 1,
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
  };

  return meta;
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

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


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map