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

module.exports = app => {
  class Mail extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aMail', options: { disableDeleted: false } });
    }
  }
  return Mail;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(2);
const locales = __webpack_require__(3);
const errors = __webpack_require__(6);
const middlewares = __webpack_require__(7);

module.exports = app => {

  // routes
  const routes = __webpack_require__(10)(app);
  // services
  const services = __webpack_require__(13)(app);
  // models
  const models = __webpack_require__(17)(app);
  // meta
  const meta = __webpack_require__(18)(app);

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

  // middlewares
  config.middlewares = {
    mail: {
      global: false,
      dependencies: 'instance',
    },
  };

  // queues
  config.queues = {
    send: {
      path: 'mail/queueSend',
    },
  };

  // schedules
  config.schedules = {
    pushQueue: {
      type: 'worker',
      path: 'mail/schedulePushQueueInstance',
      instance: true,
      interval: '120s',
      // interval: '5s',
    },
  };

  // scenes
  config.scenes = {
    system: {
      transport: {
        host: '',
        port: 0,
        secure: false,
        auth: {
          user: '',
          pass: '',
        },
        logger: false,
        debug: false,
      },
      defaults: {
        from: '',
      },
    },
  };

  return config;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'en-us': __webpack_require__(4),
  'zh-cn': __webpack_require__(5),
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = {
  mailhostNotConfigAlert: 'Please set module config: [a-mail].scenes.system',
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {
  mailhostNotConfigAlert: '请设置模块配置: [a-mail].scenes.system',
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const mail = __webpack_require__(8);

module.exports = {
  mail,
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// mail
const MailFn = __webpack_require__(9);
const MAIL = Symbol('CTX#__MAIL');


module.exports = () => {
  return async function mail(ctx, next) {
    ctx.meta = ctx.meta || {};
    // mail
    Object.defineProperty(ctx.meta, 'mail', {
      get() {
        if (ctx.meta[MAIL] === undefined) {
          ctx.meta[MAIL] = new (MailFn(ctx))();
        }
        return ctx.meta[MAIL];
      },
    });
    // next
    await next();
  };
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const modelMailFn = __webpack_require__(0);

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Mail {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._modelMail = null;
    }

    // other module's mail
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get modelMail() {
      if (!this._modelMail) this._modelMail = new (modelMailFn(ctx.app))(ctx);
      return this._modelMail;
    }

    // send
    async send({ scene, message }) {
      // save to db
      await this.modelMail.insert({
        scene,
        status: 0,
        mailto: message.to,
        mailSubject: message.subject,
        message: JSON.stringify(message),
      });
      // queue not async
      ctx.tail(async () => {
        await ctx.app.meta.queue.push({
          subdomain: ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'send',
          data: null,
        });
      });
    }
  }
  return Mail;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(11);
const mail = __webpack_require__(12);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // mail
    { method: 'post', path: 'mail/queueSend', controller: mail, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'mail/schedulePushQueueInstance', controller: mail, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
  ];
  return routes;
};


/***/ }),
/* 11 */
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

    async test() {
      await this.service.version.test(this.ctx.request.body);
      this.ctx.success();
    }

  }
  return VersionController;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = app => {

  class MailController extends app.Controller {

    async queueSend() {
      await this.service.mail.queueSend();
      this.ctx.success();
    }

    async schedulePushQueueInstance() {
      await this.service.mail.schedulePushQueueInstance();
      this.ctx.success();
    }

  }
  return MailController;
};



/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(14);
const mail = __webpack_require__(15);

module.exports = app => {
  const services = {
    version,
    mail,
  };
  return services;
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // create table: aMail
        const sql = `
          CREATE TABLE aMail (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            scene varchar(50) DEFAULT NULL,
            status int(11) DEFAULT '0',
            mailTo text DEFAULT NULL,
            mailSubject text DEFAULT NULL,
            message LONGTEXT DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
      }
    }

    async test() {
    }

  }

  return Version;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(16);
const nodemailer = require3('nodemailer');
const chalk = require3('chalk');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Mail extends app.Service {

    async schedulePushQueueInstance() {
      await this.ctx.app.meta.queue.push({
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'send',
        data: null,
      });
    }

    // mail:status
    //      0:unsend
    //      1:sent
    //      -1: error
    async queueSend() {
      // // reset
      // await this.ctx.model.query(`
      //     update aMail set status=0 where status=-1 where iid=? and deleted=0
      //       `, [ this.ctx.instance.id ]);

      // loop
      while (true) {
        // get
        const mail = await this.ctx.model.mail.get({ status: 0 });
        if (!mail) break;
        // send
        const res = await this._send({ mail });
        if (!res) break;
      }
    }

    async _send({ mail }) {
      try {
        // scene
        let scene;
        if (mail.scene === 'test') {
          scene = await this._createSceneTest();
        } else {
          scene = this.ctx.config.scenes[mail.scene];
        }
        // check if empty
        if (!scene.transport.host) {
          console.log(chalk.keyword('orange')(this.ctx.text('mailhostNotConfigAlert')));
          return false;
        }
        // transporter
        const transporter = nodemailer.createTransport(scene.transport, scene.defaults);
        // send
        const message = mail.message ? JSON.parse(mail.message) : null;
        const res = await transporter.sendMail(message);
        // log
        if (mail.scene === 'test') {
          const url = nodemailer.getTestMessageUrl(res);
          console.log(chalk.keyword('orange')(`test mail url: ${url}`));
        }
        // status
        await this.ctx.model.mail.update({
          id: mail.id,
          status: 1,
        });
        // continue
        return true;
      } catch (err) {
        // log
        this.ctx.logger.error(err);
        // error
        if (err.responseCode === 559) {
          // status
          await this.ctx.model.mail.update({
            id: mail.id,
            status: -1,
          });
          // continue
          return true;
        }
        // break
        return false;
      }
    }

    async _createSceneTest() {
      const account = await nodemailer.createTestAccount();
      return {
        transport: {
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
          logger: false,
          debug: false,
        },
        defaults: {
          // sender info
          from: 'Nodemailer <example@nodemailer.com>',
        },
      };
    }

  }

  return Mail;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const mail = __webpack_require__(0);

module.exports = app => {
  const models = {
    mail,
  };
  return models;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  const schemas = __webpack_require__(19)(app);
  const meta = {
    base: {
      atoms: {
      },
      functions: {
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
  };
  return meta;
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map