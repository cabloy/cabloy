/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 564:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const constants = __webpack_require__(479);

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Settings extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'settings');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get modelSettings() {
      return ctx.model.module(moduleInfo.relativeName).settings;
    }

    get modelSettingsRef() {
      return ctx.model.module(moduleInfo.relativeName).settingsRef;
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
      ops = ops || {};
      return await this._loadSettings({ scene: 'user', module: ops.module });
    }

    async loadValidatorUser(ops) {
      ops = ops || {};
      return this._getValidator({ scene: 'user', module: ops.module });
    }

    async saveSettingsUser({ module, data }) {
      return await this._saveSettings({ scene: 'user', module, data });
    }

    // instance

    async loadSettingsInstance(ops) {
      ops = ops || {};
      return await this._loadSettings({ scene: 'instance', module: ops.module });
    }

    async loadValidatorInstance(ops) {
      ops = ops || {};
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
        userId: scene === 'user' ? ctx.state.user.op.id : 0,
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
        userId: scene === 'user' ? ctx.state.user.op.id : 0,
      });
      // always extend config, as maybe has new values
      const config = ctx.config.module(module).settings[scene];
      return res ? ctx.bean.util.extend({}, config, JSON.parse(res.value)) : config;
    }

    async _saveSettings({ scene, module, data }) {
      module = module || this.moduleName;
      const validator = this._getValidator({ scene, module });
      if (!validator) ctx.throw(404); // not found
      await ctx.bean.validation.validate({
        module: validator.module,
        validator: validator.validator,
        schema: null,
        data,
        filterOptions: true,
      });
      // update aSettings
      const _data = await this.modelSettings.get({
        module,
        scene: constants.scene[scene],
        userId: scene === 'user' ? ctx.state.user.op.id : 0,
      });
      if (!_data) {
        // new
        await this.modelSettings.insert({
          module,
          scene: constants.scene[scene],
          userId: scene === 'user' ? ctx.state.user.op.id : 0,
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
        userId: scene === 'user' ? ctx.state.user.op.id : 0,
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
        if (!subSchema.type) continue;
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
            userId: scene === 'user' ? ctx.state.user.op.id : 0,
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
      const schema = ctx.bean.validation.getSchema({
        module: validator.module,
        validator: validator.validator,
        schema: schemaName,
      });
      return ctx.bean.util.extend({}, schema);
    }
  }

  return Settings;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
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
const beanSettings = __webpack_require__(564);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // global
    settings: {
      mode: 'ctx',
      bean: beanSettings,
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

module.exports = {
  scene: {
    user: 1,
    instance: 2,
  },
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  Settings: '设置',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
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
      atomName: 'Settings',
      atomStaticKey: 'settings',
      atomRevision: 1,
      atomCategoryId: 'a-base:function.Tools',
      resourceType: 'a-base:function',
      resourceConfig: JSON.stringify({
        actionPath: '/a/settings/instance/list',
      }),
      resourceRoles: 'template.system',
    },
  ];
  return resources;
};


/***/ }),

/***/ 269:
/***/ ((module) => {

module.exports = app => {
  class SettingsController extends app.Controller {
    // instance

    instanceList() {
      const res = this.service.settings.instanceList();
      this.ctx.successMore(res, 0, -1);
    }

    async instanceLoad() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.settings.instanceLoad(this.ctx.request.body);
      this.ctx.success(res);
    }

    async instanceSave() {
      // check demo
      this.ctx.bean.util.checkDemo();
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

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const settings = __webpack_require__(269);

module.exports = app => {
  const controllers = {
    settings,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const services = __webpack_require__(214);
const models = __webpack_require__(230);
const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);
const constants = __webpack_require__(479);

// eslint-disable-next-line
module.exports = app => {
  // beans
  const beans = __webpack_require__(187)(app);
  // meta
  const meta = __webpack_require__(458)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);

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
  // static
  const staticResources = __webpack_require__(429)(app);
  const meta = {
    base: {
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 202:
/***/ ((module) => {

module.exports = app => {
  class Settings extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aSettings', options: { disableDeleted: true } });
    }
  }

  return Settings;
};


/***/ }),

/***/ 771:
/***/ ((module) => {

module.exports = app => {
  class SettingsRef extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aSettingsRef', options: { disableDeleted: true } });
    }
  }

  return SettingsRef;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const settings = __webpack_require__(202);
const settingsRef = __webpack_require__(771);

module.exports = {
  settings,
  settingsRef,
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // settings:instance
    {
      method: 'post',
      path: 'settings/instance/list',
      controller: 'settings',
      action: 'instanceList',
      meta: { right: { type: 'resource', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'settings/instance/load',
      controller: 'settings',
      action: 'instanceLoad',
      meta: { right: { type: 'resource', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'settings/instance/save',
      controller: 'settings',
      action: 'instanceSave',
      meta: { right: { type: 'resource', name: 'settings' } },
    },
    // settings:user
    { method: 'post', path: 'settings/user/list', controller: 'settings', action: 'userList' },
    { method: 'post', path: 'settings/user/load', controller: 'settings', action: 'userLoad' },
    { method: 'post', path: 'settings/user/save', controller: 'settings', action: 'userSave' },
  ];
  return routes;
};


/***/ }),

/***/ 594:
/***/ ((module) => {

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
      const validator = await this.ctx.bean.settings.loadValidatorInstance({ module });
      const data = await this.ctx.bean.settings.loadSettingsInstance({ module });
      return {
        module,
        validator: validator.validator,
        data,
      };
    }

    async instanceSave({ module, data }) {
      await this.ctx.bean.settings.saveSettingsInstance({ module, data });
    }

    // user

    userList() {
      if (!_userList) {
        _userList = this._prepareSettingsList('user');
      }
      return _userList;
    }

    async userLoad({ module }) {
      const validator = await this.ctx.bean.settings.loadValidatorUser({ module });
      const data = await this.ctx.bean.settings.loadSettingsUser({ module });
      return {
        module,
        validator: validator.validator,
        data,
      };
    }

    async userSave({ module, data }) {
      await this.ctx.bean.settings.saveSettingsUser({ module, data });
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

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const settings = __webpack_require__(594);

module.exports = {
  settings,
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