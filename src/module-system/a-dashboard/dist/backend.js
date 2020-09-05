module.exports =
/** ****/ (function(modules) { // webpackBootstrap
    /** ****/ 	// The module cache
    /** ****/ 	const installedModules = {};
    /** ****/
    /** ****/ 	// The require function
    /** ****/ 	function __webpack_require__(moduleId) {
      /** ****/
      /** ****/ 		// Check if module is in cache
      /** ****/ 		if (installedModules[moduleId]) {
        /** ****/ 			return installedModules[moduleId].exports;
        /** ****/ 		}
      /** ****/ 		// Create a new module (and put it into the cache)
      /** ****/ 		const module = installedModules[moduleId] = {
        /** ****/ 			i: moduleId,
        /** ****/ 			l: false,
        /** ****/ 			exports: {},
        /** ****/ 		};
      /** ****/
      /** ****/ 		// Execute the module function
      /** ****/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /** ****/
      /** ****/ 		// Flag the module as loaded
      /** ****/ 		module.l = true;
      /** ****/
      /** ****/ 		// Return the exports of the module
      /** ****/ 		return module.exports;
      /** ****/ 	}
    /** ****/
    /** ****/
    /** ****/ 	// expose the modules object (__webpack_modules__)
    /** ****/ 	__webpack_require__.m = modules;
    /** ****/
    /** ****/ 	// expose the module cache
    /** ****/ 	__webpack_require__.c = installedModules;
    /** ****/
    /** ****/ 	// define getter function for harmony exports
    /** ****/ 	__webpack_require__.d = function(exports, name, getter) {
      /** ****/ 		if (!__webpack_require__.o(exports, name)) {
        /** ****/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
        /** ****/ 		}
      /** ****/ 	};
    /** ****/
    /** ****/ 	// define __esModule on exports
    /** ****/ 	__webpack_require__.r = function(exports) {
      /** ****/ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /** ****/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        /** ****/ 		}
      /** ****/ 		Object.defineProperty(exports, '__esModule', { value: true });
      /** ****/ 	};
    /** ****/
    /** ****/ 	// create a fake namespace object
    /** ****/ 	// mode & 1: value is a module id, require it
    /** ****/ 	// mode & 2: merge all properties of value into the ns
    /** ****/ 	// mode & 4: return value when already ns object
    /** ****/ 	// mode & 8|1: behave like require
    /** ****/ 	__webpack_require__.t = function(value, mode) {
      /** ****/ 		if (mode & 1) value = __webpack_require__(value);
      /** ****/ 		if (mode & 8) return value;
      /** ****/ 		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
      /** ****/ 		const ns = Object.create(null);
      /** ****/ 		__webpack_require__.r(ns);
      /** ****/ 		Object.defineProperty(ns, 'default', { enumerable: true, value });
      /** ****/ 		if (mode & 2 && typeof value !== 'string') for (const key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
      /** ****/ 		return ns;
      /** ****/ 	};
    /** ****/
    /** ****/ 	// getDefaultExport function for compatibility with non-harmony modules
    /** ****/ 	__webpack_require__.n = function(module) {
      /** ****/ 		const getter = module && module.__esModule ?
      /** ****/ 			function getDefault() { return module.default; } :
      /** ****/ 			function getModuleExports() { return module; };
      /** ****/ 		__webpack_require__.d(getter, 'a', getter);
      /** ****/ 		return getter;
      /** ****/ 	};
    /** ****/
    /** ****/ 	// Object.prototype.hasOwnProperty.call
    /** ****/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    /** ****/
    /** ****/ 	// __webpack_public_path__
    /** ****/ 	__webpack_require__.p = '';
    /** ****/
    /** ****/
    /** ****/ 	// Load entry module and return exports
    /** ****/ 	return __webpack_require__(__webpack_require__.s = 0);
    /** ****/ })([
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {

      const config = __webpack_require__(1);
      const locales = __webpack_require__(2);
      const errors = __webpack_require__(4);
      const middlewares = __webpack_require__(5);

      module.exports = app => {

        // routes
        const routes = __webpack_require__(6)(app);
        // services
        const services = __webpack_require__(9)(app);
        // models
        const models = __webpack_require__(12)(app);
        // meta
        const meta = __webpack_require__(14)(app);

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


      /***/ },
    /* 1 */
    /***/ function(module, exports) {

      // eslint-disable-next-line
module.exports = appInfo => {
        const config = {};
        return config;
      };


      /***/ },
    /* 2 */
    /***/ function(module, exports, __webpack_require__) {

      module.exports = {
        'zh-cn': __webpack_require__(3),
      };


      /***/ },
    /* 3 */
    /***/ function(module, exports) {

      module.exports = {
        About: '关于',
        Dashboard: '仪表盘',
      };


      /***/ },
    /* 4 */
    /***/ function(module, exports) {

      // error code should start from 1001
      module.exports = {
      };


      /***/ },
    /* 5 */
    /***/ function(module, exports) {

      module.exports = {
      };


      /***/ },
    /* 6 */
    /***/ function(module, exports, __webpack_require__) {

      const version = __webpack_require__(7);
      const profile = __webpack_require__(8);

      module.exports = app => {
        const routes = [
          // version
          { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
          { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
          { method: 'post', path: 'version/test', controller: 'version', middlewares: 'test' },
          // profile
          { method: 'post', path: 'profile/list', controller: 'profile' },
          { method: 'post', path: 'profile/create', controller: 'profile', meta: { auth: { user: true } } },
          { method: 'post', path: 'profile/item', controller: 'profile', meta: { auth: { user: true } } },
          { method: 'post', path: 'profile/delete', controller: 'profile', meta: { auth: { user: true } } },
          { method: 'post', path: 'profile/save', controller: 'profile', meta: { auth: { user: true } } },
        ];
        return routes;
      };


      /***/ },
    /* 7 */
    /***/ function(module, exports) {

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

          async test() {
            await this.service.version.test(this.ctx.request.body);
            this.ctx.success();
          }

        }
        return VersionController;
      };


      /***/ },
    /* 8 */
    /***/ function(module, exports) {

      module.exports = app => {
        class ProfileController extends app.Controller {

          async list() {
            const res = await this.service.profile.list({
              user: this.ctx.state.user.op,
            });
            this.ctx.success(res);
          }

          async create() {
            const profileId = await this.service.profile.create({
              data: this.ctx.request.body.data,
              user: this.ctx.state.user.op,
            });
            this.ctx.success({ profileId });
          }

          async item() {
            const res = await this.service.profile.item({
              profileId: this.ctx.request.body.profileId,
              user: this.ctx.state.user.op,
            });
            this.ctx.success(res);
          }

          async delete() {
            const res = await this.service.profile.delete({
              profileId: this.ctx.request.body.profileId,
              user: this.ctx.state.user.op,
            });
            this.ctx.success(res);
          }

          async save() {
            const res = await this.service.profile.save({
              profileId: this.ctx.request.body.profileId,
              profileValue: this.ctx.request.body.profileValue,
              user: this.ctx.state.user.op,
            });
            this.ctx.success(res);
          }

        }
        return ProfileController;
      };


      /***/ },
    /* 9 */
    /***/ function(module, exports, __webpack_require__) {

      const version = __webpack_require__(10);
      const profile = __webpack_require__(11);

      module.exports = app => {
        const services = {
          version,
          profile,
        };
        return services;
      };


      /***/ },
    /* 10 */
    /***/ function(module, exports) {

      module.exports = app => {

        class Version extends app.Service {

          async update(options) {
            if (options.version === 1) {
              // create table: aDashboardProfile
              const sql = `
          CREATE TABLE aDashboardProfile (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            profileName varchar(255) DEFAULT NULL,
            profileValue json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
              await this.ctx.model.query(sql);
            }
          }

          async init(options) {
            if (options.version === 1) {
              // roleFunctions: widgets
              const roleWidgets = [
                { roleName: null, name: 'widgetAbout' },
              ];
              await this.ctx.bean.role.addRoleFunctionBatch({ roleFunctions: roleWidgets });
            }
          }

          async test() {
          }

        }

        return Version;
      };


      /***/ },
    /* 11 */
    /***/ function(module, exports) {

      module.exports = app => {

        class Profile extends app.Service {

          async list({ user }) {
            return await this.ctx.model.profile.select({
              columns: [ 'id', 'createdAt', 'updatedAt', 'deleted', 'iid', 'userId', 'profileName' ],
              where: { userId: user.id },
              orders: [[ 'profileName', 'asc' ]],
            });
          }

          async create({ data, user }) {
            data.userId = user.id;
            const res = await this.ctx.model.profile.insert(data);
            return res.insertId;
          }

          async item({ profileId, user }) {
            return await this.ctx.model.profile.get({ id: profileId, userId: user.id });
          }

          async delete({ profileId, user }) {
            return await this.ctx.model.profile.delete({ id: profileId, userId: user.id });
          }

          async save({ profileId, profileValue, user }) {
            // try get item of user
            const item = await this.item({ profileId, user });
            if (!item) return;
            await this.ctx.model.profile.update({
              id: profileId,
              profileValue: JSON.stringify(profileValue),
            });
          }

        }

        return Profile;
      };


      /***/ },
    /* 12 */
    /***/ function(module, exports, __webpack_require__) {

      const profile = __webpack_require__(13);

      module.exports = app => {
        const models = {
          profile,
        };
        return models;
      };


      /***/ },
    /* 13 */
    /***/ function(module, exports) {

      module.exports = app => {
        class Profile extends app.meta.Model {
          constructor(ctx) {
            super(ctx, { table: 'aDashboardProfile', options: { disableDeleted: false } });
          }
        }
        return Profile;
      };


      /***/ },
    /* 14 */
    /***/ function(module, exports) {

      module.exports = app => {
        // const schemas = require('./config/validation/schemas.js')(app);
        const meta = {
          base: {
            atoms: {
            },
            functions: {
              // widgets
              widgetAbout: {
                title: 'About',
                component: 'widgetAbout',
                menu: 3,
                public: 1,
              },
            },
          },
          validation: {
            validators: {
            },
            keywords: {},
            schemas: {
            },
          },
          index: {
            indexes: {
              aDashboardProfile: 'createdAt,updatedAt,userId,profileName',
            },
          },
        };
        return meta;
      };


      /***/ },
    /** ****/ ]);
// # sourceMappingURL=backend.js.map
