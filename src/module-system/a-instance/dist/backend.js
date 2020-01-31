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

const routes = __webpack_require__(2);
const services = __webpack_require__(5);
const config = __webpack_require__(8);
const locales = __webpack_require__(9);
const errors = __webpack_require__(11);
const middlewares = __webpack_require__(12);

// eslint-disable-next-line
module.exports = app => {

  // models
  const models = __webpack_require__(14)(app);
  // meta
  const meta = __webpack_require__(15)(app);

  return {
    routes,
    services,
    config,
    locales,
    errors,
    middlewares,
    models,
    meta,
  };

};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(3);
const instance = __webpack_require__(4);

module.exports = [
  // version
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/init', controller: version, middlewares: 'inner', meta: { instance: { enable: false } } },
  // instance
  { method: 'post', path: 'instance/item', controller: instance, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
  { method: 'post', path: 'instance/save', controller: instance, middlewares: 'validate',
    meta: {
      validate: { validator: 'instance' },
      right: { type: 'function', module: 'a-settings', name: 'settings' },
    },
  },
  { method: 'post', path: 'instance/getConfigsPreview', controller: instance, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
  { method: 'post', path: 'instance/startup', controller: instance, middlewares: 'inner', meta: { instance: { enable: true } } },
  { method: 'post', path: 'instance/broadcast/resetCache', controller: instance, middlewares: 'inner' },
];


/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports) {

module.exports = app => {
  class InstanceController extends app.Controller {

    async item() {
      const res = await this.service.instance.item();
      this.ctx.success(res);
    }

    async save() {
      await this.service.instance.save({
        data: this.ctx.request.body.data,
      });
      this.ctx.success();
    }

    async getConfigsPreview() {
      const res = await this.service.instance.getConfigsPreview();
      this.ctx.success(res);
    }

    async startup() {
      // do nothing
      this.ctx.success();
    }

    async resetCache() {
      // do nothing
      this.ctx.success();
    }

  }
  return InstanceController;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(6);
const instance = __webpack_require__(7);

module.exports = {
  version,
  instance,
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // create table: aInstance
        const sql = `
          CREATE TABLE aInstance (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            disabled int(11) DEFAULT '0',
            name varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.db.query(sql);
      }
      if (options.version === 2) {
        // aInstance
        const sql = `
          ALTER TABLE aInstance
          ADD COLUMN title varchar(255) DEFAULT NULL
        `;
        await this.ctx.model.query(sql);
      }
      if (options.version === 3) {
        // aInstance
        const sql = `
          ALTER TABLE aInstance
          ADD COLUMN meta json DEFAULT NULL
        `;
        await this.ctx.model.query(sql);
      }
      if (options.version === 4) {
        // aInstance
        const sql = `
          ALTER TABLE aInstance
          CHANGE COLUMN meta config json DEFAULT NULL
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        await this.ctx.db.insert('aInstance', { name: options.subdomain, disabled: 0 });
      }
      if (options.version === 2) {
        if (options.title) {
          const instance = await this.ctx.db.get('aInstance', { name: options.subdomain });
          await this.ctx.db.update('aInstance', { id: instance.id, title: options.title });
        }
      }
      // if (options.version === 3) {
      //   if (options.meta) {
      //     const instance = await this.ctx.db.get('aInstance', { name: options.subdomain });
      //     await this.ctx.db.update('aInstance', { id: instance.id, meta: JSON.stringify(options.meta) });
      //   }
      // }
      if (options.version === 4) {
        const config = options.config || {};
        const instance = await this.ctx.db.get('aInstance', { name: options.subdomain });
        await this.ctx.db.update('aInstance', { id: instance.id, config: JSON.stringify(config) });
      }
    }

  }

  return Version;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');

module.exports = app => {

  class Instance extends app.Service {

    async item() {
      return await this.ctx.db.get('aInstance', { id: this.ctx.instance.id });
    }

    async save({ data }) {
      // update
      await this.ctx.db.update('aInstance', {
        id: this.ctx.instance.id,
        title: data.title,
        config: data.config,
      });
      // broadcast
      this.ctx.app.meta.broadcast.emit({
        subdomain: this.ctx.subdomain,
        module: 'a-instance',
        broadcastName: 'resetCache',
        data: null,
      });
    }

    async getConfigsPreview() {
      const instance = await this.item();
      instance.config = JSON.parse(instance.config);
      if (!this.ctx.app.meta._configsOriginal) this.ctx.app.meta._configsOriginal = extend(true, {}, this.ctx.app.meta.configs);
      this.ctx.app.meta.configs = extend(true, {}, this.ctx.app.meta._configsOriginal, instance.config);
      return { data: this.ctx.app.meta.configs };
    }

  }

  return Instance;
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    instance: {
      global: true,
      dependencies: 'cachemem',
      ignore: /(\/version\/(update))/,
    },
  };

  // startups
  config.startups = {
    startupInstance: {
      type: 'all',
      instance: true,
      path: 'instance/startup',
    },
  };

  // broadcasts
  config.broadcasts = {
    resetCache: {
      path: 'instance/broadcast/resetCache',
    },
  };

  return config;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(10),
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {
  Instance: '实例',
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const instance = __webpack_require__(13);

module.exports = {
  instance,
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');
const chalk = require3('chalk');
const boxen = require3('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

const regexURL_resetCache = /\/a\/instance\/instance\/broadcast\/resetCache/;
const regexURL_versionInit = /\/version\/init/;

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function instance(ctx, next) {
    // cache
    const cacheMem = ctx.cache.mem.module(moduleInfo.relativeName);
    let instance = regexURL_resetCache.test(ctx.url) ? null : cacheMem.get('instance');
    if (!instance) {
      instance = await ctx.db.get('aInstance', { name: ctx.subdomain });
      if (instance) {
        // config
        instance.config = JSON.parse(instance.config) || {};
        // cache configs
        const instanceConfigs = extend(true, {}, ctx.app.meta.configs, instance.config);
        cacheMem.set('instanceConfigs', instanceConfigs);
        // cache instance
        cacheMem.set('instance', instance);
      }
    }

    // try to save host/protocol to config
    if (instance && !instance.disabled && ctxHostValid(ctx)) {
      if (!instance.config['a-base']) instance.config['a-base'] = {};
      const aBase = instance.config['a-base'];
      if (aBase.host !== ctx.host || aBase.protocol !== ctx.protocol) {
        aBase.host = ctx.host;
        aBase.protocol = ctx.protocol;
        // update
        await ctx.db.update('aInstance', {
          id: instance.id,
          config: JSON.stringify(instance.config) });
        // broadcast
        ctx.app.meta.broadcast.emit({
          subdomain: ctx.subdomain,
          module: 'a-instance',
          broadcastName: 'resetCache',
          data: null,
        });
      }
    }

    if (!regexURL_versionInit.test(ctx.request.url) && (!instance || instance.disabled)) {
      // prompt
      if (!instance && ctx.app.meta.isLocal) {
        const urlInfo = ctx.locale === 'zh-cn' ? 'https://cabloy.com/zh-cn/articles/multi-instance.html' : 'https://cabloy.com/articles/multi-instance.html';
        let message = `Please add instance in ${chalk.keyword('cyan')('src/backend/config/config.local.js')}`;
        message += '\n' + chalk.keyword('orange')(`{ subdomain: '${ctx.subdomain}', password: '', title: '' }`);
        message += `\nMore info: ${chalk.keyword('cyan')(urlInfo)}`;
        console.log('\n' + boxen(message, boxenOptions));
      }
      // locked
      ctx.throw(423);
    }

    ctx.instance = instance;

    // next
    await next();
  };
};

function ctxHostValid(ctx) {
  return !ctx.innerAccess && ctx.host && ctx.protocol && ctx.host !== '127.0.0.1' && ctx.host !== 'localhost';
}


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {
  const models = {
  };
  return models;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  const schemas = __webpack_require__(16)(app);
  const meta = {
    validation: {
      validators: {
        instance: {
          schemas: 'instance',
        },
      },
      keywords: {},
      schemas: {
        instance: schemas.instance,
      },
    },
    settings: {
      instance: {
        actionPath: 'instance/config',
      },
    },
  };
  return meta;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  // instance
  schemas.instance = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Subdomain',
        ebReadOnly: true,
      },
      title: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Title',
      },
      config: {
        type: 'string',
        ebType: 'text',
        ebTextarea: true,
        ebTitle: 'Config',
        notEmpty: true,
      },
    },
  };

  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map