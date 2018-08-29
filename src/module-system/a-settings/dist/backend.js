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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = app => {

  class Settings extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aSettings', options: { disableDeleted: true } });
    }

  }

  return Settings;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = app => {

  class SettingsRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aSettingsRef', options: { disableDeleted: true } });
    }

  }

  return SettingsRef;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
  scene: {
    user: 1,
    instance: 2,
  },
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const services = __webpack_require__(5);
const models = __webpack_require__(8);
const config = __webpack_require__(9);
const locales = __webpack_require__(10);
const errors = __webpack_require__(12);
const middlewares = __webpack_require__(13);
const constants = __webpack_require__(3);

// eslint-disable-next-line
module.exports = app => {

  // meta
  const meta = __webpack_require__(16)(app);
  const routes = __webpack_require__(19)(app);

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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(6);
const settings = __webpack_require__(7);

module.exports = {
  version,
  settings,
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // create table: aSettings
        let sql = `
          CREATE TABLE aSettings (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            scene int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            value json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aSettingsRef
        sql = `
          CREATE TABLE aSettingsRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            scene int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            name varchar(255) DEFAULT NULL,
            value json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        // function
        const func = await this.ctx.meta.function.get({
          name: 'settings',
        });
        // role function right
        const role = await this.ctx.meta.role.getSystemRole({ roleName: 'superuser' });
        await this.ctx.meta.role.addRoleFunction({
          roleId: role.id,
          functionId: func.id,
        });
      }
    }

  }

  return Version;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = app => {

  let _instanceList = null;
  let _userList = null;

  class Settings extends app.Service {

    // instance

    instanceList() {
      if (!_instanceList) {
        _instanceList = this._prepareSettingsList('instance');
      }
      return _instanceList;
    }

    async instanceLoad({ module }) {
      const validator = await this.ctx.meta.settings.loadValidatorInstance({ module });
      const data = await this.ctx.meta.settings.loadSettingsInstance({ module });
      return {
        module,
        validator: validator.validator,
        data,
      };
    }

    async instanceSave({ module, data }) {
      await this.ctx.meta.settings.saveSettingsInstance({ module, data });
    }

    // user

    userList() {
      if (!_userList) {
        _userList = this._prepareSettingsList('user');
      }
      return _userList;
    }

    async userLoad({ module }) {
      const validator = await this.ctx.meta.settings.loadValidatorUser({ module });
      const data = await this.ctx.meta.settings.loadSettingsUser({ module });
      return {
        module,
        validator: validator.validator,
        data,
      };
    }

    async userSave({ module, data }) {
      await this.ctx.meta.settings.saveSettingsUser({ module, data });
    }

    //

    _prepareSettingsList(scene) {
      const list = [];
      for (const relativeName in this.app.meta.modules) {
        const module = this.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.settings && module.main.meta.settings[scene]) {
          const settings = module.main.meta.settings[scene];
          const item = {
            module: relativeName,
            validator: settings.validator,
          };
          if (settings.actionComponent || settings.actionPath) {
            item.actionModule = item.module;
            item.actionComponent = settings.actionComponent;
            item.actionPath = settings.actionPath;
          }
          list.push(item);
        }
      }
      return list;
    }

  }

  return Settings;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const settings = __webpack_require__(1);
const settingsRef = __webpack_require__(2);

module.exports = {
  settings,
  settingsRef,
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    settings: {
      global: true,
      dependencies: 'validation',
    },
  };

  // schedules
  config.schedules = {
  };

  // settings
  config.settings = {
    instance: {
      info: {
        title: 'title1',
      },
    },
    user: {
      info: {
        username: 'zhennann',
      },
      extra: {
        extra: {
          info: {
            mobile: '1',
            sex: 1,
            language: 'en-us',
          },
        },
      },
    },
  };

  return config;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(11),
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = {
  Settings: '设置',
  test: '测试',
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const settings = __webpack_require__(14);

module.exports = {
  settings,
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const SettingsFn = __webpack_require__(15);
const SETTINGS = Symbol('CTX#__SETTINGS');

module.exports = () => {
  return async function settings(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'settings', {
      get() {
        if (ctx.meta[SETTINGS] === undefined) {
          ctx.meta[SETTINGS] = new (SettingsFn(ctx))();
        }
        return ctx.meta[SETTINGS];
      },
    });

    // next
    await next();
  };
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');
const modelSettingsFn = __webpack_require__(1);
const modelSettingsRefFn = __webpack_require__(2);
const constants = __webpack_require__(3);

const Fn = module.exports = ctx => {

  class Settings {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._modelSettings = null;
      this._modelSettingsRef = null;
    }

    // other module's settings
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get modelSettings() {
      if (!this._modelSettings) this._modelSettings = new (modelSettingsFn(ctx.app))(ctx);
      return this._modelSettings;
    }

    get modelSettingsRef() {
      if (!this._modelSettingsRef) this._modelSettingsRef = new (modelSettingsRefFn(ctx.app))(ctx);
      return this._modelSettingsRef;
    }

    // get

    async getUser({ module, name }) {
      return await this._get({ scene: 'user', module, name });
    }

    async getInstance({ module, name }) {
      return await this._get({ scene: 'instance', module, name });
    }


    // user

    async loadSettingsUser(ops) {
      ops = ops || { };
      return await this._loadSettings({ scene: 'user', module: ops.module });
    }

    async loadValidatorUser(ops) {
      ops = ops || { };
      return this._getValidator({ scene: 'user', module: ops.module });
    }

    async saveSettingsUser({ module, data }) {
      return await this._saveSettings({ scene: 'user', module, data });
    }

    // instance

    async loadSettingsInstance(ops) {
      ops = ops || { };
      return await this._loadSettings({ scene: 'instance', module: ops.module });
    }

    async loadValidatorInstance(ops) {
      ops = ops || { };
      return this._getValidator({ scene: 'instance', module: ops.module });
    }

    async saveSettingsInstance({ module, data }) {
      return await this._saveSettings({ scene: 'instance', module, data });
    }

    // function

    async _get({ scene, module, name }) {
      module = module || this.moduleName;
      const res = await this.modelSettingsRef.get({
        module,
        scene: constants.scene[scene],
        userId: scene === 'user' ? ctx.user.op.id : 0,
        name,
      });
      return res ? JSON.parse(res.value) : this._parse(ctx.config.module(module).settings[scene], name);
    }

    _parse(data, path) {
      for (const name of path.split('/')) {
        if (name) data = data[name];
      }
      return data;
    }

    async _loadSettings({ scene, module }) {
      module = module || this.moduleName;
      const res = await this.modelSettings.get({
        module,
        scene: constants.scene[scene],
        userId: scene === 'user' ? ctx.user.op.id : 0,
      });
      // always extend config, as maybe has new values
      const config = ctx.config.module(module).settings[scene];
      return res ? extend(true, {}, config, JSON.parse(res.value)) : config;
    }

    async _saveSettings({ scene, module, data }) {
      module = module || this.moduleName;
      const validator = this._getValidator({ scene, module });
      if (!validator) ctx.throw(404); // not found
      await ctx.meta.validation.validate({
        module: validator.module,
        validator: validator.validator,
        schema: null,
        data });
      // update aSettings
      const _data = await this.modelSettings.get({
        module,
        scene: constants.scene[scene],
        userId: scene === 'user' ? ctx.user.op.id : 0,
      });
      if (!_data) {
        // new
        await this.modelSettings.insert({
          module,
          scene: constants.scene[scene],
          userId: scene === 'user' ? ctx.user.op.id : 0,
          value: JSON.stringify(data),
        });
      } else {
        await this.modelSettings.update({
          id: _data.id,
          value: JSON.stringify(data),
        });
      }
      // save aSettingsRef
      await this._saveSettingsRef({ scene, module, data });
    }

    async _saveSettingsRef({ scene, module, data }) {
      // remove aSettingsRef
      await this.modelSettingsRef.delete({
        module,
        scene: constants.scene[scene],
        userId: scene === 'user' ? ctx.user.op.id : 0,
      });
      // update aSettingsRef
      await this._saveSettingsRef1({ scene, module, data, schemaName: null, path: '' });
    }

    async _saveSettingsRef1({ scene, module, data, schemaName, path }) {
      const schema = this._getSchema({ scene, module, schemaName });
      await this._saveSettingsRef2({ scene, module, data, schema: schema.schema, path });
    }

    async _saveSettingsRef2({ scene, module, data, schema, path }) {
      for (const key in schema.properties) {
        const subSchema = schema.properties[key];
        const subPath = `${path}/${key}`;
        const subData = data[key];
        if (subSchema.$ref) {
          await this._saveSettingsRef1({ scene, module, data: subData, schemaName: subSchema.$ref, path: subPath });
        } else if (subSchema.ebType === 'group') {
          await this._saveSettingsRef2({ scene, module, data: subData, schema: subSchema, path: subPath });
        } else {
          await this.modelSettingsRef.insert({
            module,
            scene: constants.scene[scene],
            userId: scene === 'user' ? ctx.user.op.id : 0,
            name: subPath,
            value: JSON.stringify(subData),
          });
        }
      }
    }

    _getValidator({ scene, module }) {
      module = module || this.moduleName;
      const validator = ctx.app.meta.modules[module].main.meta.settings[scene].validator;
      return validator ? { module, scene, validator } : null;
    }

    _getSchema({ scene, module, schemaName }) {
      const validator = this._getValidator({ scene, module });
      if (!validator) return null;
      const _schema = ctx.meta.validation.getSchema({ module: validator.module, validator: validator.validator, schema: schemaName });
      return extend(true, {}, validator, { schema: _schema });
    }

  }

  return Settings;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');

module.exports = app => {
  const meta = {
    base: {
      functions: {
        settings: {
          title: 'Settings',
          scene: 'tools',
          actionPath: 'instance/list',
          sorting: 1,
          menu: 1,
        },
      },
    },
  };
  // only support in test
  if (app.meta.isTest) {
    // schemas
    const schemas = __webpack_require__(17)(app);
    // keywords
    const keywords = __webpack_require__(18)(app);
    // meta
    extend(true, meta, {
      settings: {
        user: {
          validator: 'userTest',
        },
        instance: {
          validator: 'instanceTest',
        },
      },
      validation: {
        validators: {
          userTest: {
            schemas: 'user,userExtra',
          },
          instanceTest: {
            schemas: 'instance',
          },
        },
        keywords: {
          'x-languages': keywords.languages,
        },
        schemas: {
          user: schemas.user,
          userExtra: schemas.userExtra,
          instance: schemas.instance,
        },
      },
    });
  }
  return meta;
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  schemas.user = {
    type: 'object',
    properties: {
      info: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          username: {
            type: 'string',
            ebType: 'text',
            ebDescription: '',
            notEmpty: true,
          },
        },
      },
      extra: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Extra Group',
        properties: {
          extra: {
            ebType: 'panel',
            ebTitle: 'Extra',
            $ref: 'userExtra',
          },
        },
      },
    },
  };
  schemas.userExtra = {
    type: 'object',
    ebTitle: 'Extra',
    properties: {
      info: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          mobile: {
            type: 'string',
            ebType: 'text',
            notEmpty: true,
          },
          sex: {
            type: 'number',
            ebType: 'select',
            ebMultiple: false,
            ebOptions: [
              { title: 'Male', value: 1 },
              { title: 'Female', value: 2 },
            ],
            ebParams: {
              openIn: 'page',
              closeOnSelect: true,
            },
          },
          language: {
            type: 'string',
            ebType: 'select',
            ebOptionsUrl: '/a/base/base/locales',
            ebOptionsUrlParams: null,
            'x-languages': true,
          },
        },
        required: [ 'language' ],
      },
    },
  };
  schemas.instance = {
    type: 'object',
    properties: {
      info: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          title: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'title',
            ebDescription: 'website\'s title',
            notEmpty: true,
          },
        },
      },
    },
  };
  return schemas;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const Ajv = require3('ajv');

module.exports = app => {
  const keywords = {};
  keywords.languages = {
    async: true,
    type: 'string',
    errors: true,
    compile(sch, parentSchema) {
      const func = async function(data) {
        const ctx = this;
        const context = arguments.callee.context;
        const locales = await ctx.performAction({
          method: 'post',
          url: context.parentSchema.ebOptionsUrl,
          body: context.parentSchema.ebOptionsUrlParams,
        });
        const index = locales.findIndex(item => item.value === data);
        if (index > -1) return true;
        const errors = [{ keyword: 'x-languages', params: [], message: ctx.text('Not expected value') }];
        throw new Ajv.ValidationError(errors);
      };
      func.context = {
        sch, parentSchema,
      };
      return func;
    },
  };
  return keywords;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(20);
const settings = __webpack_require__(21);
const test = __webpack_require__(22);

module.exports = app => {
  let routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    // settings:instance
    { method: 'post', path: 'settings/instance/list', controller: settings, action: 'instanceList',
      meta: { right: { type: 'function', name: 'settings' } },
    },
    { method: 'post', path: 'settings/instance/load', controller: settings, action: 'instanceLoad',
      meta: { right: { type: 'function', name: 'settings' } },
    },
    { method: 'post', path: 'settings/instance/save', controller: settings, action: 'instanceSave',
      meta: { right: { type: 'function', name: 'settings' } },
    },
    // settings:user
    { method: 'post', path: 'settings/user/list', controller: settings, action: 'userList' },
    { method: 'post', path: 'settings/user/load', controller: settings, action: 'userLoad' },
    { method: 'post', path: 'settings/user/save', controller: settings, action: 'userSave' },
  ];
  if (app.meta.isTest) {
    routes = routes.concat([
      { method: 'get', path: 'test/settings', controller: test, middlewares: 'test' },
    ]);
  }
  return routes;
};


/***/ }),
/* 20 */
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
/* 21 */
/***/ (function(module, exports) {

module.exports = app => {
  class SettingsController extends app.Controller {

    // instance

    instanceList() {
      const res = this.service.settings.instanceList();
      this.ctx.successMore(res, 0, -1);
    }

    async instanceLoad() {
      const res = await this.service.settings.instanceLoad(this.ctx.request.body);
      this.ctx.success(res);
    }

    async instanceSave() {
      const res = await this.service.settings.instanceSave(this.ctx.request.body);
      this.ctx.success(res);
    }

    // user

    userList() {
      const res = this.service.settings.userList();
      this.ctx.successMore(res, 0, -1);
    }

    async userLoad() {
      const res = await this.service.settings.userLoad(this.ctx.request.body);
      this.ctx.success(res);
    }

    async userSave() {
      const res = await this.service.settings.userSave(this.ctx.request.body);
      this.ctx.success(res);
    }

  }
  return SettingsController;
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const assert = require3('assert');

module.exports = app => {
  class TestController extends app.Controller {

    async settings() {

      // user

      // get settings from config
      let data = await this.ctx.meta.settings.getUser({ name: '/info/username' });
      assert(data === 'zhennann');
      data = await this.ctx.meta.settings.getUser({ name: '/extra/extra/info/language' });
      assert(data === 'en-us');

      // load settings
      data = await this.ctx.meta.settings.loadSettingsUser();
      assert(data.info.username === 'zhennann');
      // save settings
      data.extra.extra.info.language = 'zh-cn';
      await this.ctx.meta.settings.saveSettingsUser({ data });

      // get settings from db
      data = await this.ctx.meta.settings.getUser({ name: '/extra/extra/info/language' });
      assert(data === 'zh-cn');

      // instance

      // get settings from config
      data = await this.ctx.meta.settings.getInstance({ name: '/info/title' });
      assert(data === 'title1');

      // laod settings
      data = await this.ctx.meta.settings.loadSettingsInstance();
      assert(data.info.title === 'title1');
      // save settings
      data.info.title = 'title2';
      await this.ctx.meta.settings.saveSettingsInstance({ data });

      // get settings from db
      data = await this.ctx.meta.settings.getInstance({ name: '/info/title' });
      assert(data === 'title2');

      this.ctx.success();
    }

  }
  return TestController;
};



/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map