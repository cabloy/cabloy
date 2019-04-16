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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(1);
const locales = __webpack_require__(2);
const errors = __webpack_require__(4);
const middlewares = __webpack_require__(5);

// eslint-disable-next-line
module.exports = app => {

  // routes
  const routes = __webpack_require__(6)(app);
  // services
  const services = __webpack_require__(8)(app);
  // models
  const models = __webpack_require__(10)(app);
  // meta
  const meta = __webpack_require__(11)(app);

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
/* 1 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};
  return config;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(3),
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const user = __webpack_require__(7);

module.exports = app => {
  const routes = [
    // user
    { method: 'post', path: 'user/save', controller: user, middlewares: 'validate',
      meta: { validate: { module: 'a-base', validator: 'user' } },
    },
    { method: 'post', path: 'user/saveAvatar', controller: user },
    { method: 'post', path: 'user/agent', controller: user },
    { method: 'post', path: 'user/agentsBy', controller: user },
    { method: 'post', path: 'user/userByMobile', controller: user },
    { method: 'post', path: 'user/addAgent', controller: user },
    { method: 'post', path: 'user/removeAgent', controller: user },
    { method: 'post', path: 'user/switchAgent', controller: user },
    { method: 'post', path: 'user/switchOffAgent', controller: user },
    { method: 'post', path: 'user/functions', controller: user },
    { method: 'post', path: 'user/authentications', controller: user },
    { method: 'post', path: 'user/authenticationDisable', controller: user },

  ];
  return routes;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {



module.exports = app => {
  class UserController extends app.Controller {

    async save() {
      const res = await this.service.user.save({
        data: this.ctx.request.body.data,
        user: this.ctx.user.agent,
      });
      this.ctx.success(res);
    }

    async saveAvatar() {
      const res = await this.service.user.saveAvatar({
        data: this.ctx.request.body.data,
        user: this.ctx.user.agent,
      });
      this.ctx.success(res);
    }

    async agent() {
      const res = await this.service.user.agent({ userId: this.ctx.user.agent.id });
      this.ctx.success(res);
    }

    async agentsBy() {
      const res = await this.service.user.agentsBy({ userId: this.ctx.user.agent.id });
      this.ctx.success(res);
    }

    async userByMobile() {
      const res = await this.service.user.userByMobile({ mobile: this.ctx.request.body.mobile });
      this.ctx.success(res);
    }

    async addAgent() {
      const res = await this.service.user.addAgent({
        userIdAgent: this.ctx.request.body.userIdAgent,
        userId: this.ctx.user.agent.id,
      });
      this.ctx.success(res);
    }

    async removeAgent() {
      const res = await this.service.user.removeAgent({
        userIdAgent: this.ctx.request.body.userIdAgent,
        userId: this.ctx.user.agent.id,
      });
      this.ctx.success(res);
    }

    async switchAgent() {
      const res = await this.service.user.switchAgent({
        userIdAgent: this.ctx.request.body.userIdAgent,
      });
      this.ctx.success(res);
    }

    async switchOffAgent() {
      const res = await this.service.user.switchOffAgent();
      this.ctx.success(res);
    }

    async authentications() {
      const res = await this.service.user.authentications({
        user: this.ctx.user.agent,
      });
      this.ctx.success(res);
    }

    async authenticationDisable() {
      const res = await this.service.user.authenticationDisable({
        authId: this.ctx.request.body.authId,
        user: this.ctx.user.agent,
      });
      this.ctx.success(res);
    }

    functions() {
      const res = this.service.user.functions();
      this.ctx.success(res);
    }

  }
  return UserController;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const user = __webpack_require__(9);

module.exports = app => {
  const services = {
    user,
  };
  return services;
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

const _functions = {};

module.exports = app => {

  class User extends app.Service {

    async save({ data, user }) {
      // id
      data.id = user.id;
      // readOnly
      delete data.userName;
      delete data.email;
      delete data.mobile;
      // save
      return await this.ctx.meta.user.save({ user: data });
    }

    async saveAvatar({ data, user }) {
      data.id = user.id;
      return await this.ctx.meta.user.save({ user: data });
    }

    async agent({ userId }) {
      return await this.ctx.meta.user.agent({ userId });
    }

    async agentsBy({ userId }) {
      return await this.ctx.meta.user.agentsBy({ userId });
    }

    async userByMobile({ mobile }) {
      return await this.ctx.meta.user.exists({ mobile });
    }

    async addAgent({ userIdAgent, userId }) {
      return await this.ctx.meta.user.addAgent({ userIdAgent, userId });
    }

    async removeAgent({ userIdAgent, userId }) {
      return await this.ctx.meta.user.removeAgent({ userIdAgent, userId });
    }

    async switchAgent({ userIdAgent }) {
      return await this.ctx.meta.user.switchAgent({ userIdAgent });
    }

    async switchOffAgent() {
      return await this.ctx.meta.user.switchOffAgent();
    }

    async authentications({ user }) {
      const sql = `
        select a.id as providerId,a.module,a.providerName,b.id as authId from aAuthProvider a
          left join aAuth b on a.id=b.providerId and b.userId=?
            where a.iid=? and a.disabled=0
      `;
      const list = await this.ctx.model.query(sql, [ user.id, this.ctx.instance.id ]);
      return list;
    }

    async authenticationDisable({ authId, user }) {
      // must use userId in where
      await this.ctx.model.query('delete from aAuth where id=? and userId=?',
        [ authId, user.id ]);
    }

    functions() {
      if (!_functions[this.ctx.locale]) {
        _functions[this.ctx.locale] = this._prepareFunctions();
      }
      return _functions[this.ctx.locale];
    }

    _prepareFunctions() {
      const functions = {};
      for (const relativeName in this.ctx.app.meta.modules) {
        const module = this.ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.user && module.main.meta.user.functions) {
          functions[relativeName] = this._prepareFunctionsModule(module, module.main.meta.user.functions);
        }
      }
      return functions;
    }

    _prepareFunctionsModule(module, _functions) {
      const functions = {};
      for (const key in _functions) {
        const _func = _functions[key];
        const func = {
          name: key,
          title: _func.title || key,
          module: module.info.relativeName,
          actionModule: _func.actionModule || module.info.relativeName,
          actionComponent: _func.actionComponent,
          actionPath: _func.actionPath,
        };
        func.titleLocale = this.ctx.text(func.title);
        functions[key] = func;
      }
      return functions;
    }

  }

  return User;
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = app => {
  const models = {
  };
  return models;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(12);
const extend = require3('extend2');

module.exports = app => {
  // meta
  const meta = {
  };
  return meta;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map