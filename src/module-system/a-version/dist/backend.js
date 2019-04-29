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

const routes = __webpack_require__(1);
const services = __webpack_require__(4);
const config = __webpack_require__(6);
const locales = __webpack_require__(7);
const errors = __webpack_require__(9);
const constants = __webpack_require__(10);

// eslint-disable-next-line
module.exports = app => {

  return {
    routes,
    services,
    config,
    locales,
    errors,
    constants,
  };

};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(2);

module.exports = [
  { method: 'post', path: 'version/start', controller: version, middlewares: 'inner', meta: { instance: { enable: false }, auth: { enable: false } } },
  { method: 'post', path: 'version/check', controller: version, middlewares: 'inner', meta: { instance: { enable: false }, auth: { enable: false } } },
  { method: 'post', path: 'version/updateModule', controller: version, middlewares: 'inner,transaction', meta: { instance: { enable: false }, auth: { enable: false } } },
  { method: 'post', path: 'version/initModule', controller: version, middlewares: 'inner,transaction', meta: { instance: { enable: false }, auth: { enable: false } } },
  { method: 'post', path: 'version/testModule', controller: version, middlewares: 'inner,transaction', meta: { instance: { enable: false }, auth: { enable: false } } },
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner', meta: { instance: { enable: false }, auth: { enable: false } } },
  { method: 'post', path: 'version/after', controller: version, middlewares: 'inner', meta: { auth: { enable: false } } },
];


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(3);
const chalk = require3('chalk');

module.exports = app => {
  class VersionController extends app.Controller {

    async start() {
      // update all modules
      let result;
      try {
        result = await this.ctx.performAction({
          method: 'post',
          url: 'version/check',
        });
        if (Object.keys(result).length > 0) console.log(result);
        console.log(chalk.cyan('  All modules are checked successfully!'));
      } catch (err) {
        console.log(chalk.cyan('  Modules are checked failed!'));
        throw err;
      }

      // init all instances
      try {
        const instances = app.config.instances || [{ subdomain: '', password: '' }];
        for (const instance of instances) {
          await this.ctx.performAction({
            subdomain: instance.subdomain,
            method: 'post',
            url: 'version/check',
            body: {
              ...instance,
              scene: 'init',
            },
          });
        }

        console.log(chalk.cyan('  All instances are initialized successfully!'));
      } catch (err) {
        console.log(chalk.cyan('  Instances are initialized failed!'));
        throw err;
      }

      // ok
      // console.log(chalk.yellow('  For more details, please goto http://{ip}:{port}/#/a/version/check\n'));
      this.ctx.success();
    }

    // check all modules
    async check() {
      // options:
      //   scene:init
      //   scene:test
      const options = this.ctx.request.body || {};
      options.result = {};
      await this.service.version.check(options);
      this.ctx.success(options.result);
    }

    // update module
    async updateModule() {
      await this.service.version.updateModule(
        this.ctx.request.body.module,
        this.ctx.getInt('version')
      );
      this.ctx.success();
    }

    // init module
    async initModule() {
      await this.service.version.initModule(
        this.ctx.request.body,
        this.ctx.request.body.module,
        this.ctx.getInt('version')
      );
      this.ctx.success();
    }

    // test module
    async testModule() {
      await this.service.version.testModule(
        this.ctx.request.body
      );
      this.ctx.success();
    }

    // update this module
    async update() {
      await this.service.version.update(this.ctx.getInt('version'));
      this.ctx.success();
    }

    // after
    async after() {
      await this.service.version.after(this.ctx.request.body);
      this.ctx.success();
    }

  }
  return VersionController;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(5);

module.exports = {
  version,
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async check(options) {

      if (!options.scene) {
        // confirm table aVersion exists
        const res = await this.ctx.db.queryOne('show tables like \'aVersion\'');
        if (!res) {
          await this.ctx.db.query(`
          CREATE TABLE aVersion (
            id INT NOT NULL AUTO_INCREMENT,
            module VARCHAR(50) NULL,
            version INT NULL,
            createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id));
          `);
        }
      }

      // check all modules
      for (const module of this.app.meta.modulesArray) {
        await this.__checkModule(module.info.relativeName, options);
      }

      // check if role dirty for init/test
      if (options.scene === 'init' || options.scene === 'test') {
        await this.ctx.performAction({
          subdomain: options.subdomain || '',
          method: 'post',
          url: 'version/after',
          body: options,
        });
      }

    }

    async after(options) {
      // console.log(this.ctx.meta);
      const dirty = await this.ctx.meta.role.getDirty();
      if (dirty) {
        await this.ctx.meta.role.build();
      }
    }

    // update module
    async updateModule(module, version) {

      // update
      await this.ctx.performAction({
        method: 'post',
        url: `/${module.info.url}/version/update`,
        body: {
          version,
        },
      });

      // insert record
      if (version > 0) {
        await this.ctx.db.insert('aVersion', {
          module: module.info.relativeName,
          version,
        });
      }

    }

    // init module
    async initModule(options, module, version) {

      // init
      try {
        await this.ctx.performAction({
          method: 'post',
          url: `/${module.info.url}/version/init`,
          body: options,
        });
      } catch (e) {
        if (e.code !== 404) throw e;
      }

      // insert record
      if (version > 0) {
        await this.ctx.db.insert('aVersionInit', {
          subdomain: options.subdomain,
          module: module.info.relativeName,
          version,
        });
      }

    }

    // test module
    async testModule(options) {

      // test
      try {
        await this.ctx.performAction({
          method: 'post',
          url: `/${options.module.info.url}/version/test`,
          body: options,
        });
      } catch (e) {
        if (e.code !== 404) throw e;
      }

    }


    // update this module
    async update(version) {

      if (version === 1) {
        // do nothing
      }

      if (version === 2) {
        await this.ctx.db.query(`
          CREATE TABLE aVersionInit (
            id INT NOT NULL AUTO_INCREMENT,
            subdomain VARCHAR(50) NULL,
            module VARCHAR(50) NULL,
            version INT NULL,
            createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id));
          `);
      }

    }

    // check module
    async __checkModule(moduleName, options) {

      // module
      const module = this.__getModule(moduleName);

      // fileVersionNew
      let fileVersionNew = 0;
      if (module.package.eggBornModule && module.package.eggBornModule.fileVersion) {
        fileVersionNew = module.package.eggBornModule.fileVersion;
      }

      if (fileVersionNew && (!options.scene || options.scene === 'init')) {
        // update module or init module

        // -1: always
        if (fileVersionNew === -1) {
          await this.__updateModule(options, module, -1, -1);
        } else {
          // fileVersionOld
          let fileVersionOld = 0; // default
          if (!options.scene) {
            const res = await this.ctx.db.queryOne('select * from aVersion where module=? order by version desc', [ moduleName ]);
            if (res) {
              fileVersionOld = res.version;
            }
          } else {
            const res = await this.ctx.db.queryOne('select * from aVersionInit where subdomain=? and module=? order by version desc', [ options.subdomain, moduleName ]);
            if (res) {
              fileVersionOld = res.version;
            }
          }

          // check if need update
          if (fileVersionOld > fileVersionNew) {
            this.ctx.throw(1001, moduleName);
          } else if (fileVersionOld < fileVersionNew) {
            await this.__updateModule(options, module, fileVersionOld, fileVersionNew);
          }
        }

      }

      if (options.scene === 'test') {
        // test module
        await this.__testModule(module, fileVersionNew, options);
      }

    }

    async __updateModule2(options, module, version) {
      // perform action
      try {
        if (!options.scene) {
          await this.ctx.performAction({
            method: 'post',
            url: 'version/updateModule',
            body: {
              module,
              version,
            },
          });
        } else {
          options.module = module;
          options.version = version;
          await this.ctx.performAction({
            method: 'post',
            url: 'version/initModule',
            body: options,
          });
        }
      } catch (err) {
        throw err;
      }
    }

    // update module or init module
    async __updateModule(options, module, fileVersionOld, fileVersionNew) {

      if (fileVersionNew === -1) {
        // always
        await this.__updateModule2(options, module, -1);
      } else {
        // versions
        const versions = [];
        for (let version = fileVersionOld + 1; version <= fileVersionNew; version++) {
          versions.push(version);
        }

        // loop
        for (const version of versions) {
          await this.__updateModule2(options, module, version);
        }
      }

      // log
      options.result[module.info.relativeName] = { fileVersionOld, fileVersionNew };

    }

    // test module
    async __testModule(module, fileVersionNew, options) {
      options.module = module;
      options.version = fileVersionNew;

      await this.ctx.performAction({
        method: 'post',
        url: 'version/testModule',
        body: options,
      });
    }

    // get module
    __getModule(moduleName) {
      return this.app.meta.modules[moduleName];
    }

  }

  return Version;
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};
  return config;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(8),
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = {
  'module %s is old': '模块过旧',
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = {
  1001: 'module %s is old',
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map