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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(3);

module.exports = [
  { method: 'post', path: 'version/start', controller: version, middlewares: 'safeAccess' },
  { method: 'post', path: 'version/check', controller: version, middlewares: 'safeAccess' },
  { method: 'post', path: 'version/updateModule', controller: version, middlewares: 'safeAccess,transaction' },
  { method: 'post', path: 'version/initModule', controller: version, middlewares: 'safeAccess,transaction' },
  { method: 'post', path: 'version/testModule', controller: version, middlewares: 'safeAccess,transaction' },
  { method: 'post', path: 'version/update', controller: version, middlewares: 'safeAccess' },
  { method: 'get', path: 'version/result', controller: version, middlewares: 'safeAccess' },
];


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
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

      // init all subdomains
      if (result && Object.keys(result).length > 0) {
        try {
          const rows = await this.ctx.db.query('select distinct subdomain from aVersionInit');
          for (const row of rows) {
            await this.ctx.performAction({
              method: 'post',
              url: 'version/check',
              body: {
                subdomain: row.subdomain,
                scene: 'init',
              },
            });
          }

          console.log(chalk.cyan('  All subdomains are initialized successfully!'));
        } catch (err) {
          console.log(chalk.cyan('  Subdomains are initialized failed!'));
          throw err;
        }
      }

      // ok
      console.log(chalk.yellow('  For more details, please goto http://{ip}:{port}/#/a/version/check\n'));
      this.ctx.success();
    }

    // check all modules
    async check() {
      // options:
      //   scene:init
      //   scene:test
      const options = this.ctx.request.body;
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

    // result
    async result() {
      if (app.config.env !== 'local') this.ctx.throw(1003);
      const res = this.service.version.result();
      this.ctx.success(res);
    }

  }
  return VersionController;
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(5);

module.exports = {
  version,
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const semver = require3('semver');

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

      // reset all modules
      this.__resetAllModules();

      // check module of aVersion
      await this.__checkModule('a-version', options);

      // check other modules
      await this.__checkOtherModules(options);
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

    // reset all modules
    __resetAllModules() {
      const keys = Object.keys(this.app.meta.modules);
      for (const key of keys) {
        const module = this.app.meta.modules[key];
        module.__checking = false;
      }
    }

    // check other modules
    async __checkOtherModules(options) {
      const keys = Object.keys(this.app.meta.modules);
      for (const key of keys) {
        if (key !== 'a-version') {
          await this.__checkModule(key, options);
        }
      }
    }

    // check module
    async __checkModule(moduleName, options) {

      // module
      const module = this.__getModule(moduleName);
      if (module.__checking) return;
      module.__checking = true;

      // dependencies
      await this.__checkDependencies(module, options);

      // fileVersionNew
      let fileVersionNew = 0;
      if (module.package.eggBornModule && module.package.eggBornModule.fileVersion) {
        fileVersionNew = module.package.eggBornModule.fileVersion;
      }

      if (fileVersionNew && (!options.scene || options.scene === 'init')) {
        // update module or init module

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
          // module is old
          module.__check = this.ctx.parseFail(1001);
          this.ctx.throw(1001);
        } else if (fileVersionOld < fileVersionNew) {
          await this.__updateModule(options, module, fileVersionOld, fileVersionNew);
        }
      }

      if (options.scene === 'test') {
        // test module
        await this.__testModule(module, fileVersionNew, options);
      }

    }

    // check dependencies
    async __checkDependencies(module, options) {

      if (!module.package.eggBornModule || !module.package.eggBornModule.dependencies) return;

      const dependencies = module.package.eggBornModule.dependencies;
      const keys = Object.keys(dependencies);
      for (const key of keys) {
        const subModule = this.__getModule(key);
        if (!subModule) {
          module.__check = this.ctx.parseFail(1002, key);
          this.ctx.throw(1002, key);
        }
        const subModuleVersion = dependencies[key];
        if (semver.lt(subModule.package.version, subModuleVersion)) {
          subModule.__check = this.ctx.parseFail(1001);
          this.ctx.throw(1001);
        }
        await this.__checkModule(key, options);
      }

    }

    // update module or init module
    async __updateModule(options, module, fileVersionOld, fileVersionNew) {

      // versions
      const versions = [];
      for (let version = fileVersionOld + 1; version <= fileVersionNew; version++) {
        versions.push(version);
      }

      // loop
      for (const version of versions) {
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
          module.__check = err;
          throw err;
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

    // result
    result() {

      // find error module
      const moduleName = Object.keys(this.app.meta.modules).find(key => this.app.meta.modules[key].__check);
      if (moduleName) return { module: this.app.meta.modules[moduleName], modules: null };

      // ok
      return { module: null, modules: this.app.meta.modules };

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
  'module is old': '模块过旧',
  'module %s not exists': '模块%s不存在',
  'The module only run in development mode': '此模块只能在开发模式下运行',
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = {
  1001: 'module is old',
  1002: 'module %s not exists',
  1003: 'The module only run in development mode',
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map