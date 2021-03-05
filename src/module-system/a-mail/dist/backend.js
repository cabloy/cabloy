module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 202:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Mail extends ctx.app.meta.BeanModuleBase {

    constructor(moduleName) {
      super(ctx, 'mail');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get modelMail() {
      return ctx.model.module(moduleInfo.relativeName).mail;
    }

    // send
    async send({ scene, message }) {
      // save to db
      const res = await this.modelMail.insert({
        scene,
        status: 0,
        mailto: message.to,
        mailSubject: message.subject,
        message: JSON.stringify(message),
      });
      const mailId = res.insertId;
      // publish
      ctx.tail(async () => {
        await ctx.bean.io.publish({
          message: {
            content: { mailId },
          },
          messageClass: {
            module: moduleInfo.relativeName,
            messageClassName: 'mail',
          },
        });
      });
    }
  }
  return Mail;
};


/***/ }),

/***/ 857:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const nodemailer = require3('nodemailer');
const chalk = require3('chalk');
const boxen = require3('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IOChannel extends ctx.app.meta.IOChannelBase(ctx) {

    async onPush({ content /* options, message, messageSync, messageClass*/ }) {
      // check if content.message
      // not set content.message.to dynamic for test, which must be set by business
      if (!content.message || !content.message.to) return false;
      // scene
      let scene;
      let sceneTest = false;
      // 1. maybe object by dynamic
      if (content.scene && typeof content.scene === 'object') {
        scene = content.scene;
      } else {
        // 2. from config
        scene = ctx.config.module(moduleInfo.relativeName).scenes[content.scene || 'system'];
      }
      // 3. test
      if (!this._sceneValid(scene) && (ctx.app.meta.isTest || ctx.app.meta.isLocal)) {
        scene = await this._createSceneTest();
        sceneTest = true;
      }
      // check if empty
      if (!this._sceneValid(scene)) {
        const message = chalk.keyword('orange')(ctx.text('mailhostNotConfigAlert'));
        console.log('\n' + boxen(message, boxenOptions));
        return false;
      }
      // transporter
      const transporter = nodemailer.createTransport(scene.transport, scene.defaults);
      // send
      const res = await transporter.sendMail(content.message);
      // log
      if (sceneTest) {
        const url = nodemailer.getTestMessageUrl(res);
        const message = chalk.keyword('cyan')('Test Mail To: ')
                        + chalk.keyword('yellow')(content.message.to)
                        + chalk.keyword('orange')('\n' + url);
        console.log('\n' + boxen(message, boxenOptions));
      }
      // done
      return true;
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

    _sceneValid(scene) {
      return (scene && scene.transport && scene.transport.host);
    }

  }
  return IOChannel;
};


/***/ }),

/***/ 265:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IOMessage extends ctx.app.meta.IOMessageBase(ctx) {

    async onChannelRender({ channelFullName, options, message, messageSync, messageClass }) {
      if (channelFullName === 'a-mail:mail') {
        return await this._onChannelRenderMail({ options, message, messageSync, messageClass });
      }
      // super
      return await super.onChannelRender({ channelFullName, options, message, messageSync, messageClass });
    }

    async _onChannelRenderMail({ message }) {
      const content = JSON.parse(message.content);
      const modelMail = ctx.model.module(moduleInfo.relativeName).mail;
      const mail = await modelMail.get({ id: content.mailId });
      return {
        scene: mail.scene,
        message: JSON.parse(mail.message),
      };
    }

  }
  return IOMessage;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {

  class Version extends app.meta.BeanBase {

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

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const ioMessageMail = __webpack_require__(265);
const ioChannelMail = __webpack_require__(857);
const beanMail = __webpack_require__(202);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // io
    'io.message.mail': {
      mode: 'ctx',
      bean: ioMessageMail,
    },
    'io.channel.mail': {
      mode: 'ctx',
      bean: ioChannelMail,
    },
    // global
    mail: {
      mode: 'ctx',
      bean: beanMail,
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
  config.middlewares = {
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

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  mailhostNotConfigAlert: 'Please set module config: [a-mail].scenes.system',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  mailhostNotConfigAlert: '请设置模块配置: [a-mail].scenes.system',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 213:
/***/ ((module) => {

module.exports = app => {
  const ChannelMail = {
    info: {
      bean: 'mail',
      title: 'Mail',
    },
  };
  return ChannelMail;
};


/***/ }),

/***/ 251:
/***/ ((module) => {

module.exports = app => {
  const MessageMail = {
    info: {
      bean: 'mail',
      title: 'Mail',
      persistence: false,
      push: {
        channels: [ 'a-mail:mail' ],
      },
    },
  };
  return MessageMail;
};


/***/ }),

/***/ 95:
/***/ ((module) => {


module.exports = app => {
  const controllers = {
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

module.exports = app => {

  // beans
  const beans = __webpack_require__(187)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  // services
  const services = __webpack_require__(214)(app);
  // models
  const models = __webpack_require__(230)(app);
  // meta
  const meta = __webpack_require__(458)(app);

  return {
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta,
  };

};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  // const schemas = require('./config/validation/schemas.js')(app);
  // socketio
  const socketioMessageMail = __webpack_require__(251)(app);
  const socketioChannelMail = __webpack_require__(213)(app);
  const meta = {
    base: {
      atoms: {
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
    socketio: {
      messages: {
        mail: socketioMessageMail,
      },
      channels: {
        mail: socketioChannelMail,
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 62:
/***/ ((module) => {

module.exports = app => {
  class Mail extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aMail', options: { disableDeleted: false } });
    }
  }
  return Mail;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const mail = __webpack_require__(62);

module.exports = app => {
  const models = {
    mail,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
  ];
  return routes;
};


/***/ }),

/***/ 9:
/***/ ((module) => {

module.exports = app => {

  class Mail extends app.Service {

  }
  return Mail;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const mail = __webpack_require__(9);

module.exports = app => {
  const services = {
    mail,
  };
  return services;
};


/***/ }),

/***/ 718:
/***/ ((module) => {

"use strict";
module.exports = require("require3");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
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
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(421);
/******/ })()
;
//# sourceMappingURL=backend.js.map