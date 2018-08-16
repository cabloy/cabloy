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
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = app => {

  class Function extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aFunction', options: { disableDeleted: true } });
    }

  }

  return Function;
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomClass extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomClass', options: { disableDeleted: false } });
    }

  }

  return AtomClass;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomAction extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomAction', options: { disableDeleted: false } });
    }

  }

  return AtomAction;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = app => {

  class Atom extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtom', options: { disableDeleted: false } });
    }

  }

  return Atom;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomStar extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomStar', options: { disableDeleted: true } });
    }

  }

  return AtomStar;
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomLabel extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomLabel', options: { disableDeleted: true } });
    }

  }

  return AtomLabel;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomLabelRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomLabelRef', options: { disableDeleted: true } });
    }

  }

  return AtomLabelRef;
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = app => {

  class FunctionStar extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aFunctionStar', options: { disableDeleted: true } });
    }

  }

  return FunctionStar;
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = app => {

  class FunctionLocale extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aFunctionLocale', options: { disableDeleted: true } });
    }

  }

  return FunctionLocale;
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = app => {

  class Role extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRole', options: { disableDeleted: true } });
    }

  }

  return Role;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = app => {

  class RoleInc extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleInc', options: { disableDeleted: true } });
    }

  }

  return RoleInc;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = app => {

  class UserRole extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aUserRole', options: { disableDeleted: true } });
    }

  }

  return UserRole;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = app => {

  class RoleRight extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleRight', options: { disableDeleted: true } });
    }

  }

  return RoleRight;
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {

  class RoleRightRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleRightRef', options: { disableDeleted: true } });
    }

  }

  return RoleRightRef;
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = app => {

  class RoleFunction extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleFunction', options: { disableDeleted: true } });
    }

  }

  return RoleFunction;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = app => {

  class User extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aUser', options: { disableDeleted: false } });
    }

  }

  return User;
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = app => {

  class UserAgent extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aUserAgent', options: { disableDeleted: true } });
    }

  }

  return UserAgent;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = app => {

  class Auth extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAuth', options: { disableDeleted: true } });
    }

  }

  return Auth;
};


/***/ }),
/* 19 */
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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(21);
const locales = __webpack_require__(22);
const errors = __webpack_require__(24);
const middlewares = __webpack_require__(25);
const constants = __webpack_require__(37);

// eslint-disable-next-line
module.exports = app => {

  // routes
  const routes = __webpack_require__(38)(app);
  // services
  const services = __webpack_require__(47)(app);
  // models
  const models = __webpack_require__(61)(app);
  // meta
  const meta = __webpack_require__(65)(app);

  return {
    routes,
    services,
    models,
    config,
    locales,
    errors,
    middlewares,
    constants,
    meta,
  };

};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    base: {
      global: true,
      dependencies: 'instance',
    },
    auth: {
      global: true,
      dependencies: 'base,sequence',
      ignore: /\/version\/(start|check|update|init)/,
    },
    right: {
      global: true,
      dependencies: 'auth,validation',
    },
  };

  // startups
  config.startups = {
    installAuthProviders: {
      type: 'all',
      path: 'auth/installAuthProviders',
    },
    clearFunctionLocales: {
      type: 'worker',
      path: 'function/clearLocales',
    },
  };

  // queues
  config.queues = {
    checkFunctionLocale: {
      path: 'function/checkLocale',
    },
    registerFunction: {
      path: 'function/register',
    },
    registerAtomAction: {
      path: 'atomAction/register',
    },
    registerAtomClass: {
      path: 'atomClass/register',
    },
  };

  // locales
  config.locales = {
    'en-us': 'English',
    'zh-cn': 'Chinese',
  };
  // anonymous
  config.anonymous = {
    maxAge: 365 * 24 * 3600 * 1000, // 365 天
  };
  // registered or rememberMe
  config.registered = {
    maxAge: 1 * 24 * 3600 * 1000, // 1 天
  };
  // checkUserName
  config.checkUserName = false;
  // signupRoleName
  config.signupRoleName = 'registered';

  return config;
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(23),
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = {
  'Element exists': '元素已存在',
  'Element does not exist': '元素不存在',
  'Operation failed': '操作失败',
  'User does not exist': '用户不存在',
  'User is disabled': '用户被禁用',
  'Agent user does not exist': '代理用户不存在',
  'Incomplete information': '信息不完整',
  'Should delete children first': '应该先删除子角色',
  Draft: '草稿',
  Base: '基本',
  English: '英文',
  Chinese: '中文',
  Create: '新建',
  View: '查看',
  Edit: '编辑',
  Delete: '删除',
  Save: '保存',
  Submit: '提交',
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'Element exists',
  1002: 'Element does not exist',
  1003: 'Operation failed',
  1004: 'User does not exist',
  1005: 'User is disabled',
  1006: 'Agent user does not exist',
  1007: 'Incomplete information',
  1008: 'Should delete children first',
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

const base = __webpack_require__(26);
const auth = __webpack_require__(35);
const right = __webpack_require__(36);

module.exports = {
  base,
  auth,
  right,
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// base
const BaseFn = __webpack_require__(27);
const BASE = Symbol('CTX#__BASE');

// atomClass
const AtomClassFn = __webpack_require__(28);
const ATOMCLASS = Symbol('CTX#__ATOMCLASS');

// atomClass
const AtomActionFn = __webpack_require__(29);
const ATOMACTION = Symbol('CTX#__ATOMACTION');

// atom
const AtomFn = __webpack_require__(30);
const ATOM = Symbol('CTX#__ATOM');

// function
const FunctionFn = __webpack_require__(31);
const FUNCTION = Symbol('CTX#__FUNCTION');

// role
const RoleFn = __webpack_require__(32);
const ROLE = Symbol('CTX#__ROLE');

// user
const UserFn = __webpack_require__(33);
const USER = Symbol('CTX#__USER');

// util
const UtilFn = __webpack_require__(34);
const UTIL = Symbol('CTX#__UTIL');

module.exports = () => {
  return async function base(ctx, next) {
    ctx.meta = ctx.meta || {};
    // base
    Object.defineProperty(ctx.meta, 'base', {
      get() {
        if (ctx.meta[BASE] === undefined) {
          ctx.meta[BASE] = new (BaseFn(ctx))();
        }
        return ctx.meta[BASE];
      },
    });
    // atomClass
    Object.defineProperty(ctx.meta, 'atomClass', {
      get() {
        if (ctx.meta[ATOMCLASS] === undefined) {
          ctx.meta[ATOMCLASS] = new (AtomClassFn(ctx))();
        }
        return ctx.meta[ATOMCLASS];
      },
    });
    // atomAction
    Object.defineProperty(ctx.meta, 'atomAction', {
      get() {
        if (ctx.meta[ATOMACTION] === undefined) {
          ctx.meta[ATOMACTION] = new (AtomActionFn(ctx))();
        }
        return ctx.meta[ATOMACTION];
      },
    });
    // atom
    Object.defineProperty(ctx.meta, 'atom', {
      get() {
        if (ctx.meta[ATOM] === undefined) {
          ctx.meta[ATOM] = new (AtomFn(ctx))();
        }
        return ctx.meta[ATOM];
      },
    });
    // function
    Object.defineProperty(ctx.meta, 'function', {
      get() {
        if (ctx.meta[FUNCTION] === undefined) {
          ctx.meta[FUNCTION] = new (FunctionFn(ctx))();
        }
        return ctx.meta[FUNCTION];
      },
    });
    // role
    Object.defineProperty(ctx.meta, 'role', {
      get() {
        if (ctx.meta[ROLE] === undefined) {
          ctx.meta[ROLE] = new (RoleFn(ctx))();
        }
        return ctx.meta[ROLE];
      },
    });
    // user
    Object.defineProperty(ctx.meta, 'user', {
      get() {
        if (ctx.meta[USER] === undefined) {
          ctx.meta[USER] = new (UserFn(ctx))();
        }
        return ctx.meta[USER];
      },
    });
    // util
    Object.defineProperty(ctx.meta, 'util', {
      get() {
        if (ctx.meta[UTIL] === undefined) {
          ctx.meta[UTIL] = new (UtilFn(ctx))();
        }
        return ctx.meta[UTIL];
      },
    });

    // next
    await next();
  };
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

const _modulesLocales = {};
const _locales = {};
const _atomClasses = {};
const _actions = {};
const _flags = {};
const _functions = {};
const _menus = {};

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Base {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's base
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    modules() {
      if (!_modulesLocales[ctx.locale]) {
        _modulesLocales[ctx.locale] = this._prepareModules();
      }
      return _modulesLocales[ctx.locale];
    }

    locales() {
      if (!_locales[ctx.locale]) {
        _locales[ctx.locale] = this._prepareLocales();
      }
      return _locales[ctx.locale];
    }

    atomClasses() {
      if (!_atomClasses[ctx.locale]) {
        _atomClasses[ctx.locale] = this._prepareAtomClasses();
      }
      return _atomClasses[ctx.locale];
    }

    atomClass({ module, atomClassName }) {
      const _atomClasses = this.atomClasses();
      return _atomClasses[module][atomClassName];
    }

    actions() {
      if (!_actions[ctx.locale]) {
        _actions[ctx.locale] = this._prepareActions();
      }
      return _actions[ctx.locale];
    }

    action({ module, atomClassName, code, name }) {
      const _actions = this.actions();
      const actions = _actions[module][atomClassName];
      if (name) return actions[name];
      const key = Object.keys(actions).find(key => actions[key].code === code);
      return actions[key];
    }

    flags() {
      if (!_flags[ctx.locale]) {
        _flags[ctx.locale] = this._prepareFlags();
      }
      return _flags[ctx.locale];
    }

    menus() {
      if (!_menus[ctx.locale]) {
        _menus[ctx.locale] = this._prepareMenus();
      }
      return _menus[ctx.locale];
    }

    functions() {
      if (!_functions[ctx.locale]) {
        _functions[ctx.locale] = this._prepareFunctions();
      }
      return _functions[ctx.locale];
    }

    function({ module, name }) {
      const _functions = this.functions();
      return _functions[module][name];
    }

    functionsAutoRight({ module, atomClassName, action }) {
      const functions = {};
      const _functions = this.functions();
      for (const key in _functions[module]) {
        const _func = _functions[module][key];
        const _action = typeof action === 'string' ? _func.action : ctx.constant.module(moduleInfo.relativeName).atom.action[_func.action];
        if (_func.autoRight && _func.atomClassName === atomClassName && _action === action) {
          functions[key] = _func;
        }
      }
      return functions;
    }

    // inner methods

    _prepareModules() {
      const modules = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        const _module = {
          name: relativeName,
          title: module.package.title || module.info.name,
          description: ctx.text(module.package.description),
          info: module.info,
        };
        _module.titleLocale = ctx.text(_module.title);
        modules[relativeName] = _module;
      }
      return modules;
    }

    _prepareLocales() {
      const locales = [];
      const config = ctx.config.module(moduleInfo.relativeName);
      for (const locale in config.locales) {
        locales.push({
          title: ctx.text(config.locales[locale]),
          value: locale,
        });
      }
      return locales;
    }

    _prepareAtomClasses() {
      const atomClasses = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.atoms) {
          atomClasses[relativeName] = this._prepareAtomClassesModule(module, module.main.meta.base.atoms);
        }
      }
      return atomClasses;
    }

    _prepareAtomClassesModule(module, _atoms) {
      const atomClasses = {};
      for (const key in _atoms) {
        const _atom = _atoms[key].info;
        const atomClass = {
          name: key,
          title: _atom.title || key,
          tableName: _atom.tableName || '',
          public: _atom.public ? 1 : 0,
          flow: _atom.flow ? 1 : 0,
        };
        atomClass.titleLocale = ctx.text(atomClass.title);
        atomClasses[key] = atomClass;
      }
      return atomClasses;
    }

    _prepareFlags() {
      const flags = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.atoms) {
          flags[relativeName] = {};
          for (const atomClassName in module.main.meta.base.atoms) {
            flags[relativeName][atomClassName] = this._prepareFlagsAtomClass(module, module.main.meta.base.atoms[atomClassName]);
          }
        }
      }
      return flags;
    }

    _prepareFlagsAtomClass(module, atomClass) {
      const flags = {};
      const _flags = atomClass.flags;
      for (const key in _flags) {
        const flag = {
          title: _flags[key].title,
        };
        flag.titleLocale = ctx.text(flag.title);
        flags[key] = flag;
      }
      return flags;
    }

    _prepareActions() {
      const actions = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.atoms) {
          actions[relativeName] = {};
          for (const atomClassName in module.main.meta.base.atoms) {
            actions[relativeName][atomClassName] = this._prepareActionsAtomClass(module, module.main.meta.base.atoms[atomClassName]);
          }
        }
      }
      return actions;
    }

    _prepareActionsAtomClass(module, atomClass) {
      const actions = {};
      const _actions = atomClass.actions;
      const _actionsSystem = ctx.constant.module(moduleInfo.relativeName).atom.action;
      const _actionsSystemMeta = ctx.constant.module(moduleInfo.relativeName).atom.actionMeta;
      //  _actionsSystem
      for (const key in _actionsSystem) {
        if (key !== 'custom') {
          const action = {
            code: _actionsSystem[key],
            name: key,
            title: _actionsSystemMeta[key].title,
            flag: (_actions && _actions[key] && _actions[key].flag) || '',
            authorize: _actionsSystemMeta[key].authorize !== false,
          };
          if (_actions && _actions[key] && (_actions[key].actionComponent || _actions[key].actionPath)) {
            // custom
            action.actionModule = _actions[key].actionModule || module.info.relativeName;
            action.actionComponent = _actions[key].actionComponent;
            action.actionPath = _actions[key].actionPath;
          } else {
            // default
            action.actionModule = moduleInfo.relativeName;
            action.actionComponent = _actionsSystemMeta[key].actionComponent;
            action.actionPath = _actionsSystemMeta[key].actionPath;
          }
          action.titleLocale = ctx.text(action.title);
          actions[key] = action;
        }
      }
      //  _actions
      if (_actions) {
        for (const key in _actions) {
          if (!_actionsSystem[key]) {
            const action = {
              code: _actions[key].code,
              name: key,
              title: _actions[key].title || key,
              flag: _actions[key].flag || '',
              actionModule: _actions[key].actionModule || module.info.relativeName,
              actionComponent: _actions[key].actionComponent,
              actionPath: _actions[key].actionPath,
              authorize: _actions[key].authorize !== false,
            };
            if (!_actions[key].actionComponent && !_actions[key].actionPath) {
              // default
              action.actionModule = _actions[key].actionModule || moduleInfo.relativeName;
              action.actionComponent = 'action';
              action.actionPath = '';
            } else {
              // custom
              action.actionModule = _actions[key].actionModule || module.info.relativeName;
              action.actionComponent = _actions[key].actionComponent;
              action.actionPath = _actions[key].actionPath;
            }
            action.titleLocale = ctx.text(action.title);
            actions[key] = action;
          }
        }
      }
      return actions;
    }

    _prepareMenus() {
      const menus = {};
      const functions = this._prepareFunctions();
      for (const relativeName in functions) {
        const functionsModule = functions[relativeName];
        menus[relativeName] = {};
        for (const key in functionsModule) {
          const func = functionsModule[key];
          if (func.menu === 1) {
            menus[relativeName][key] = func;
          }
        }
      }
      return menus;
    }

    _prepareFunctions() {
      const functions = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.functions) {
          functions[relativeName] = this._prepareFunctionsModule(module, module.main.meta.base.functions);
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
          scene: _func.scene,
          autoRight: _func.autoRight || 0,
          atomClassName: _func.atomClassName,
          action: _func.action,
          actionModule: _func.actionModule || module.info.relativeName,
          actionComponent: _func.actionComponent,
          actionPath: _func.actionPath,
          sorting: _func.sorting || 0,
          menu: _func.menu ? 1 : 0,
          public: _func.public ? 1 : 0,
        };
        func.titleLocale = ctx.text(func.title);
        // create
        if (func.action === 'create' && !func.actionComponent && !func.actionPath) {
          func.actionModule = 'a-base';
          func.actionComponent = 'action';
          func.actionPath = '/a/base/atom/edit?atomId={{atomId}}&itemId={{itemId}}&atomClassId={{atomClassId}}&atomClassName={{atomClassName}}&atomClassIdParent={{atomClassIdParent}}';
        }
        // list
        if (func.action === 'read' && !func.actionComponent && !func.actionPath) {
          func.actionPath = '/a/base/atom/list?module={{module}}&atomClassName={{atomClassName}}';
        }
        // ok
        functions[key] = func;
      }
      return functions;
    }

  }

  return Base;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

const modelFn = __webpack_require__(1);

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomClass {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._model = null;
    }

    // other module's atomClass
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get model() {
      if (!this._model) this._model = new (modelFn(ctx.app))(ctx);
      return this._model;
    }

    async atomClass(atomClass) {
      atomClass = await this.top(atomClass);
      return ctx.meta.base.atomClass({ module: atomClass.module, atomClassName: atomClass.atomClassName });
    }

    async top(atomClass) {
      while (true) {
        if (atomClass.atomClassIdParent === 0) break;
        atomClass = await this.get({ id: atomClass.atomClassIdParent });
      }
      return atomClass;
    }

    async get({ id, module, atomClassName, atomClassIdParent = 0 }) {
      module = module || this.moduleName;
      const data = id ? { id } : { module, atomClassName, atomClassIdParent };
      const res = await this.model.get(data);
      if (res) return res;
      if (!module || !atomClassName) throw new Error('Invalid arguments');
      // queue
      return await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'registerAtomClass',
        data: { module, atomClassName, atomClassIdParent },
      });
    }

    async register({ module, atomClassName, atomClassIdParent }) {
      // get
      const res = await this.model.get({ module, atomClassName, atomClassIdParent });
      if (res) return res;
      // data
      const atomClass = ctx.meta.base.atomClass({ module, atomClassName });
      if (!atomClass) throw new Error(`atomClass ${module}:${atomClassName} not found!`);
      const data = {
        module,
        atomClassName,
        atomClassIdParent,
        public: atomClass.public,
        flow: atomClass.flow,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }

    async getByAtomId({ atomId }) {
      const res = await this.model.query(`
        select a.* from aAtomClass a
          left join aAtom b on a.id=b.atomClassId
            where b.iid=? and b.id=?
        `, [ ctx.instance.id, atomId ]);
      return res[0];
    }

    async getTopByAtomId({ atomId }) {
      const atomClass = await this.getByAtomId({ atomId });
      return await this.top(atomClass);
    }

    validator({ module, atomClassName }) {
      const _module = ctx.app.meta.modules[module];
      const validator = _module.main.meta.base.atoms[atomClassName].validator;
      return validator ? {
        module,
        validator,
      } : null;
    }

    validatorSearch({ module, atomClassName }) {
      const _module = ctx.app.meta.modules[module];
      const validator = _module.main.meta.base.atoms[atomClassName].search.validator;
      return validator ? {
        module,
        validator,
      } : null;
    }

  }

  return AtomClass;
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const modelFn = __webpack_require__(2);

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomAction {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._model = null;
    }

    // other module's atomAction
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get model() {
      if (!this._model) this._model = new (modelFn(ctx.app))(ctx);
      return this._model;
    }

    async get({ id, atomClassId, code }) {
      const data = id ? { id } : { atomClassId, code };
      const res = await this.model.get(data);
      if (res) return res;
      // queue
      return await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'registerAtomAction',
        data: { atomClassId, code },
      });
    }

    async getFlagByAtomId({ atomId, code, name }) {
      const atomClass = await ctx.meta.atomClass.getTopByAtomId({ atomId });
      const action = ctx.meta.base.action({ module: atomClass.module, atomClassName: atomClass.atomClassName, code, name });
      return action.flag.toString();
    }

    async register({ atomClassId, code }) {
      // get
      const res = await this.model.get({ atomClassId, code });
      if (res) return res;
      const atomClass = await ctx.meta.atomClass.get({ id: atomClassId });
      const action = ctx.meta.base.action({ module: atomClass.module, atomClassName: atomClass.atomClassName, code });
      const data = {
        atomClassId,
        code,
        name: action.name,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }

  }

  return AtomAction;
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(3);
const mparse = require3('egg-born-mparse').default;
const modelAtomFn = __webpack_require__(4);
const modelAtomStarFn = __webpack_require__(5);
const modelAtomLabelFn = __webpack_require__(6);
const modelAtomLabelRefFn = __webpack_require__(7);

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._atomClass = null;
      this._modelAtom = null;
      this._modelAtomStar = null;
      this._modelAtomLabel = null;
      this._modelAtomLabelRef = null;
      this._sequence = null;
    }

    // other module's atom
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get atomClass() {
      if (!this._atomClass) this._atomClass = ctx.meta.atomClass.module(this.moduleName);
      return this._atomClass;
    }

    get modelAtom() {
      if (!this._modelAtom) this._modelAtom = new (modelAtomFn(ctx.app))(ctx);
      return this._modelAtom;
    }

    get modelAtomStar() {
      if (!this._modelAtomStar) this._modelAtomStar = new (modelAtomStarFn(ctx.app))(ctx);
      return this._modelAtomStar;
    }

    get modelAtomLabel() {
      if (!this._modelAtomLabel) this._modelAtomLabel = new (modelAtomLabelFn(ctx.app))(ctx);
      return this._modelAtomLabel;
    }

    get modelAtomLabelRef() {
      if (!this._modelAtomLabelRef) this._modelAtomLabelRef = new (modelAtomLabelRefFn(ctx.app))(ctx);
      return this._modelAtomLabelRef;
    }

    get sequence() {
      if (!this._sequence) this._sequence = ctx.meta.sequence.module(moduleInfo.relativeName);
      return this._sequence;
    }

    async getAtomClassId({ module, atomClassName, atomClassIdParent = 0 }) {
      const res = await this.atomClass.get({
        module,
        atomClassName,
        atomClassIdParent,
      });
      return res.id;
    }

    // atom and item

    // create
    async create({ atomClass, user }) {
      // sequence
      const sequence = await this.sequence.next('draft');
      // atomClass
      atomClass = await ctx.meta.atomClass.get(atomClass);
      // atom
      const atom = { atomName: `${ctx.text('Draft')}-${sequence}`, atomFlow: atomClass.flow };
      const atomId = await this._add({
        atomClass,
        atom,
        user,
      });

      // add item
      const moduleInfo = mparse.parseInfo(atomClass.module);
      const res = await ctx.performAction({
        method: 'post',
        url: `/${moduleInfo.url}/${atomClass.atomClassName}/create`,
        body: {
          atomClass,
          key: { atomId },
          atom,
          user,
        },
      });
      const itemId = res.itemId;

      // save itemId
      await this._update({
        atom: {
          id: atomId,
          itemId,
          atomFlow: atom.atomFlow, // maybe changed
        },
        user,
      });

      return { atomId, itemId };
    }

    // read
    async read({ key, user }) {
      const atomClass = await ctx.meta.atomClass.getByAtomId({ atomId: key.atomId });
      const _atomClass = await ctx.meta.atomClass.atomClass(atomClass);
      const item = await this._get({
        atom: {
          id: key.atomId,
          tableName: _atomClass.tableName,
        },
        user,
      });
      if (!item) return null;

      // itemId
      key.itemId = item.id;

      // read item
      const moduleInfo = mparse.parseInfo(atomClass.module);
      try {
        await ctx.performAction({
          method: 'post',
          url: `/${moduleInfo.url}/${atomClass.atomClassName}/read`,
          body: {
            atomClass,
            key,
            item,
            user,
          },
        });
      } catch (e) {
        if (e.code !== 404) throw e;
      }

      return item;
    }

    // select
    async select({ atomClass, options, user }) {
      // atomClass
      let _atomClass;
      if (atomClass) {
        atomClass = await ctx.meta.atomClass.get(atomClass);
        _atomClass = await ctx.meta.atomClass.atomClass(atomClass);
      }
      // select
      const items = await this._list({
        tableName: _atomClass ? _atomClass.tableName : '',
        options,
        user,
      });

      // select items
      if (atomClass) {
        const moduleInfo = mparse.parseInfo(atomClass.module);
        try {
          await ctx.performAction({
            method: 'post',
            url: `/${moduleInfo.url}/${atomClass.atomClassName}/select`,
            body: {
              atomClass,
              options,
              items,
              user,
            },
          });
        } catch (e) {
          if (e.code !== 404) throw e;
        }
      }

      return items;
    }

    // write
    async write({ key, item, validation, user }) {
      const atomClass = await ctx.meta.atomClass.getByAtomId({ atomId: key.atomId });
      if (item && item.atomName !== undefined) {
        await this._update({
          atom: {
            id: key.atomId,
            atomName: item.atomName,
          },
          user,
        });
      }

      // write item
      const moduleInfo = mparse.parseInfo(atomClass.module);
      await ctx.performAction({
        method: 'post',
        url: `/${moduleInfo.url}/${atomClass.atomClassName}/write`,
        body: {
          atomClass,
          key,
          item,
          validation,
          user,
        },
      });
    }

    // delete
    async delete({ key, user }) {
      const atomClass = await ctx.meta.atomClass.getByAtomId({ atomId: key.atomId });
      // delete item
      const moduleInfo = mparse.parseInfo(atomClass.module);
      try {
        await ctx.performAction({
          method: 'post',
          url: `/${moduleInfo.url}/${atomClass.atomClassName}/delete`,
          body: {
            atomClass,
            key,
            user,
          },
        });
      } catch (e) {
        if (e.code !== 404) throw e;
      }

      // delete atom and item
      await this._delete({
        atom: {
          id: key.atomId,
        },
        user,
      });
    }

    // action
    async action({ action, key, user }) {
      const atomClass = await ctx.meta.atomClass.getByAtomId({ atomId: key.atomId });
      const moduleInfo = mparse.parseInfo(atomClass.module);
      return await ctx.performAction({
        method: 'post',
        url: `/${moduleInfo.url}/${atomClass.atomClassName}/action`,
        body: {
          action,
          atomClass,
          key,
          user,
        },
      });
    }

    async enable({ key, atom: { atomEnabled = 1 }, user }) {
      const _atom = await this.modelAtom.get({ id: key.atomId });
      if (_atom.atomEnabled === atomEnabled) return;
      // update
      const res = await this.modelAtom.update({
        id: key.atomId,
        atomEnabled,
        userIdUpdated: user.id,
      });
      if (res.affectedRows !== 1) ctx.throw(1003);
      _atom.atomEnabled = atomEnabled;
      // enable item
      const atomClass = await ctx.meta.atomClass.getByAtomId({ atomId: key.atomId });
      const moduleInfo = mparse.parseInfo(atomClass.module);
      try {
        await ctx.performAction({
          method: 'post',
          url: `/${moduleInfo.url}/${atomClass.atomClassName}/enable`,
          body: {
            atomClass,
            key,
            atom: _atom,
            user,
          },
        });
      } catch (e) {
        if (e.code !== 404) throw e;
      }
    }

    // atom other functions

    async flag({ key, atom: { atomFlag }, user }) {
      const res = await this.modelAtom.update({
        id: key.atomId,
        atomFlag,
        userIdUpdated: user.id,
      });
      if (res.affectedRows !== 1) ctx.throw(1003);
    }

    async flow({ key, atom: { atomFlow }, user }) {
      const res = await this.modelAtom.update({
        id: key.atomId,
        atomFlow,
        userIdUpdated: user.id,
      });
      if (res.affectedRows !== 1) ctx.throw(1003);
    }

    async star({ key, atom: { star = 1 }, user }) {
      // force delete
      await this.modelAtomStar.delete({
        userId: user.id,
        atomId: key.atomId,
      });
      // new
      if (star) {
        await this.modelAtomStar.insert({
          userId: user.id,
          atomId: key.atomId,
          star: 1,
        });
      }
    }

    async labels({ key, atom: { labels = null }, user }) {
      // force delete
      await this.modelAtomLabel.delete({
        userId: user.id,
        atomId: key.atomId,
      });
      await this.modelAtomLabelRef.delete({
        userId: user.id,
        atomId: key.atomId,
      });
      // new
      if (labels && labels.length > 0) {
        await this.modelAtomLabel.insert({
          userId: user.id,
          atomId: key.atomId,
          labels: JSON.stringify(labels),
        });
        for (const labelId of labels) {
          await this.modelAtomLabelRef.insert({
            userId: user.id,
            atomId: key.atomId,
            labelId,
          });
        }
      }
    }

    async actions({ key, basic, user }) {
      // atomClass
      const atomClass = await ctx.meta.atomClass.getByAtomId({ atomId: key.atomId });
      // actions
      const _basic = basic ? 'and a.code<100' : '';
      const sql = `
        select a.*,b.module,b.atomClassName from aAtomAction a
          left join aAtomClass b on a.atomClassId=b.id
            where a.iid=? and a.deleted=0 and a.atomClassId=? ${_basic}
              order by a.code asc
      `;
      const actions = await ctx.model.query(sql, [ ctx.instance.id, atomClass.id ]);
      // actions res
      const actionsRes = [];
      const _actionsSystem = ctx.constant.module(moduleInfo.relativeName).atom.action;
      for (const action of actions) {
        if (action.code === _actionsSystem.write || action.code === _actionsSystem.delete) {
          const res = await this.checkRightUpdate({ atom: { id: key.atomId, action: action.code }, user });
          if (res) actionsRes.push(action);
        } else if (action.code > _actionsSystem.custom) {
          const res = await this.checkRightAction({ atom: { id: key.atomId, action: action.code }, user });
          if (res) actionsRes.push(action);
        }
      }
      return actionsRes;
    }

    async schema({ atomClass, schema }) {
      const validator = await this.validator({ atomClass });
      if (!validator) return null;
      const _schema = ctx.meta.validation.getSchema({ module: validator.module, validator: validator.validator, schema });
      return {
        module: validator.module,
        validator: validator.validator,
        schema: _schema,
      };
    }

    async validator({ atomClass: { id } }) {
      let atomClass = await this.atomClass.get({ id });
      atomClass = await this.atomClass.top(atomClass);
      return this.atomClass.validator(atomClass);
    }

    // atom

    async _add({
      atomClass: { id, atomClassName, atomClassIdParent = 0 },
      atom: { itemId, atomName, atomFlag = 0, atomFlow = 0 },
      user,
    }) {
      let atomClassId = id;
      if (!atomClassId) atomClassId = await this.getAtomClassId({ atomClassName, atomClassIdParent });
      const res = await this.modelAtom.insert({
        atomEnabled: 0, // must be enabled by enable
        atomFlag,
        atomFlow,
        itemId,
        atomClassId,
        atomName,
        userIdCreated: user.id,
        userIdUpdated: user.id,
      });
      return res.insertId;
    }

    async _update({
      atom: { id, atomName, itemId },
      user,
    }) {
      const params = { id, userIdUpdated: user.id };
      if (atomName !== undefined) params.atomName = atomName;
      if (itemId !== undefined) params.itemId = itemId;
      const res = await this.modelAtom.update(params);
      if (res.affectedRows !== 1) ctx.throw(1003);
    }

    async _delete({
      atom,
      user,
    }) {
      await this._update({ atom, user });
      await this.modelAtom.delete(atom);
    }

    async _get({
      atom: { id, tableName = '' },
      user,
    }) {
      const res = await ctx.model.query('call aGetAtom(?,?,?,?)',
        [ tableName, id, ctx.instance.id, user.id ]
      );
      return res[0][0];
    }

    async _list({ tableName = '', options: { where, orders, page, star = 0, label = 0 }, user }) {
      page = ctx.meta.util.page(page);

      const _where = ctx.model._where2(where);
      const _orders = ctx.model._orders(orders);
      const _limit = ctx.model._limit(page.size, page.index);

      const res = await ctx.model.query('call aSelectAtoms(?,?,?,?,?,?,?,?)',
        [ tableName, _where, _orders, _limit, ctx.instance.id, user.id, star, label ]
      );
      return res[0];
    }

    // right

    async checkRightRead({
      atom: { id },
      user,
    }) {
      const res = await ctx.model.query('call aCheckRightRead(?,?,?)',
        [ ctx.instance.id, user.id, id ]
      );
      return res[0][0];
    }

    async checkRightUpdate({
      atom: { id, action },
      user,
    }) {
      const actionFlag = await ctx.meta.atomAction.getFlagByAtomId({ atomId: id, code: action });
      const res = await ctx.model.query('call aCheckRightUpdate(?,?,?,?,?)',
        [ ctx.instance.id, user.id, id, action, actionFlag ]
      );
      return res[0][0];
    }

    async checkRightAction({
      atom: { id, action },
      user,
    }) {
      const actionFlag = await ctx.meta.atomAction.getFlagByAtomId({ atomId: id, code: action });
      const res = await ctx.model.query('call aCheckRightAction(?,?,?,?,?)',
        [ ctx.instance.id, user.id, id, action, actionFlag ]
      );
      return res[0][0];
    }

    async checkRightCreate({
      atomClass: { id, module, atomClassName, atomClassIdParent = 0 },
      user,
    }) {
      if (!id) id = await this.getAtomClassId({ module, atomClassName, atomClassIdParent });
      const res = await ctx.model.query('call aCheckRightCreate(?,?,?)',
        [ ctx.instance.id, user.id, id ]
      );
      return res[0][0];
    }

  }

  return Atom;
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const modelFn = __webpack_require__(0);
const modelFunctionStarFn = __webpack_require__(8);
const modelFunctionLocaleFn = __webpack_require__(9);

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Function {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._model = null;
      this._modelFunctionStar = null;
      this._modelFunctionLocale = null;
    }

    // other module's menu
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get model() {
      if (!this._model) this._model = new (modelFn(ctx.app))(ctx);
      return this._model;
    }

    get modelFunctionStar() {
      if (!this._modelFunctionStar) this._modelFunctionStar = new (modelFunctionStarFn(ctx.app))(ctx);
      return this._modelFunctionStar;
    }

    get modelFunctionLocale() {
      if (!this._modelFunctionLocale) this._modelFunctionLocale = new (modelFunctionLocaleFn(ctx.app))(ctx);
      return this._modelFunctionLocale;
    }

    // list
    //   locale maybe '' for selectAllFunctions beside menus
    async list({ options: { where, orders, page, star = 0, locale = '' }, user }) {
      page = ctx.meta.util.page(page);

      const _where = ctx.model._where2(where);
      const _orders = ctx.model._orders(orders);
      const _limit = ctx.model._limit(page.size, page.index);

      // check locale
      if (locale) await this.checkLocale({ locale });

      // select
      const res = await ctx.model.query('call aSelectFunctions(?,?,?,?,?,?,?)',
        [ _where, _orders, _limit, ctx.instance.id, user.id, star, this.model.format('?', locale) ]
      );
      return res[0];
    }

    async star({ id, star = 1, user }) {
      // force delete
      await this.modelFunctionStar.delete({
        userId: user.id,
        functionId: id,
      });
      // new
      if (star) {
        await this.modelFunctionStar.insert({
          userId: user.id,
          functionId: id,
          star: 1,
        });
      }
    }

    async check({ functions, user }) {
      for (const func of functions) {
        const res = await this.checkRightFunction({ function: func, user });
        func.passed = !!res;
      }
      return functions;
    }

    //

    async get({ id, module, name }) {
      if (id) return await this.model.get({ id });
      module = module || this.moduleName;
      const res = await this.model.get({ module, name });
      if (res) return res;
      // queue
      return await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'registerFunction',
        data: { module, name },
      });
    }

    async register({ module, name }) {
      module = module || this.moduleName;
      // get
      const res = await this.model.get({ module, name });
      if (res) return res;
      const func = ctx.meta.base.function({ module, name });
      let atomClassId = 0;
      if (func.atomClassName) {
        const atomClass = await ctx.meta.atomClass.get({ module, atomClassName: func.atomClassName });
        atomClassId = atomClass.id;
      }
      const data = {
        module,
        name: func.name,
        title: func.title,
        scene: ctx.constant.module(moduleInfo.relativeName).function.scene[func.scene],
        autoRight: func.autoRight,
        atomClassId,
        action: func.action ? ctx.constant.module(moduleInfo.relativeName).atom.action[func.action] : 0,
        sorting: func.sorting,
        menu: func.menu,
        public: func.public,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }

    async checkRightFunction({
      function: { module, name },
      user,
    }) {
      const func = await this.get({ module, name });
      const res = await ctx.model.query('call aCheckRightFunction(?,?,?)',
        [ ctx.instance.id, user.id, func.id ]
      );
      return res[0][0];
    }

    async checkLocale({ locale }) {
      locale = locale || ctx.locale;
      const res = await this.model.query('call aCheckFunctionLocales(?,?)',
        [ ctx.instance.id, locale ]);
      if (res[0].length === 0) return;
      // queue
      await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'checkFunctionLocale',
        data: { locale },
      });
    }

    async _checkLocale({ locale }) {
      const res = await this.model.query('call aCheckFunctionLocales(?,?)',
        [ ctx.instance.id, locale ]);
      if (res[0].length === 0) return;
      // insert locales
      for (const menu of res[0]) {
        const titleLocale = ctx.text.locale(locale, menu.title);
        await this.modelFunctionLocale.insert({
          functionId: menu.id,
          locale,
          titleLocale,
        });
      }
    }

    async clearLocales() {
      await this.modelFunctionLocale.delete();
    }

  }

  return Function;
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

const modelFn = __webpack_require__(10);
const modelRoleIncFn = __webpack_require__(11);
const modelUserRoleFn = __webpack_require__(12);
const modelRoleRightFn = __webpack_require__(13);
const modelRoleRightRefFn = __webpack_require__(14);
const modelFunctionFn = __webpack_require__(0);
const modelRoleFunctionFn = __webpack_require__(15);

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Role {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._model = null;
      this._modelRoleInc = null;
      this._modelUserRole = null;
      this._modelRoleRight = null;
      this._modelRoleRightRef = null;
      this._modelFunction = null;
      this._modelRoleFunction = null;
    }

    // other module's role
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get model() {
      if (!this._model) this._model = new (modelFn(ctx.app))(ctx);
      return this._model;
    }

    get modelRoleInc() {
      if (!this._modelRoleInc) this._modelRoleInc = new (modelRoleIncFn(ctx.app))(ctx);
      return this._modelRoleInc;
    }

    get modelUserRole() {
      if (!this._modelUserRole) this._modelUserRole = new (modelUserRoleFn(ctx.app))(ctx);
      return this._modelUserRole;
    }

    get modelRoleRight() {
      if (!this._modelRoleRight) this._modelRoleRight = new (modelRoleRightFn(ctx.app))(ctx);
      return this._modelRoleRight;
    }

    get modelRoleRightRef() {
      if (!this._modelRoleRightRef) this._modelRoleRightRef = new (modelRoleRightRefFn(ctx.app))(ctx);
      return this._modelRoleRightRef;
    }

    get modelFunction() {
      if (!this._modelFunction) this._modelFunction = new (modelFunctionFn(ctx.app))(ctx);
      return this._modelFunction;
    }

    get modelRoleFunction() {
      if (!this._modelRoleFunction) this._modelRoleFunction = new (modelRoleFunctionFn(ctx.app))(ctx);
      return this._modelRoleFunction;
    }

    async get(where) {
      return await this.model.get(where);
    }

    async getSystemRole({ roleName }) {
      return await this.get({
        roleName,
        system: 1,
      });
    }

    // add role
    async add({ roleName = '', leader = 0, catalog = 0, system = 0, sorting = 0, roleIdParent = 0 }) {
      const res = await this.model.insert({
        roleName,
        leader,
        catalog,
        system,
        sorting,
        roleIdParent,
      });
      const roleId = res.insertId;

      // set dirty
      await this.setDirty(true);

      return roleId;
    }

    async move({ roleId, roleIdParent }) {
      // role
      const role = await this.get({ id: roleId });
      if (role.roleIdParent === roleIdParent) return;

      // update
      await this.model.update({ id: roleId, roleIdParent });

      // set dirty
      await this.setDirty(true);
    }

    async delete({ roleId }) {
      // role
      const role = await this.get({ id: roleId });

      // check if system
      if (role.system) ctx.throw(403);
      // check if children
      if (role.catalog) {
        const children = await this.children({ roleId });
        if (children.length > 0) ctx.throw.module(moduleInfo.relativeName, 1008);
      }

      // delete all includes
      await this.modelRoleInc.delete({ roleId });
      await this.modelRoleInc.delete({ roleIdInc: roleId });

      // delete all users
      await this.modelUserRole.delete({ roleId });

      // delete all atom rights
      await this.modelRoleRight.delete({ roleId });
      await this.modelRoleRightRef.delete({ roleId });

      // delete all function rights
      await this.modelRoleFunction.delete({ roleId });

      // delete this
      await this.model.delete({ id: roleId });

      // set dirty
      await this.setDirty(true);
    }

    // add role include
    async addRoleInc({ roleId, roleIdInc }) {
      const res = await this.modelRoleInc.insert({
        roleId,
        roleIdInc,
      });
      const id = res.insertId;

      // set dirty
      await this.setDirty(true);

      return id;
    }

    // remove role include
    async removeRoleInc({ id }) {
      await this.modelRoleInc.delete({ id });

      // set dirty
      await this.setDirty(true);
    }

    // add user role
    async addUserRole({ userId, roleId }) {
      const res = await this.modelUserRole.insert({
        userId,
        roleId,
      });
      return res.insertId;
    }

    async deleteUserRole({ id }) {
      await this.modelUserRole.delete({ id });
    }

    async deleteAllUserRoles({ userId }) {
      await this.modelUserRole.delete({ userId });
    }

    // add role right
    async addRoleRight({ roleId, atomClassId, action, scope }) {
      if (scope) {
        if (typeof scope === 'string') {
          scope = scope.split(',');
        } else if (!Array.isArray(scope)) {
          scope = [ scope ];
        }
      }
      // force action exists in db
      await ctx.meta.atomAction.get({ atomClassId, code: action });

      // roleRight
      const res = await this.modelRoleRight.insert({
        roleId,
        atomClassId,
        action,
        scope: JSON.stringify(scope),
      });
      const roleRightId = res.insertId;
      // roleRightRef
      if (scope) {
        for (const roleIdScope of scope) {
          await this.modelRoleRightRef.insert({
            roleRightId,
            roleId,
            atomClassId,
            action,
            roleIdScope,
          });
        }
      }
      // insert into roleFunction if action=create/read
      const constant = ctx.constant.module(moduleInfo.relativeName);
      if (action === constant.atom.action.create || action === constant.atom.action.read) {
        const atomClass = await ctx.meta.atomClass.get({ id: atomClassId });
        const functions = ctx.meta.base.functionsAutoRight({
          module: atomClass.module,
          atomClassName: atomClass.atomClassName,
          action });
        for (const key in functions) {
          const func = await ctx.meta.function.get({ module: atomClass.module, name: functions[key].name });
          await this.addRoleFunction({
            roleId,
            functionId: func.id,
            roleRightId,
          });
        }
      }

      return roleRightId;
    }

    // delete role right
    async deleteRoleRight({ id }) {
      await this.modelRoleRight.delete({ id });
      await this.modelRoleRightRef.delete({ roleRightId: id });
      await this.modelRoleFunction.delete({ roleRightId: id });
    }

    // add role function
    async addRoleFunction({ roleId, functionId, roleRightId = 0 }) {
      await this.modelRoleFunction.insert({
        roleId,
        functionId,
        roleRightId,
      });
    }

    // delete role function
    async deleteRoleFunction({ id }) {
      await this.modelRoleFunction.delete({ id });
    }

    // set dirty
    async setDirty(dirty) {
      await ctx.meta.status.module(moduleInfo.relativeName).set('roleDirty', dirty);
    }

    async getDirty() {
      return await ctx.meta.status.module(moduleInfo.relativeName).get('roleDirty');
    }

    // build roles
    async build() {
      await this.model.query('call aBuildRoles(?)', [ ctx.instance.id ]);
      await this.setDirty(false);
    }

    // children
    async children({ roleId, page }) {
      page = ctx.meta.util.page(page, false);
      // roleId
      if (!roleId || roleId === 'root') {
        roleId = 0;
      }
      // select
      const options = {
        where: { roleIdParent: roleId },
        orders: [[ 'sorting', 'asc' ], [ 'roleName', 'asc' ]],
      };
      if (page.size !== 0) {
        options.limit = page.size;
        options.offset = page.index;
      }
      return await this.model.select(options);
    }

    // save
    async save({ roleId, data: { roleName, leader, sorting } }) {
      const role = await this.get({ id: roleId });
      role.roleName = roleName;
      role.leader = leader;
      role.sorting = sorting;
      await this.model.update(role);
    }

    // includes
    async includes({ roleId, page }) {
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      return await ctx.model.query(`
        select a.*,b.roleName from aRoleInc a
          left join aRole b on a.roleIdInc=b.id
            where a.iid=? and a.roleId=?
            ${_limit}
        `, [ ctx.instance.id, roleId ]);
    }

    // role rights
    async roleRights({ roleId, page }) {
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(`
        select a.*,b.module,b.atomClassName,c.name as actionName from aRoleRight a
          left join aAtomClass b on a.atomClassId=b.id
          left join aAtomAction c on a.atomClassId=c.atomClassId and a.action=c.code
            where a.iid=? and a.roleId=?
            order by b.module,a.atomClassId,a.action
            ${_limit}
        `, [ ctx.instance.id, roleId ]);
      // scope
      for (const item of list) {
        const scope = JSON.parse(item.scope);
        item.scopeRoles = await this._scopeRoles({ scope });
      }
      return list;
    }

    // role spreads
    async roleSpreads({ roleId, page }) {
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(`
        select d.*,d.id as roleExpandId,a.id as roleRightId,a.scope,b.module,b.atomClassName,c.code as actionCode,c.name as actionName,e.roleName from aRoleRight a
          left join aAtomClass b on a.atomClassId=b.id
          left join aAtomAction c on a.atomClassId=c.atomClassId and a.action=c.code
          left join aRoleExpand d on a.roleId=d.roleIdBase
          left join aRole e on d.roleIdBase=e.id
            where d.iid=? and d.roleId=?
            order by b.module,a.atomClassId,a.action
            ${_limit}
        `, [ ctx.instance.id, roleId ]);
      // scope
      for (const item of list) {
        const scope = JSON.parse(item.scope);
        item.scopeRoles = await this._scopeRoles({ scope });
      }
      return list;
    }

    // atom rights of user
    async atomRightsOfUser({ userId, page }) {
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(`
        select a.*,b.module,b.atomClassName,c.code as actionCode,c.name as actionName,e.roleName from aViewUserRightAtomClass a
          left join aAtomClass b on a.atomClassId=b.id
          left join aAtomAction c on a.atomClassId=c.atomClassId and a.action=c.code
          left join aRole e on a.roleIdBase=e.id
            where a.iid=? and a.userIdWho=?
            order by b.module,a.atomClassId,a.action
            ${_limit}
        `, [ ctx.instance.id, userId ]);
      // scope
      for (const item of list) {
        const scope = JSON.parse(item.scope);
        item.scopeRoles = await this._scopeRoles({ scope });
      }
      return list;
    }

    async _scopeRoles({ scope }) {
      if (!scope || scope.length === 0) return null;
      return await ctx.model.query(`
            select a.* from aRole a
              where a.iid=? and a.id in (${scope.join(',')})
            `, [ ctx.instance.id ]);
    }

    // function rights
    async functionRights({ menu, roleId, page }) {
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(`
        select a.*,b.module,b.name,b.title,b.scene,b.sorting${menu ? ',f.titleLocale' : ''} from aRoleFunction a
          left join aFunction b on a.functionId=b.id
          ${menu ? 'left join aFunctionLocale f on a.functionId=f.functionId' : ''}
            where a.iid=? and a.roleId=? and b.menu=? ${menu ? 'and f.locale=\'' + ctx.locale + '\'' : ''}
            order by b.module,b.scene,b.sorting
            ${_limit}
        `, [ ctx.instance.id, roleId, menu ]);
      return list;
    }

    // function spreads
    async functionSpreads({ menu, roleId, page }) {
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(`
        select d.*,d.id as roleExpandId,a.id as roleFunctionId,b.module,b.name,b.title,b.scene,e.roleName${menu ? ',f.titleLocale' : ''} from aRoleFunction a
          left join aFunction b on a.functionId=b.id
          left join aRoleExpand d on a.roleId=d.roleIdBase
          left join aRole e on d.roleIdBase=e.id
          ${menu ? 'left join aFunctionLocale f on a.functionId=f.functionId' : ''}
            where d.iid=? and d.roleId=? and b.menu=? ${menu ? 'and f.locale=\'' + ctx.locale + '\'' : ''}
            order by b.module,b.scene,b.sorting
            ${_limit}
        `, [ ctx.instance.id, roleId, menu ]);
      return list;
    }

    // function rights of user
    async functionRightsOfUser({ menu, userId, page }) {
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(`
        select a.*,b.module,b.name,b.title,b.scene,e.roleName from aViewUserRightFunction a
          left join aFunction b on a.functionId=b.id
          left join aRole e on a.roleIdBase=e.id
            where a.iid=? and a.userIdWho=? and b.menu=?
            order by b.module,b.scene,b.sorting
            ${_limit}
        `, [ ctx.instance.id, userId, menu ]);

      return list;
    }

  }

  return Role;
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

const modelFn = __webpack_require__(16);
const modelAgentFn = __webpack_require__(17);
const modelAuthFn = __webpack_require__(18);
const modelAuthProviderFn = __webpack_require__(19);

module.exports = ctx => {

  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  class User {

    constructor() {
      this._model = null;
      this._modelAgent = null;
      this._modelAuth = null;
      this._modelAuthProvider = null;
    }

    get model() {
      if (!this._model) this._model = new (modelFn(ctx.app))(ctx);
      return this._model;
    }

    get modelAgent() {
      if (!this._modelAgent) this._modelAgent = new (modelAgentFn(ctx.app))(ctx);
      return this._modelAgent;
    }

    get modelAuth() {
      if (!this._modelAuth) this._modelAuth = new (modelAuthFn(ctx.app))(ctx);
      return this._modelAuth;
    }

    get modelAuthProvider() {
      if (!this._modelAuthProvider) this._modelAuthProvider = new (modelAuthProviderFn(ctx.app))(ctx);
      return this._modelAuthProvider;
    }

    async anonymous() {
      // new
      const userId = await this.add({ disabled: 0, anonymous: 1 });
      // addRole
      const role = await ctx.meta.role.getSystemRole({ roleName: 'anonymous' });
      await ctx.meta.role.addUserRole({ userId, roleId: role.id });
      return userId;
    }

    async loginAsAnonymous() {
      const maxAge = ctx.config.module(moduleInfo.relativeName).anonymous.maxAge;
      let userId = ctx.cookies.get('anonymous', { encrypt: true });
      let userOp;
      if (userId) {
        userOp = await this.get({ id: userId });
      }
      if (!userOp) {
        userId = await this.anonymous();
        ctx.cookies.set('anonymous', userId.toString(), { encrypt: true, maxAge });
        userOp = await this.get({ id: userId });
      }
      const user = {
        op: userOp,
        agent: userOp,
      };
      await ctx.login(user);
      // maxAge
      ctx.session.maxAge = maxAge;
      return user;
    }

    async check() {
      // check if deleted,disabled,agent
      const userOp = await this.get({ id: ctx.user.op.id });
      // deleted
      if (!userOp) ctx.throw.module(moduleInfo.relativeName, 1004);
      // disabled
      if (userOp.disabled) ctx.throw.module(moduleInfo.relativeName, 1005);
      // hold user
      ctx.user.op = userOp;
      // agent
      if (ctx.user.agent.id !== ctx.user.op.id) {
        const agent = await this.agent({ userId: ctx.user.op.id });
        if (!agent) ctx.throw.module(moduleInfo.relativeName, 1006);
        if (agent.id !== ctx.user.agent.id) ctx.throw.module(moduleInfo.relativeName, 1006);
        if (agent.disabled) ctx.throw.module(moduleInfo.relativeName, 1005);
        // hold agent
        ctx.user.agent = agent;
      } else {
        // hold agent
        ctx.user.agent = userOp;
      }
    }

    async signup(user, ops) {
      ops = ops || {};
      const userId = await this.add(user);
      if (ops.addRole !== false) {
        const role = await ctx.meta.role.getSystemRole({ roleName: ctx.config.module(moduleInfo.relativeName).signupRoleName });
        await ctx.meta.role.addUserRole({ userId, roleId: role.id });
      }
      return userId;
    }

    async exists({ userName, email, mobile }) {
      userName = userName || '';
      email = email || '';
      mobile = mobile || '';
      if (ctx.config.module(moduleInfo.relativeName).checkUserName === true) {
        return await this.model.queryOne(
          `select * from aUser 
             where iid=? and deleted=0 and ((?<>'' and userName=?) or (?<>'' and email=?) or (?<>'' and mobile=?))`,
          [ ctx.instance.id, userName, userName, email, email, mobile, mobile ]);
      }
      return await this.model.queryOne(
        `select * from aUser 
             where iid=? and deleted=0 and ((?<>'' and email=?) or (?<>'' and mobile=?))`,
        [ ctx.instance.id, email, email, mobile, mobile ]);
    }

    async add({ disabled = 0, userName, realName, email, mobile, avatar, motto, locale, anonymous = 0 }) {
      // check if incomplete information
      let needCheck;
      if (anonymous) {
        needCheck = false;
      } else if (ctx.config.module(moduleInfo.relativeName).checkUserName === true) {
        needCheck = userName || email || mobile;
      } else {
        needCheck = email || mobile;
      }
      // if exists
      if (needCheck) {
        const res = await this.exists({ userName, email, mobile });
        if (res) ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // insert
      const res = await this.model.insert({
        disabled,
        userName,
        realName,
        email,
        mobile,
        avatar,
        motto,
        locale,
        anonymous,
      });
      return res.insertId;
    }

    async get(where) {
      return await this.model.get(where);
    }

    async save({ user }) {
      await this.model.update(user);
    }

    async agent({ userId }) {
      const sql = `
        select a.* from aUser a 
          left join aUserAgent b on a.id=b.userIdAgent 
            where a.iid=? and a.deleted=0 and b.userId=?
      `;
      return await ctx.model.queryOne(sql, [ ctx.instance.id, userId ]);
    }

    async agentsBy({ userId }) {
      const sql = `
        select a.* from aUser a 
          left join aUserAgent b on a.id=b.userId
            where a.iid=? and a.deleted=0 and b.userIdAgent=?
      `;
      return await ctx.model.query(sql, [ ctx.instance.id, userId ]);
    }

    async addAgent({ userIdAgent, userId }) {
      await this.modelAgent.insert({
        userIdAgent,
        userId,
      });
    }

    async removeAgent({ userIdAgent, userId }) {
      await this.modelAgent.delete({
        userIdAgent,
        userId,
      });
    }

    async switchAgent({ userIdAgent }) {
      const op = ctx.user.op;
      ctx.user.op = { id: userIdAgent };
      try {
        await this.check();
        await ctx.login(ctx.user);
        return ctx.user;
      } catch (err) {
        ctx.user.op = op;
        throw err;
      }
    }

    async switchOffAgent() {
      return await this.switchAgent({ userIdAgent: ctx.user.agent.id });
    }

    async list({ roleId, query, anonymous, page }) {
      const roleJoin = roleId ? 'left join aUserRole b on a.id=b.userId' : '';
      const roleWhere = roleId ? `and b.roleId=${ctx.model._format2(roleId)}` : '';
      const queryLike = query ? ctx.model._format2({ op: 'like', val: query }) : '';
      const queryWhere = query ? `and ( a.userName like ${queryLike} or a.realName like ${queryLike} or a.mobile like ${queryLike} )` : '';
      const anonymousWhere = anonymous !== undefined ? `and a.anonymous=${ctx.model._format2(anonymous)}` : '';
      const _limit = ctx.model._limit(page.size, page.index);
      const sql = `
        select a.* from aUser a
          ${roleJoin}   
            where a.iid=? and a.deleted=0
                  ${anonymousWhere}
                  ${roleWhere} 
                  ${queryWhere}
            ${_limit}
      `;
      return await ctx.model.query(sql, [ ctx.instance.id ]);
    }

    async disable({ userId, disabled }) {
      await this.model.update({ id: userId, disabled });
    }

    async delete({ userId }) {
      await ctx.meta.role.deleteAllUserRoles({ userId });
      await this.model.delete({ id: userId });
    }

    // roles
    async roles({ userId, page }) {
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      return await ctx.model.query(`
        select a.*,b.roleName from aUserRole a
          left join aRole b on a.roleId=b.id
            where a.iid=? and a.userId=?
            ${_limit}
        `, [ ctx.instance.id, userId ]);
    }

    async verify(profileUser) {
      // state
      //   login/associate
      const state = ctx.request.query.state || 'login';

      // verifyUser
      const verifyUser = {};

      // provider
      const providerItem = await this.modelAuthProvider.get({
        module: profileUser.module,
        providerName: profileUser.provider,
      });
      const config = JSON.parse(providerItem.config);

      // check if auth exists
      const authItem = await this.modelAuth.get({
        providerId: providerItem.id,
        profileId: profileUser.profileId,
      });
      let authId;
      let authUserId;
      if (authItem) {
        // update
        authItem.profile = JSON.stringify(profileUser.profile);
        await this.modelAuth.update(authItem);
        authId = authItem.id;
        authUserId = authItem.userId;
      } else {
        // add
        const res = await this.modelAuth.insert({
          providerId: providerItem.id,
          profileId: profileUser.profileId,
          profile: JSON.stringify(profileUser.profile),
        });
        authId = res.insertId;
      }
      verifyUser.provider = {
        id: authId,
        module: profileUser.module,
        providerName: profileUser.provider,
        // profile: profileUser.profile,  // maybe has private info
      };

      // columns
      const columns = [ 'userName', 'realName', 'email', 'mobile', 'avatar', 'motto', 'locale' ];

      //
      let userId;
      if (state === 'associate') {
        // check if ctx.user exists
        if (!ctx.user || ctx.user.agent.anonymous) return false;
        userId = ctx.user.agent.id;
        // associated
        // update user
        await this._updateUserInfo(userId, profileUser.profile, columns);
        // force update auth's userId, maybe different
        if (authUserId !== userId) {
          await this.modelAuth.update({
            id: authId,
            userId,
          });
        }
        // ready
        verifyUser.op = ctx.user.op;
        verifyUser.agent = ctx.user.agent;
      } else if (state === 'login') {
        // check if user exists
        let user;
        if (authUserId) {
          user = await this.model.get({ id: authUserId });
        }
        if (user) {
          // check if disabled
          if (user.disabled) return false;
          // update user
          await this._updateUserInfo(user.id, profileUser.profile, columns);
          userId = user.id;
        } else {
          // check if addUser
          if (config.addUser === false) return false;
          // add user
          userId = await this._addUserInfo(profileUser.profile, columns, config.addRole !== false);
          user = await this.model.get({ id: userId });
          // update auth's userId
          await this.modelAuth.update({
            id: authId,
            userId,
          });
        }
        // ready
        verifyUser.op = user;
        verifyUser.agent = user;
      }

      // restore maxAge
      if (profileUser.maxAge === 0) {
        ctx.session.maxAge = 0;
      } else {
        ctx.session.maxAge = profileUser.maxAge || ctx.config.module(moduleInfo.relativeName).registered.maxAge;
      }
      return verifyUser;
    }

    async _addUserInfo(profile, columns, addRole) {
      const user = {};
      for (const column of columns) {
        user[column] = profile[column];
      }
      return await this.signup(user, { addRole });
    }
    async _updateUserInfo(userId, profile, columns) {
      const users = await this.model.select({
        where: { id: userId },
        columns,
      });
      const user = users[0];
      for (const column of columns) {
        if (!user[column] && profile[column]) user[column] = profile[column];
      }
      user.id = userId;
      await this.model.update(user);
    }

  }

  return User;
};


/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = ctx => {
  class Util {
    page(_page, force = true) {
      _page = _page || { index: 0 };
      if (force || _page.size === undefined) _page.size = ctx.app.config.pageSize;
      return _page;
    }
    user(_user) {
      return _user || ctx.user.op;
    }
  }

  return Util;
};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = options => {
  return async function auth(ctx, next) {
    if (!ctx.isAuthenticated() || !ctx.user.op || !ctx.user.agent) {
      // anonymous
      await ctx.meta.user.loginAsAnonymous();
    } else {
      // check if deleted,disabled,agent
      await ctx.meta.user.check();
    }

    // if user
    if (options.user && ctx.user.op.anonymous) ctx.throw(401);

    // next
    await next();
  };
};


/***/ }),
/* 36 */
/***/ (function(module, exports) {

// request.body
//   key: atomId itemId
//   atomClass: id,module,atomClassName,atomClassIdParent
//   item:
// options
//   type: atom/function
//   action(atom):
//   name(function):
//   module:
module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function right(ctx, next) {
    // ignore
    if (!options.type) return await next();

    // atom
    if (options.type === 'atom') await checkAtom(moduleInfo, options, ctx);

    // function
    if (options.type === 'function') await checkFunction(moduleInfo, options, ctx);

    // next
    await next();
  };
};

async function checkAtom(moduleInfo, options, ctx) {
  // constant
  const constant = ctx.constant.module(moduleInfo.relativeName);

  // create
  if (options.action === constant.atom.action.create) {
    // atomClassId
    let atomClassId = ctx.request.body.atomClass.id;
    if (!atomClassId) {
      const res = await ctx.meta.atomClass.get({
        module: ctx.request.body.atomClass.module,
        atomClassName: ctx.request.body.atomClass.atomClassName,
        atomClassIdParent: ctx.request.body.atomClass.atomClassIdParent || 0,
      });
      atomClassId = res.id;
    }
    const res = await ctx.meta.atom.checkRightCreate({
      atomClass: {
        id: atomClassId,
      },
      user: ctx.user.op,
    });
    if (!res) ctx.throw(403);
    ctx.request.body._atomClass = res;
  }

  // read
  if (options.action === constant.atom.action.read) {
    const res = await ctx.meta.atom.checkRightRead({
      atom: { id: ctx.request.body.key.atomId },
      user: ctx.user.op,
    });
    if (!res) ctx.throw(403);
    ctx.request.body.key.itemId = res.itemId;
    ctx.request.body._atom = res;
  }

  // write/delete
  if (options.action === constant.atom.action.write || options.action === constant.atom.action.delete) {
    const res = await ctx.meta.atom.checkRightUpdate({
      atom: { id: ctx.request.body.key.atomId, action: options.action },
      user: ctx.user.op,
    });
    if (!res) ctx.throw(403);
    ctx.request.body.key.itemId = res.itemId;
    ctx.request.body._atom = res;
    // ctx.request.body.atom = res;  // atom maybe from client
  }

  // other action
  const actionCustom = options.action || ctx.request.body.action;
  if (actionCustom > constant.atom.action.custom) {
    const res = await ctx.meta.atom.checkRightAction({
      atom: { id: ctx.request.body.key.atomId, action: actionCustom },
      user: ctx.user.op,
    });
    if (!res) ctx.throw(403);
    ctx.request.body.key.itemId = res.itemId;
    ctx.request.body._atom = res;
    // ctx.request.body.atom = res;  // atom maybe from client
  }

  // prepare validate: write
  if (options.action === constant.atom.action.write) {
    const validator = await ctx.meta.atom.validator({ atomClass: { id: ctx.request.body._atom.atomClassId } });
    if (validator) {
      const validate = ctx.request.body.geto('validate');
      validate.module = validator.module;
      validate.validator = validator.validator;
    }
  }
  // prepare validate: action
  if (actionCustom > constant.atom.action.custom) {
    // ignore if no schema
    if (ctx.request.body.validation && ctx.request.body.validation.schema) {
      const validator = await ctx.meta.atom.validator({ atomClass: { id: ctx.request.body._atom.atomClassId } });
      if (validator) {
        const validate = ctx.request.body.geto('validate');
        validate.module = validator.module;
        validate.validator = validator.validator;
      }
    }
  }

}

async function checkFunction(moduleInfo, options, ctx) {
  const res = await ctx.meta.function.checkRightFunction({
    function: {
      module: options.module || ctx.module.info.relativeName,
      name: options.name || ctx.request.body.name },
    user: ctx.user.op,
  });
  if (!res) ctx.throw(403);
  ctx.request.body._function = res;
}


/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = {
  systemRoles: [ 'root', 'anonymous', 'authenticated', 'registered', 'activated', 'superuser', 'organization', 'internal', 'external' ],
  atom: {
    action: {
      create: 1,
      read: 2,
      write: 3,
      delete: 4,
      save: 51,
      submit: 52,
      custom: 100, // custom action start from custom
    },
    actionMeta: {
      create: { title: 'Create', actionComponent: 'action', actionPath: 'atom/edit?atomId={{atomId}}&itemId={{itemId}}&atomClassId={{atomClassId}}&atomClassName={{atomClassName}}&atomClassIdParent={{atomClassIdParent}}' },
      read: { title: 'View', actionPath: 'atom/view?atomId={{atomId}}&itemId={{itemId}}&atomClassId={{atomClassId}}&atomClassName={{atomClassName}}&atomClassIdParent={{atomClassIdParent}}' },
      write: { title: 'Edit', actionPath: 'atom/edit?atomId={{atomId}}&itemId={{itemId}}&atomClassId={{atomClassId}}&atomClassName={{atomClassName}}&atomClassIdParent={{atomClassIdParent}}' },
      delete: { title: 'Delete', actionComponent: 'action' },
      save: { title: 'Save', actionComponent: 'action', authorize: false },
      submit: { title: 'Submit', actionComponent: 'action', authorize: false },
      custom: { title: 'Custom' },
    },
  },
  function: {
    scene: {
      default: 0,
      create: 1,
      list: 2,
      statistics: 20,
      tools: 50,
      custom: 100,
    },
  },
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(39);
const base = __webpack_require__(40);
const user = __webpack_require__(41);
const atom = __webpack_require__(42);
const atomClass = __webpack_require__(43);
const atomAction = __webpack_require__(44);
const func = __webpack_require__(45);
const auth = __webpack_require__(46);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    // base
    { method: 'post', path: 'base/modules', controller: base },
    { method: 'post', path: 'base/locales', controller: base },
    { method: 'post', path: 'base/atomClasses', controller: base },
    { method: 'post', path: 'base/actions', controller: base },
    { method: 'post', path: 'base/flags', controller: base },
    { method: 'post', path: 'base/menus', controller: base },
    { method: 'post', path: 'base/functions', controller: base },
    // atom
    { method: 'post', path: 'atom/create', controller: atom, middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 1 } },
    },
    { method: 'post', path: 'atom/read', controller: atom,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'atom/select', controller: atom },
    { method: 'post', path: 'atom/write', controller: atom, middlewares: 'validate,transaction',
      meta: {
        right: { type: 'atom', action: 3 },
        validate: { data: 'item' },
      },
    },
    { method: 'post', path: 'atom/submit', controller: atom, middlewares: 'validate,transaction',
      meta: {
        right: { type: 'atom', action: 3 },
        validate: { data: 'item' },
      },
    },
    { method: 'post', path: 'atom/delete', controller: atom, middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 4 } },
    },
    { method: 'post', path: 'atom/action', controller: atom, middlewares: 'validate,transaction',
      meta: {
        right: { type: 'atom' },
        validate: { data: 'item' },
      },
    },
    { method: 'post', path: 'atom/enable', controller: atom },
    { method: 'post', path: 'atom/star', controller: atom,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'atom/labels', controller: atom,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'atom/actions', controller: atom },
    { method: 'post', path: 'atom/schema', controller: atom },
    { method: 'post', path: 'atom/validator', controller: atom },
    // user
    { method: 'post', path: 'user/getLabels', controller: user },
    { method: 'post', path: 'user/setLabels', controller: user },
    // function
    { method: 'post', path: 'function/list', controller: func },
    { method: 'post', path: 'function/star', controller: func },
    { method: 'post', path: 'function/check', controller: func },
    { method: 'post', path: 'function/checkLocale', controller: func, middlewares: 'inner' },
    { method: 'post', path: 'function/register', controller: func, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'function/clearLocales', controller: func, middlewares: 'inner',
      meta: { instance: { enable: false } },
    },
    // atomAction
    { method: 'post', path: 'atomAction/register', controller: atomAction, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    // atomClass
    { method: 'post', path: 'atomClass/register', controller: atomClass, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'atomClass/validatorSearch', controller: atomClass },
    // auth
    { method: 'post', path: 'auth/echo', controller: auth, meta: { auth: { enable: false } } },
    { method: 'post', path: 'auth/check', controller: auth, meta: { auth: { user: true } } },
    { method: 'post', path: 'auth/logout', controller: auth, meta: { auth: { enable: false } } },
    { method: 'post', path: 'auth/installAuthProviders', controller: auth, middlewares: 'inner',
      meta: { instance: { enable: false } },
    },
  ];
  return routes;
};


/***/ }),
/* 39 */
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
/* 40 */
/***/ (function(module, exports) {

module.exports = app => {

  class BaseController extends app.Controller {

    modules() {
      const res = this.ctx.service.base.modules();
      this.ctx.success(res);
    }

    locales() {
      const res = this.ctx.service.base.locales();
      this.ctx.success(res);
    }

    atomClasses() {
      const res = this.ctx.service.base.atomClasses();
      this.ctx.success(res);
    }

    actions() {
      const res = this.ctx.service.base.actions();
      this.ctx.success(res);
    }

    flags() {
      const res = this.ctx.service.base.flags();
      this.ctx.success(res);
    }

    menus() {
      const res = this.ctx.service.base.menus();
      this.ctx.success(res);
    }

    functions() {
      const res = this.ctx.service.base.functions();
      this.ctx.success(res);
    }

  }

  return BaseController;
};


/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = app => {

  class UserController extends app.Controller {

    async getLabels() {
      const res = await this.ctx.service.user.getLabels({
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async setLabels() {
      await this.ctx.service.user.setLabels({
        labels: this.ctx.request.body.labels,
        user: this.ctx.user.op,
      });
      this.ctx.success();
    }

  }
  return UserController;
};



/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomController extends app.Controller {

    async create() {
      const res = await this.ctx.service.atom.create({
        atomClass: this.ctx.request.body.atomClass,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.atom.read({
        key: this.ctx.request.body.key,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    // options
    //   where, orders, page, star, label
    async select() {
      const options = this.ctx.request.body.options;
      options.page = this.ctx.meta.util.page(options.page);
      const items = await this.ctx.service.atom.select({
        atomClass: this.ctx.request.body.atomClass,
        options,
        user: this.ctx.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async write() {
      await this.ctx.service.atom.write({
        key: this.ctx.request.body.key,
        item: this.ctx.request.body.item,
        validation: this.ctx.request.body.validation,
        user: this.ctx.user.op,
      });
      this.ctx.success();
    }

    async submit() {
      await this.write();
      await this.enable();
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.atom.delete({
        key: this.ctx.request.body.key,
        user: this.ctx.user.op,
      });
      this.ctx.success();
    }

    async action() {
      const res = await this.ctx.service.atom.action({
        action: this.ctx.request.body.action,
        key: this.ctx.request.body.key,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async enable() {
      // only allowed: draft
      const key = this.ctx.request.body.key;
      const user = this.ctx.user.op;
      const atom = await this.ctx.meta.atom._get({ atom: { id: key.atomId }, user });
      if (atom.atomEnabled || user.id !== atom.userIdCreated) this.ctx.throw(403);
      // enable
      const res = await this.ctx.service.atom.enable({
        key,
        atom: { atomEnabled: 1 },
        user,
      });
      this.ctx.success(res);
    }

    async star() {
      const res = await this.ctx.service.atom.star({
        key: this.ctx.request.body.key,
        atom: this.ctx.request.body.atom,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async labels() {
      const res = await this.ctx.service.atom.labels({
        key: this.ctx.request.body.key,
        atom: this.ctx.request.body.atom,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async actions() {
      const res = await this.ctx.service.atom.actions({
        key: this.ctx.request.body.key,
        basic: this.ctx.request.body.basic,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async schema() {
      const res = await this.ctx.service.atom.schema({
        atomClass: this.ctx.request.body.atomClass,
        schema: this.ctx.request.body.schema,
      });
      this.ctx.success(res);
    }

    async validator() {
      const res = await this.ctx.service.atom.validator({
        atomClass: this.ctx.request.body.atomClass,
      });
      this.ctx.success(res);
    }

  }
  return AtomController;
};



/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomClassController extends app.Controller {

    async register() {
      const res = await this.ctx.service.atomClass.register({
        module: this.ctx.request.body.module,
        atomClassName: this.ctx.request.body.atomClassName,
        atomClassIdParent: this.ctx.request.body.atomClassIdParent,
      });
      this.ctx.success(res);
    }

    validatorSearch() {
      const res = this.ctx.service.atomClass.validatorSearch({
        module: this.ctx.request.body.module,
        atomClassName: this.ctx.request.body.atomClassName,
      });
      this.ctx.success(res);
    }

  }

  return AtomClassController;
};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomActionController extends app.Controller {

    async register() {
      const res = await this.ctx.service.atomAction.register({
        atomClassId: this.ctx.request.body.atomClassId,
        code: this.ctx.request.body.code,
      });
      this.ctx.success(res);
    }

  }

  return AtomActionController;
};


/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = app => {

  class FunctionController extends app.Controller {

    // options
    //   where, orders, page, star,language
    async list() {
      const options = this.ctx.request.body.options || {};
      options.page = this.ctx.meta.util.page(options.page);
      // locale maybe '' for selectAllFunctions
      if (options.locale === undefined) options.locale = this.ctx.locale;
      const items = await this.ctx.service.function.list({
        options,
        user: this.ctx.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async star() {
      const res = await this.ctx.service.function.star({
        id: this.ctx.request.body.id,
        star: this.ctx.request.body.star,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async check() {
      const res = await this.ctx.service.function.check({
        functions: this.ctx.request.body.functions,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async checkLocale() {
      const res = await this.ctx.service.function.checkLocale({
        locale: this.ctx.request.body.locale,
      });
      this.ctx.success(res);
    }

    async register() {
      const res = await this.ctx.service.function.register({
        module: this.ctx.request.body.module,
        name: this.ctx.request.body.name,
      });
      this.ctx.success(res);
    }

    async clearLocales() {
      const res = await this.ctx.service.function.clearLocales();
      this.ctx.success(res);
    }

  }

  return FunctionController;
};


/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = app => {

  class AuthController extends app.Controller {

    // return current user auth info
    //   { op:{id},agent:{id},provider}
    async echo() {
      try {
        if (!this.ctx.isAuthenticated() || !this.ctx.user.op || !this.ctx.user.agent) {
          // anonymous
          await this.ctx.meta.user.loginAsAnonymous();
        } else {
          // check if deleted,disabled,agent
          await this.ctx.meta.user.check();
        }
        // logined
        this.ctx.success(this.ctx.user);
      } catch (e) {
        // deleted,disabled
        await this.logout();
      }
    }

    async check() {
      this.ctx.success(this.ctx.user);
    }

    async logout() {
      await this.ctx.logout();
      await this.ctx.meta.user.loginAsAnonymous();
      this.ctx.success(this.ctx.user);
    }

    async installAuthProviders() {
      // register all authProviders
      await this.ctx.service.auth.registerAllProviders();
      // verify
      this.app.passport.verify(async function(ctx, profileUser) {
        return await ctx.meta.user.verify(profileUser);
      });
      this.ctx.success();
    }

  }

  return AuthController;
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(48);
const base = __webpack_require__(54);
const user = __webpack_require__(55);
const atom = __webpack_require__(56);
const atomClass = __webpack_require__(57);
const atomAction = __webpack_require__(58);
const auth = __webpack_require__(59);
const func = __webpack_require__(60);

module.exports = app => {
  const services = {
    version,
    base,
    user,
    atom,
    atomClass,
    atomAction,
    auth,
    function: func,
  };
  return services;
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

const VersionUpdate1Fn = __webpack_require__(49);
const VersionUpdate2Fn = __webpack_require__(51);
const VersionInitFn = __webpack_require__(52);

module.exports = app => {

  class Version extends app.Service {

    async update(options) {

      if (options.version === 2) {
        const versionUpdate2 = new (VersionUpdate2Fn(this.ctx))();
        await versionUpdate2.run();
      }

      if (options.version === 1) {
        const versionUpdate1 = new (VersionUpdate1Fn(this.ctx))();
        await versionUpdate1.run();
      }
    }

    async init(options) {
      if (options.version === 2) {
        const versionInit = new (VersionInitFn(this.ctx))();
        await versionInit.run(options);
      }
    }

  }

  return Version;
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

const update1Data = __webpack_require__(50);

module.exports = function(ctx) {

  class VersionUpdate1 {

    async run() {
      // tables
      const tableNames = [
        'aUser', 'aUserAgent', 'aAuthProvider', 'aAuth', 'aRole', 'aRoleInc', 'aUserRole', 'aRoleRight',
        'aAtomClass', 'aAtom', 'aAtomAction',
        'aLabel', 'aAtomLabel', 'aAtomLabelRef', 'aAtomStar',
        'aRoleRef', 'aRoleIncRef', 'aRoleExpand', 'aRoleRightRef',
        'aFunction', 'aFunctionStar', 'aFunctionLocale', 'aRoleFunction',
      ];

      for (const tableName of tableNames) {
        await ctx.model.query(update1Data.tables[tableName]);
      }

      // views
      const viewNames = [
        'aViewUserRoleRef',
        'aViewUserRoleExpand',
        'aViewUserRightAtomClass',
        'aViewUserRightAtomClassUser',
        'aViewUserRightAtom',
        'aViewUserRightFunction',
      ];
      for (const viewName of viewNames) {
        await ctx.model.query(update1Data.views[viewName]);
      }

      // functions
      const functionNames = [
      ];
      for (const functionName of functionNames) {
        await ctx.model.query(update1Data.functions[functionName]);
      }

      // procedures
      const procedureNames = [
        'aSelectAtoms',
        'aGetAtom',
        'aCheckRightRead',
        'aCheckRightUpdate',
        'aCheckRightAction',
        'aCheckRightCreate',
        'aCheckRightFunction',
        'aSelectFunctions',
        'aCheckFunctionLocales',
        'aBuildRoles',
        'aBuildRolesRemove',
        'aBuildRolesAdd',
        'aBuildRoleRef',
        'aBuildRoleIncRef',
        'aBuildRoleExpand',
      ];
      for (const procedureName of procedureNames) {
        await ctx.model.query(update1Data.procedures[procedureName]);
      }
    }

  }

  return VersionUpdate1;
};


/***/ }),
/* 50 */
/***/ (function(module, exports) {

const tables = {
  aUser: `
          CREATE TABLE aUser (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            disabled int(11) DEFAULT '0',
            userName varchar(50) DEFAULT NULL,
            realName varchar(50) DEFAULT NULL,
            email varchar(50) DEFAULT NULL,
            mobile varchar(50) DEFAULT NULL,
            avatar varchar(255) DEFAULT NULL,
            motto varchar(255) DEFAULT NULL,
            locale varchar(255) DEFAULT NULL,
            anonymous int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aUserAgent: `
          CREATE TABLE aUserAgent (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            userIdAgent int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAuthProvider: `
          CREATE TABLE aAuthProvider (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            disabled int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            providerName varchar(50) DEFAULT NULL,
            config json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aAuth: `
          CREATE TABLE aAuth (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            providerId int(11) DEFAULT '0',
            profileId varchar(255) DEFAULT NULL,
            profile json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aRole: `
          CREATE TABLE aRole (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleName varchar(50) DEFAULT NULL,
            leader int(11) DEFAULT '0',
            catalog int(11) DEFAULT '0',
            \`system\` int(11) DEFAULT '0',
            sorting int(11) DEFAULT '0',
            roleIdParent int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aRoleRef: `
          CREATE TABLE aRoleRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            roleIdParent int(11) DEFAULT '0',
            level int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aRoleInc: `
          CREATE TABLE aRoleInc (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            roleIdInc int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aRoleIncRef: `
          CREATE TABLE aRoleIncRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            roleIdInc int(11) DEFAULT '0',
            roleIdSrc int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aRoleExpand: `
          CREATE TABLE aRoleExpand (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            roleIdBase int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aUserRole: `
          CREATE TABLE aUserRole (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAtomClass: `
          CREATE TABLE aAtomClass (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            atomClassName varchar(255) DEFAULT NULL,
            atomClassIdParent int(11) DEFAULT '0',
            public int(11) DEFAULT '0',
            flow int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAtom: `
          CREATE TABLE aAtom (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            atomEnabled int(11) DEFAULT '0',
            atomFlow int(11) DEFAULT '0',
            atomFlag int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            atomName varchar(255) DEFAULT NULL,
            userIdCreated int(11) DEFAULT '0',
            userIdUpdated int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAtomAction: `
          CREATE TABLE aAtomAction (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            code int(11) DEFAULT '0',
            name varchar(50) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aLabel: `
          CREATE TABLE aLabel (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            labels JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aAtomLabel: `
          CREATE TABLE aAtomLabel (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            labels JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aAtomLabelRef: `
          CREATE TABLE aAtomLabelRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            labelId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAtomStar: `
          CREATE TABLE aAtomStar (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            star int(11) DEFAULT '1',
            PRIMARY KEY (id)
          )
        `,
  aRoleRight: `
          CREATE TABLE aRoleRight (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            action int(11) DEFAULT '0',
            scope JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aRoleRightRef: `
          CREATE TABLE aRoleRightRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleRightId int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            action int(11) DEFAULT '0',
            roleIdScope int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aFunction: `
          CREATE TABLE aFunction (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            name varchar(255) DEFAULT NULL,
            title varchar(255) DEFAULT NULL,
            scene int(11) DEFAULT '0',
            autoRight int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            action int(11) DEFAULT '0',
            sorting int(11) DEFAULT '0',
            menu int(11) DEFAULT '0',
            public int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aFunctionStar: `
          CREATE TABLE aFunctionStar (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            functionId int(11) DEFAULT '0',
            star int(11) DEFAULT '1',
            PRIMARY KEY (id)
          )
        `,
  aFunctionLocale: `
          CREATE TABLE aFunctionLocale (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            functionId int(11) DEFAULT '0',
            locale varchar(50) DEFAULT NULL,
            titleLocale varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aRoleFunction: `
          CREATE TABLE aRoleFunction (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            functionId int(11) DEFAULT '0',
            roleRightId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
};

const views = {
  aViewUserRoleRef: `
create view aViewUserRoleRef as
  select a.iid,a.userId,a.roleId,b.roleIdParent,b.level from aUserRole a
    inner join aRoleRef b on a.roleId=b.roleId
  `,
  aViewUserRoleExpand: `
create view aViewUserRoleExpand as
  select a.iid,a.userId,a.roleId,b.roleIdBase,b.id as roleExpandId from aUserRole a
    left join aRoleExpand b on a.roleId=b.roleId
  `,
  aViewUserRightAtomClass: `
create view aViewUserRightAtomClass as
  select a.iid,a.userId as userIdWho,a.roleExpandId,a.roleId,a.roleIdBase,b.id as roleRightId,b.atomClassId,b.action,b.scope from aViewUserRoleExpand a
    inner join aRoleRight b on a.roleIdBase=b.roleId
  `,
  aViewUserRightAtomClassUser: `
create view aViewUserRightAtomClassUser as
  select a.iid,a.userId as userIdWho,b.atomClassId,b.action,c.userId as userIdWhom from aViewUserRoleExpand a
    inner join aRoleRightRef b on a.roleIdBase=b.roleId
    inner join aViewUserRoleRef c on b.roleIdScope=c.roleIdParent
  `,
  aViewUserRightAtom: `
create view aViewUserRightAtom as
  select a.iid, a.id as atomId,a.userIdCreated as userIdWhom,b.userIdWho,b.action from aAtom a,aViewUserRightAtomClassUser b
    where a.deleted=0 and a.atomEnabled=1
      and a.atomClassId=b.atomClassId
      and a.userIdCreated=b.userIdWhom
  `,
  aViewUserRightFunction: `
create view aViewUserRightFunction as
  select a.iid,a.userId as userIdWho,a.roleExpandId,a.roleId,a.roleIdBase,b.id as roleFunctionId,b.functionId from aViewUserRoleExpand a
    inner join aRoleFunction b on a.roleIdBase=b.roleId
  `,
};

const functions = {
};

const procedures = {
  aSelectAtoms: `
create procedure aSelectAtoms (in _tableName varchar(50),in __where text,in __orders text,in __limit text,in _iid int,in _userIdWho int,in _star int,in _label int)
begin
  -- tables
  -- a: aAtom
  -- b: aAtomClass
  -- c: aViewUserRightAtom
  -- d: aAtomStar
  -- e: aAtomLabelRef
  -- f: {item}
  -- g: aUser

  declare _where,_orders,_limit text;
  declare _starField,_starJoin,_starWhere text;
  declare _labelField,_labelJoin,_labelWhere text;
  declare _itemField,_itemJoin text;

  if __where<>'' then
    set _where=concat(__where,' AND');
  else
    set _where=' WHERE';
  end if;

  if __orders<>'' then
    set _orders=__orders;
  else
    set _orders='';
  end if;

  if __limit<>'' then
    set _limit=__limit;
  else
    set _limit='';
  end if;

  if _star<>0 then
    set _starJoin=' inner join aAtomStar d on a.id=d.atomId';
    set _starWhere=concat(' and d.iid=',_iid,' and d.userId=',_userIdWho,' and d.star=1');
  else
    set _starJoin='';
    set _starWhere='';
  end if;
    set _starField=concat(
        ',(select d2.star from aAtomStar d2 where d2.iid=',_iid,' and d2.atomId=a.id and d2.userId=',_userIdWho,') as star'
      );

  if _label<>0 then
    set _labelJoin=' inner join aAtomLabelRef e on a.id=e.atomId';
    set _labelWhere=concat(' and e.iid=',_iid,' and e.userId=',_userIdWho,' and e.labelId=',_label);
  else
    set _labelJoin='';
    set _labelWhere='';
  end if;
    set _labelField=concat(
        ',(select e2.labels from aAtomLabel e2 where e2.iid=',_iid,' and e2.atomId=a.id and e2.userId=',_userIdWho,') as labels'
      );

  if _tableName<>'' then
    set _itemField='f.*,';
    set _itemJoin=concat(' inner join ',_tableName,' f on f.atomId=a.id');
  else
    set _itemField='';
    set _itemJoin='';
  end if;

  set @sql=concat(
    'select ',_itemField,'a.id as atomId,a.itemId,a.atomEnabled,a.atomFlag,a.atomFlow,a.atomClassId,a.atomName,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,b.module,b.atomClassName,b.atomClassIdParent,g.userName,g.avatar',_starField,_labelField,' from aAtom a',
    ' inner join aAtomClass b on a.atomClassId=b.id',
    ' inner join aUser g on a.userIdCreated=g.id',
    _itemJoin,
    _starJoin,
    _labelJoin,
    _where,
    ' (',
    '  a.deleted=0 and a.iid=', _iid,
    _starWhere,
    _labelWhere,
    '    and (',
    '           (a.userIdCreated=',_userIdWho,') or',
    '             (a.atomEnabled=1 and (',
    '               (',
    '                 a.atomFlow=1 and (',
    '                   (exists(select c.atomId from aViewUserRightAtom c where c.iid=',_iid,' and a.id=c.atomId and c.action>2 and c.userIdWho=',_userIdWho,')) or',
    '                   (a.userIdCreated=',_userIdWho,' and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=',_iid,' and a.atomClassId=c.atomClassId and c.action>2 and c.scope=0 and c.userIdWho=',_userIdWho,'))',
    '                 )',
    '               ) or (',
    '                 a.atomFlow=0 and (',
    '                   b.public=1 or exists(select c.atomId from aViewUserRightAtom c where c.iid=',_iid,' and a.id=c.atomId and c.action=2 and c.userIdWho=',_userIdWho,')',
    '                 )',
    '                )',
    '             ))',
    '        )',
    ' )',
    _orders,
    _limit
  );

  prepare stmt from @sql;
  execute stmt;
  deallocate prepare stmt;

end
`,
  aGetAtom: `
create procedure aGetAtom (in _tableName varchar(50),in _atomId int,in _iid int,in _userIdWho int)
begin
  -- tables
  -- a: aAtom
  -- b: aAtomClass
  -- d: aAtomStar
  -- e: aAtomLabelRef
  -- f: {item}
  -- g: aUser

  declare _starField,_labelField text;
  declare _itemField,_itemJoin text;

  set _starField=concat(
        ',(select d.star from aAtomStar d where d.iid=',_iid,' and d.atomId=a.id and d.userId=',_userIdWho,') as star'
      );

  set _labelField=concat(
        ',(select e.labels from aAtomLabel e where e.iid=',_iid,' and e.atomId=a.id and e.userId=',_userIdWho,') as labels'
      );

  if _tableName<>'' then
    set _itemField='f.*,';
    set _itemJoin=concat(' inner join ',_tableName,' f on f.atomId=a.id');
  else
    set _itemField='';
    set _itemJoin='';
  end if;

  set @sql=concat(
    'select ',_itemField,'a.id as atomId,a.itemId,a.atomEnabled,a.atomFlag,a.atomFlow,a.atomClassId,a.atomName,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,b.module,b.atomClassName,b.atomClassIdParent,g.userName,g.avatar',_starField,_labelField,' from aAtom a',
    ' inner join aAtomClass b on a.atomClassId=b.id',
    ' inner join aUser g on a.userIdCreated=g.id',
    _itemJoin,
    ' where a.id=', _atomId,
    '   and a.deleted=0 and a.iid=', _iid
  );

  prepare stmt from @sql;
  execute stmt;
  deallocate prepare stmt;

end
`,
  aCheckRightRead: `
create procedure aCheckRightRead (in _iid int,in _userIdWho int,in _atomId int)
begin

  select a.* from aAtom a
   left join aAtomClass b on a.atomClassId=b.id
    where (
     a.deleted=0 and a.iid=_iid and a.id=_atomId
     and (
            (a.userIdCreated=_userIdWho) or
            (a.atomEnabled=1 and (
              (
                a.atomFlow=1 and (
                  (exists(select c.atomId from aViewUserRightAtom c where c.iid=_iid and a.id=c.atomId and c.action>2 and c.userIdWho=_userIdWho)) or
                  (a.userIdCreated=_userIdWho and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=_iid and a.atomClassId=c.atomClassId and c.action>2 and c.scope=0 and c.userIdWho=_userIdWho))
                )
              ) or (
                a.atomFlow=0 and (
                  b.public=1 or exists(select c.atomId from aViewUserRightAtom c where c.iid=_iid and a.id=c.atomId and c.action=2 and c.userIdWho=_userIdWho)
                )
              )
            ))
          )
    );

end
`,
  aCheckRightUpdate: `
create procedure aCheckRightUpdate (in _iid int,in _userIdWho int,in _atomId int,in _action int,in _actionFlag varchar(255))
begin

  select a.* from aAtom a
    where (
     a.deleted=0 and a.iid=_iid and a.id=_atomId
     and (
            (a.atomEnabled=0 and a.userIdCreated=_userIdWho) or
            (a.atomEnabled=1 and (
              (exists(select c.atomId from aViewUserRightAtom c where c.iid=_iid and a.id=c.atomId and c.action=_action and (_actionFlag='' or find_in_set(a.atomFlag,_actionFlag)>0 ) and c.userIdWho=_userIdWho)) or
              (a.userIdCreated=_userIdWho and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=_iid and a.atomClassId=c.atomClassId and c.action=_action and (_actionFlag='' or find_in_set(a.atomFlag,_actionFlag)>0 ) and c.scope=0 and c.userIdWho=_userIdWho))
            ))
          )
    );

end
`,
  aCheckRightAction: `
create procedure aCheckRightAction (in _iid int,in _userIdWho int,in _atomId int,in _action int,in _actionFlag varchar(255))
begin

  select a.* from aAtom a
    where (
     a.deleted=0 and a.iid=_iid and a.id=_atomId and a.atomEnabled=1
     and (
            (exists(select c.atomId from aViewUserRightAtom c where c.iid=_iid and a.id=c.atomId and c.action=_action and (_actionFlag='' or find_in_set(a.atomFlag,_actionFlag)>0 ) and c.userIdWho=_userIdWho)) or
            (a.userIdCreated=_userIdWho and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=_iid and a.atomClassId=c.atomClassId and c.action=_action and (_actionFlag='' or find_in_set(a.atomFlag,_actionFlag)>0 ) and c.scope=0 and c.userIdWho=_userIdWho))
          )
    );

end
`,
  aCheckRightCreate: `
create procedure aCheckRightCreate (in _iid int,in _userIdWho int,in _atomClassId int)
begin

  select a.* from aAtomClass a
    inner join aViewUserRightAtomClass b on a.id=b.atomClassId
      where b.iid=_iid and b.atomClassId=_atomClassId and b.action=1 and b.userIdWho=_userIdWho;

end
`,
  aCheckRightFunction: `
create procedure aCheckRightFunction (in _iid int,in _userIdWho int,in _functionId int)
begin

  select a.* from aFunction a
    where a.deleted=0 and a.iid=_iid and a.id=_functionId
      and ( a.public=1 or
            exists(select c.functionId from aViewUserRightFunction c where c.iid=_iid and c.functionId=_functionId and c.userIdWho=_userIdWho)
          );

end
`,
  aSelectFunctions: `
create procedure aSelectFunctions (in __where text,in __orders text,in __limit text,in _iid int,in _userIdWho int,in _star int,in _locale varchar(50))
begin
  -- tables
  -- a: aFunction
  -- b: aFunctionLocale
  -- c: aViewUserRightFunction
  -- d: aFunctionStar
  -- e: aAtomClass

  declare _where,_orders,_limit text;
  declare _starField,_starJoin,_starWhere text;
  declare _localeField,_localeJoin,_localeWhere text;

  if __where<>'' then
    set _where=concat(__where,' AND');
  else
    set _where=' WHERE';
  end if;

  if __orders<>'' then
    set _orders=__orders;
  else
    set _orders='';
  end if;

  if __limit<>'' then
    set _limit=__limit;
  else
    set _limit='';
  end if;

  if _star<>0 then
    set _starField='';
    set _starJoin=' inner join aFunctionStar d on a.id=d.functionId';
    set _starWhere=concat(' and d.iid=',_iid,' and d.userId=',_userIdWho,' and d.star=1');
  else
    set _starField=concat(
        ',(select d.star from aFunctionStar d where d.iid=',_iid,' and d.functionId=a.id and d.userId=',_userIdWho,') as star'
      );
    set _starJoin='';
    set _starWhere='';
  end if;

  if _locale<>'\'\'\'\'' then
    set _localeField=',b.titleLocale';
    set _localeJoin=' inner join aFunctionLocale b on a.id=b.functionId';
    set _localeWhere=concat(' and b.iid=',_iid,' and b.locale=',_locale);
  else
    set _localeField='';
    set _localeJoin='';
    set _localeWhere='';
  end if;

  set @sql=concat(
    'select a.*,e.atomClassName,e.atomClassIdParent',_localeField,_starField,' from aFunction a',
    ' left join aAtomClass e on a.atomClassId=e.id',
    _localeJoin,
    _starJoin,
    _where,
    ' (',
    '  a.deleted=0 and a.iid=', _iid,
    _localeWhere,
    _starWhere,
    '    and ( a.public=1',
    '          or exists(select c.functionId from aViewUserRightFunction c where c.iid=',_iid,' and a.id=c.functionId and c.userIdWho=',_userIdWho,')',
    '        )',
    ' )',
    _orders,
    _limit
  );

  prepare stmt from @sql;
  execute stmt;
  deallocate prepare stmt;

end
`,
  aCheckFunctionLocales: `
create procedure aCheckFunctionLocales (in _iid int,in _locale varchar(50))
begin

  select a.* from aFunction a
    where a.iid=_iid and a.menu=1
      and not exists(
        select b.id from aFunctionLocale b
          where b.iid=_iid and b.locale=_locale and b.functionId=a.id
            and (b.titleLocale is not null and b.titleLocale<>'')
        );

end
`,
  aBuildRoles: `
create procedure aBuildRoles (in _iid int)
begin

  call aBuildRolesRemove(_iid);
  call aBuildRolesAdd(_iid,0);

end
`,
  aBuildRolesRemove: `
create procedure aBuildRolesRemove (in _iid int)
begin

  delete from aRoleRef where aRoleRef.iid=_iid;
  delete from aRoleIncRef where aRoleIncRef.iid=_iid;
  delete from aRoleExpand where aRoleExpand.iid=_iid;

end
`,
  aBuildRolesAdd: `
create procedure aBuildRolesAdd (in _iid int,in _roleIdParent int)
begin
  declare _done int default false;
  declare _id,_catalog int;
  declare _roleIds,_catalogs json;
  declare i,_roleCount int;
  declare _cur cursor for select a.id,a.catalog from aRole a where a.iid=_iid and a.roleIdParent=_roleIdParent;
  declare continue handler for not found set _done=true;

  SET @@session.max_sp_recursion_depth = 128;

  -- roleIds

  set _roleIds=json_array();
  set _catalogs=json_array();

  open _cur;

  set i=0;
  read_loop: loop
    fetch _cur into _id,_catalog;
    if _done then
        leave read_loop;
    end if;
    set _roleIds=json_set(_roleIds,concat('$[',i,']'),_id);
    set _catalogs=json_set(_catalogs,concat('$[',i,']'),_catalog);
    set i=i+1;
  end loop;

  close _cur;

  -- build roles

  set _roleCount=json_length(_roleIds);
  set i=0;
  while i<_roleCount do
    set _id=json_extract(_roleIds,concat('$[',i,']'));
    set _catalog=json_extract(_catalogs,concat('$[',i,']'));
    call aBuildRoleRef(_iid,_id);
    call aBuildRoleIncRef(_iid,_id);
    call aBuildRoleExpand(_iid,_id);
    if _catalog=1 then
      call aBuildRolesAdd(_iid,_id);
    end if;
    set i=i+1;
  end while;

end
`,
  aBuildRoleRef: `
create procedure aBuildRoleRef (in _iid int,in _roleId int)
begin
  declare _level,_roleIdParent int;

  set _level=0;
  set _roleIdParent=_roleId;

  while _level<>-1 do
    insert into aRoleRef(iid,roleId,roleIdParent,level)
      values(_iid,_roleId,_roleIdParent,_level);
    set _roleIdParent=(select a.roleIdParent from aRole a where a.iid=_iid and a.id=_roleIdParent);
    if _roleIdParent<>'' then
      set _level=_level+1;
    else
      set _level=-1;
    end if;
  end while;

end
`,
  aBuildRoleIncRef: `
create procedure aBuildRoleIncRef (in _iid int,in _roleId int)
begin

  insert into aRoleIncRef(iid,roleId,roleIdInc,roleIdSrc)
    select _iid,_roleId,a.roleIdInc,a.roleId from aRoleInc a
      where a.iid=_iid and a.roleId in (select b.roleIdParent from aRoleRef b where b.iid=_iid and b.roleId=_roleId);

end
`,
  aBuildRoleExpand: `
create procedure aBuildRoleExpand (in _iid int,in _roleId int)
begin

  insert into aRoleExpand(iid,roleId,roleIdBase)
    select a.iid,a.roleId,a.roleIdParent from aRoleRef a
      where a.iid=_iid and a.roleId=_roleId;

  insert into aRoleExpand(iid,roleId,roleIdBase)
    select a.iid,a.roleId,a.roleIdInc from aRoleIncRef a
      where a.iid=_iid and a.roleId=_roleId;

end
`,
};

module.exports = {
  tables,
  views,
  functions,
  procedures,
};


/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = function(ctx) {

  class VersionUpdate2 {

    async run() {
      // enable 0
      await ctx.model.query('SET SESSION sql_mode=\'NO_AUTO_VALUE_ON_ZERO\'');
      // add userId 0
      await ctx.db.insert('aUser', {
        id: 0,
        iid: 0,
        userName: 'system',
        realName: 'system',
      });
      // add roleId 0
      await ctx.db.insert('aRole', {
        id: 0,
        iid: 0,
        roleName: 'system',
        catalog: 1,
        system: 1,
        roleIdParent: -1,
      });
      // disable 0
      await ctx.model.query('SET SESSION sql_mode=\'\'');
    }

  }

  return VersionUpdate2;
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

const initData = __webpack_require__(53);

module.exports = function(ctx) {

  class VersionInit {

    async run(options) {
      // roles
      const roleIds = await this._initRoles();
      await ctx.meta.role.build();
      // users
      await this._initUsers(roleIds, options);
    }

    // roles
    async _initRoles() {
      const roleIds = {};
      roleIds.system = 0;
      // system roles
      for (const roleName of ctx.constant.systemRoles) {
        const role = initData.roles[roleName];
        role.roleIdParent = roleIds[role.roleIdParent];
        roleIds[roleName] = await ctx.meta.role.add(role);
      }
      return roleIds;
    }

    // users
    async _initUsers(roleIds, options) {
      // root user
      const userRoot = initData.users.root;
      userRoot.email = options.email;
      userRoot.mobile = options.mobile;
      const userId = await ctx.meta.user.add(userRoot.item);
      // user->role
      await ctx.meta.role.addUserRole({
        userId,
        roleId: roleIds[userRoot.roleId],
      });
    }

  }

  return VersionInit;
};


/***/ }),
/* 53 */
/***/ (function(module, exports) {

// roles
const roles = {
  root: {
    roleName: 'root', leader: 0, catalog: 1, system: 1, sorting: 0, roleIdParent: 'system',
  },
  anonymous: {
    roleName: 'anonymous', leader: 0, catalog: 0, system: 1, sorting: 1, roleIdParent: 'root',
  },
  authenticated: {
    roleName: 'authenticated', leader: 0, catalog: 1, system: 1, sorting: 2, roleIdParent: 'root',
  },
  registered: {
    roleName: 'registered', leader: 0, catalog: 0, system: 1, sorting: 1, roleIdParent: 'authenticated',
  },
  activated: {
    roleName: 'activated', leader: 0, catalog: 0, system: 1, sorting: 2, roleIdParent: 'authenticated',
  },
  superuser: {
    roleName: 'superuser', leader: 0, catalog: 0, system: 1, sorting: 3, roleIdParent: 'authenticated',
  },
  organization: {
    roleName: 'organization', leader: 0, catalog: 1, system: 1, sorting: 4, roleIdParent: 'authenticated',
  },
  internal: {
    roleName: 'internal', leader: 0, catalog: 1, system: 1, sorting: 1, roleIdParent: 'organization',
  },
  external: {
    roleName: 'external', leader: 0, catalog: 1, system: 1, sorting: 2, roleIdParent: 'organization',
  },
};

const users = {
  root: {
    item: {
      userName: 'root',
      realName: 'root',
      email: 'demo@cabloy.org',
      mobile: null,
      avatar: null,
      motto: null,
      locale: null,
    },
    roleId: 'superuser',
  },
};

module.exports = {
  roles,
  users,
};


/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = app => {

  class Base extends app.Service {

    modules() {
      return this.ctx.meta.base.modules();
    }

    locales() {
      return this.ctx.meta.base.locales();
    }

    atomClasses() {
      return this.ctx.meta.base.atomClasses();
    }

    actions() {
      return this.ctx.meta.base.actions();
    }

    flags() {
      return this.ctx.meta.base.flags();
    }

    menus() {
      return this.ctx.meta.base.menus();
    }

    functions() {
      return this.ctx.meta.base.functions();
    }

  }

  return Base;
};


/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = app => {

  class User extends app.Service {

    async getLabels({ user }) {
      const res = await this.ctx.model.label.get({
        userId: user.id,
      });
      return res ? JSON.parse(res.labels) : null;
    }

    async setLabels({ labels, user }) {
      const labels2 = JSON.stringify(labels);
      const res = await this.ctx.model.label.get({
        userId: user.id,
      });
      if (!res) {
        await this.ctx.model.label.insert({
          userId: user.id,
          labels: labels2,
        });
      } else {
        await this.ctx.model.label.update({
          id: res.id,
          labels: labels2,
        });
      }
    }

  }

  return User;
};


/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = app => {

  class Atom extends app.Service {

    async create({ atomClass, user }) {
      return await this.ctx.meta.atom.create({ atomClass, user });
    }

    async read({ key, user }) {
      return await this.ctx.meta.atom.read({ key, user });
    }

    async select({ atomClass, options, user }) {
      return await this.ctx.meta.atom.select({ atomClass, options, user });
    }

    async write({ key, item, validation, user }) {
      return await this.ctx.meta.atom.write({ key, item, validation, user });
    }

    async delete({ key, user }) {
      return await this.ctx.meta.atom.delete({ key, user });
    }

    async action({ action, key, user }) {
      return await this.ctx.meta.atom.action({ action, key, user });
    }

    async enable({ key, atom, user }) {
      return await this.ctx.meta.atom.enable({ key, atom, user });
    }

    async star({ key, atom, user }) {
      return await this.ctx.meta.atom.star({ key, atom, user });
    }

    async labels({ key, atom, user }) {
      return await this.ctx.meta.atom.labels({ key, atom, user });
    }

    async actions({ key, basic, user }) {
      return await this.ctx.meta.atom.actions({ key, basic, user });
    }

    async schema({ atomClass, schema }) {
      return await this.ctx.meta.atom.schema({ atomClass, schema });
    }

    async validator({ atomClass }) {
      return await this.ctx.meta.atom.validator({ atomClass });
    }

  }

  return Atom;
};


/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomClass extends app.Service {

    async register({ module, atomClassName, atomClassIdParent }) {
      return await this.ctx.meta.atomClass.register({ module, atomClassName, atomClassIdParent });
    }

    validatorSearch({ module, atomClassName }) {
      return this.ctx.meta.atomClass.validatorSearch({ module, atomClassName });
    }

  }

  return AtomClass;
};


/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomAction extends app.Service {

    async register({ atomClassId, code }) {
      return await this.ctx.meta.atomAction.register({ atomClassId, code });
    }

  }

  return AtomAction;
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(3);
const mparse = require3('egg-born-mparse').default;

module.exports = app => {

  class Auth extends app.Service {

    // register all authProviders
    async registerAllProviders() {
      for (const relativeName in this.app.meta.modules) {
        const module = this.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.auth && module.main.meta.auth.providers) {
          for (const providerName in module.main.meta.auth.providers) {
            await this.registerProviderInstances(module.info.relativeName, providerName);
          }
        }
      }
    }

    async registerProviderInstances(moduleRelativeName, providerName) {
      // all instances
      const instances = await this.ctx.model.query('select * from aInstance a where a.disabled=0');
      for (const instance of instances) {
        await this.registerProviderInstance(instance.id, moduleRelativeName, providerName);
      }
      // config
      const moduleInfo = mparse.parseInfo(moduleRelativeName);
      const config = {
        loginURL: `/api/${moduleInfo.url}/passport/${moduleRelativeName}/${providerName}`,
        callbackURL: `/api/${moduleInfo.url}/passport/${moduleRelativeName}/${providerName}/callback`,
      };
      // authenticate
      const authenticate = createAuthenticate(moduleRelativeName, providerName, config);
      // mount routes
      const routes = [
        { name: `get:${config.loginURL}`, method: 'get', path: '/' + config.loginURL, middlewares: [ authenticate ], meta: { auth: { enable: false } } },
        { name: `post:${config.loginURL}`, method: 'post', path: '/' + config.loginURL, middlewares: [ authenticate ], meta: { auth: { enable: false } } },
        { name: `get:${config.callbackURL}`, method: 'get', path: '/' + config.callbackURL, middlewares: [ authenticate ], meta: { auth: { enable: false } } },
        { name: `post:${config.callbackURL}`, method: 'post', path: '/' + config.callbackURL, middlewares: [ authenticate ], meta: { auth: { enable: false } } },
      ];
      for (const route of routes) {
        this.app.meta.router.unRegister(route.name);
        this.app.meta.router.register(moduleInfo, route);
      }
    }

    async registerProviderInstance(iid, moduleRelativeName, providerName) {
      // provider of db
      const providerItem = await this.ctx.db.get('aAuthProvider', {
        iid,
        module: moduleRelativeName,
        providerName,
      });
      if (providerItem && providerItem.disabled === 0) {
        // config
        const config = JSON.parse(providerItem.config);
        config.passReqToCallback = true;
        config.failWithError = false;
        // module
        const module = this.app.meta.modules[moduleRelativeName];
        // provider
        const provider = module.main.meta.auth.providers[providerName](this.app);
        // install strategy
        const strategyName = `${iid}:${moduleRelativeName}:${providerName}`;
        this.app.passport.unuse(strategyName);
        this.app.passport.use(strategyName, new provider.strategy(config, provider.callback));
      }
    }

  }

  return Auth;
};

function createAuthenticate(moduleRelativeName, providerName, _config) {
  return async function(ctx, next) {
    // provider of db
    const providerItem = await ctx.model.authProvider.get({
      module: moduleRelativeName,
      providerName,
    });
    if (!providerItem || providerItem.disabled !== 0) ctx.throw(423);

    // returnTo
    if (ctx.url.indexOf(_config.callbackURL) === -1) {
      if (ctx.request.query && ctx.request.query.returnTo) {
        ctx.session.returnTo = ctx.request.query.returnTo;
      } else {
        delete ctx.session.returnTo; // force to delete
      }
    }

    // config
    const config = JSON.parse(providerItem.config);
    config.passReqToCallback = true;
    config.failWithError = false;
    config.loginURL = _config.loginURL;
    config.callbackURL = _config.callbackURL;
    config.state = ctx.request.query.state;

    // invoke authenticate
    const strategyName = `${ctx.instance.id}:${moduleRelativeName}:${providerName}`;
    const authenticate = ctx.app.passport.authenticate(strategyName, config);
    await authenticate(ctx, next);
  };
}



/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = app => {

  class Function extends app.Service {

    async list({ options, user }) {
      return await this.ctx.meta.function.list({ options, user });
    }

    async star({ id, star, user }) {
      return await this.ctx.meta.function.star({ id, star, user });
    }

    async check({ functions, user }) {
      return await this.ctx.meta.function.check({ functions, user });
    }

    async checkLocale({ locale }) {
      return await this.ctx.meta.function._checkLocale({ locale });
    }

    async register({ module, name }) {
      return await this.ctx.meta.function.register({ module, name });
    }

    async clearLocales() {
      // clear all instances
      await this.ctx.model.query('delete from aFunctionLocale');
    }

  }

  return Function;
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

const atom = __webpack_require__(4);
const atomAction = __webpack_require__(2);
const atomClass = __webpack_require__(1);
const auth = __webpack_require__(18);
const authProvider = __webpack_require__(19);
const role = __webpack_require__(10);
const roleInc = __webpack_require__(11);
const roleIncRef = __webpack_require__(62);
const roleRef = __webpack_require__(63);
const roleRight = __webpack_require__(13);
const roleRightRef = __webpack_require__(14);
const user = __webpack_require__(16);
const userAgent = __webpack_require__(17);
const userRole = __webpack_require__(12);
const label = __webpack_require__(64);
const atomLabel = __webpack_require__(6);
const atomLabelRef = __webpack_require__(7);
const atomStar = __webpack_require__(5);
const func = __webpack_require__(0);
const functionStar = __webpack_require__(8);
const functionLocale = __webpack_require__(9);
const roleFunction = __webpack_require__(15);

module.exports = app => {
  const models = {
    atom,
    atomAction,
    atomClass,
    auth,
    authProvider,
    role,
    roleInc,
    roleIncRef,
    roleRef,
    roleRight,
    roleRightRef,
    user,
    userAgent,
    userRole,
    label,
    atomLabel,
    atomLabelRef,
    atomStar,
    function: func,
    functionStar,
    functionLocale,
    roleFunction,
  };
  return models;
};


/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = app => {

  class RoleIncRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleIncRef', options: { disableDeleted: true } });
    }

  }

  return RoleIncRef;
};


/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = app => {

  class RoleRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleRef', options: { disableDeleted: true } });
    }

    async getParent({ roleId, level = 1 }) {
      const roleRef = await this.get({
        roleId,
        level,
      });
      return roleRef;
    }

  }

  return RoleRef;
};


/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = app => {

  class Label extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aLabel', options: { disableDeleted: true } });
    }

  }

  return Label;
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  // schemas
  const schemas = __webpack_require__(66)(app);
  // meta
  const meta = {
    sequence: {
      providers: {
        draft: {
          start: 0,
          expression({ ctx, value }) {
            return ++value;
          },
        },
      },
    },
    validation: {
      validators: {
        user: {
          schemas: 'user',
        },
      },
      keywords: {},
      schemas: {
        user: schemas.user,
      },
    },
  };
  return meta;
};


/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  // user
  schemas.user = {
    type: 'object',
    properties: {
      userName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        notEmpty: true,
      },
      realName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Realname',
        notEmpty: true,
      },
      email: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Email',
        notEmpty: true,
        format: 'email',
      },
      mobile: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Mobile',
        notEmpty: true,
      },
      motto: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Motto',
      },
      locale: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Locale',
        ebOptionsUrl: '/a/base/base/locales',
        ebOptionsUrlParams: null,
      },
    },
  };

  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map