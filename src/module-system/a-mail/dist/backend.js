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

/***/ 342:
/***/ ((module) => {

const __mailScenesConfigCache = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class MailSceneCache {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    get statusModule() {
      return ctx.bean.status.module(moduleInfo.relativeName);
    }

    getMailScenesConfigCache() {
      return __mailScenesConfigCache[ctx.subdomain];
    }

    getMailSceneConfigCache(sceneName) {
      return __mailScenesConfigCache[ctx.subdomain][sceneName];
    }

    getMailScenesConfigForAdmin() {
      let scenes = this.getMailScenesConfigCache();
      scenes = ctx.bean.util.extend({}, scenes);
      for (const sceneName in scenes) {
        const scene = scenes[sceneName];
        scene.titleLocale = ctx.text(scene.title);
      }
      return scenes;
    }

    async mailSceneChanged() {
      // change self
      await this._cacheMailScenesConfig();
      // broadcast
      ctx.meta.util.broadcastEmit({
        module: 'a-mail',
        broadcastName: 'mailSceneChanged',
        data: null,
      });
    }

    purgeScene(scene) {
      const res = ctx.bean.util.extend({}, scene);
      delete res.titleLocale;
      return res;
    }

    async _cacheMailScenesConfig() {
      // configDefault
      const configDefault = this.configModule.scenes;
      // configScenes
      let configScenes = await this.statusModule.get('mailScenes');
      configScenes = ctx.bean.util.extend({}, configDefault, configScenes);
      // cache
      __mailScenesConfigCache[ctx.subdomain] = configScenes;
    }
  }
  return MailSceneCache;
};


/***/ }),

/***/ 986:
/***/ ((module) => {

module.exports = app => {
  class Broadcast extends app.meta.BeanBase {
    async execute(context) {
      const sameAsCaller = context.sameAsCaller;
      if (!sameAsCaller) {
        await this.ctx.bean.mailSceneCache._cacheMailScenesConfig();
      }
    }
  }

  return Broadcast;
};


/***/ }),

/***/ 857:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const nodemailer = require3('nodemailer');
const chalk = require3('chalk');
const boxen = require3('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
        // 2. from config cache
        scene = ctx.bean.mailSceneCache.getMailSceneConfigCache(content.scene || 'system');
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
        const message =
          chalk.keyword('cyan')('Test Mail To: ') +
          chalk.keyword('yellow')(content.message.to) +
          chalk.keyword('orange')('\n' + url);
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
      return scene && scene.transport && scene.transport.host;
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

/***/ 948:
/***/ ((module) => {

module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute(/* context*/) {
      // cache all mailScenes
      await this.ctx.bean.mailSceneCache._cacheMailScenesConfig();
    }
  }

  return Startup;
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
        // empty
      }
    }

    async test() {}
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const ioMessageMail = __webpack_require__(265);
const ioChannelMail = __webpack_require__(857);
const broadcastMailSceneChanged = __webpack_require__(986);
const startupCacheMailScenes = __webpack_require__(948);
const beanMail = __webpack_require__(202);
const beanMailSceneCache = __webpack_require__(342);

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
    // broadcast
    'broadcast.mailSceneChanged': {
      mode: 'app',
      bean: broadcastMailSceneChanged,
    },
    // startup
    'startup.cacheMailScenes': {
      mode: 'app',
      bean: startupCacheMailScenes,
    },
    // global
    mail: {
      mode: 'ctx',
      bean: beanMail,
      global: true,
    },
    mailSceneCache: {
      mode: 'ctx',
      bean: beanMailSceneCache,
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

  // startups
  config.startups = {
    cacheMailScenes: {
      bean: 'cacheMailScenes',
      instance: true,
    },
  };

  // broadcasts
  config.broadcasts = {
    mailSceneChanged: {
      bean: 'mailSceneChanged',
    },
  };

  // default
  config.scene = {
    default: {
      // title: undefined,
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
  // scenes
  config.scenes = {
    system: {
      title: 'System',
      ...config.scene.default,
    },
  };

  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {};


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
  'Mail Management': '邮件管理',
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
        channels: ['a-mail:mail'],
      },
    },
  };
  return MessageMail;
};


/***/ }),

/***/ 429:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Mail Management',
      atomStaticKey: 'mailManagement',
      atomRevision: 2,
      atomCategoryId: 'a-base:menu.BasicAdmin',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        actionPath: '/a/mail/scene/list',
      }),
      resourceIcon: ':outline:mail-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
      resourceSorting: 6,
    },
  ];
  return resources;
};


/***/ }),

/***/ 665:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  schemas.mailScene = {
    type: 'object',
    properties: {
      transport: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'MailTransportInfo',
        properties: {
          title: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'Title',
            notEmpty: true,
          },
          host: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'MailHost',
            notEmpty: true,
          },
          port: {
            type: 'number',
            ebType: 'text',
            ebTitle: 'MailPort',
            notEmpty: true,
          },
          secure: {
            type: 'boolean',
            ebType: 'toggle',
            ebTitle: 'MailSecure',
          },
        },
      },
      auth: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Auth Info',
        properties: {
          user: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'MailAuthUser',
            notEmpty: true,
          },
          pass: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'MailAuthPassword',
            notEmpty: true,
          },
        },
      },
      __groupDefaultsInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Defaults Info',
      },
      defaults: {
        type: 'object',
        ebType: 'json',
        ebTitle: 'Defaults',
      },
      extra: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Extra Info',
        properties: {
          logger: {
            type: 'boolean',
            ebType: 'toggle',
            ebTitle: 'logger',
          },
          debug: {
            type: 'boolean',
            ebType: 'toggle',
            ebTitle: 'debug',
          },
        },
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const mailScene = __webpack_require__(665);

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, mailScene(app));
  return schemas;
};


/***/ }),

/***/ 36:
/***/ ((module) => {

module.exports = app => {
  class SceneController extends app.Controller {
    async list() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.ctx.service.scene.list();
      this.ctx.success(res);
    }

    async save() {
      // check demo
      this.ctx.bean.util.checkDemo();
      // adjust
      const sceneName = this.ctx.request.body.sceneName;
      const data = this.ctx.request.body.data;
      const data2 = {
        title: data.transport.title,
        transport: {
          ...data.transport,
          auth: data.auth,
          logger: data.extra.logger,
          debug: data.extra.debug,
        },
        defaults: data.defaults,
      };
      delete data2.transport.title;
      // save
      await this.service.scene.save({
        sceneName,
        data: data2,
      });
      // ok
      const list = await this.ctx.service.scene.list();
      const res = list[sceneName];
      this.ctx.success(res);
    }

    async delete() {
      // check demo
      this.ctx.bean.util.checkDemo();
      await this.service.scene.delete({
        sceneName: this.ctx.request.body.sceneName,
      });
      const list = await this.ctx.service.scene.list();
      this.ctx.success({ list });
    }

    async add() {
      // check demo
      this.ctx.bean.util.checkDemo();
      await this.service.scene.add({
        sceneName: this.ctx.request.body.sceneName,
        data: this.ctx.request.body.data,
      });
      const list = await this.ctx.service.scene.list();
      this.ctx.success({ list });
    }
  }

  return SceneController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const scene = __webpack_require__(36);

module.exports = app => {
  const controllers = { scene };
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
  // schemas
  const schemas = __webpack_require__(232)(app);
  // socketio
  const socketioMessageMail = __webpack_require__(251)(app);
  const socketioChannelMail = __webpack_require__(213)(app);
  // static
  const staticResources = __webpack_require__(429)(app);
  // meta
  const meta = {
    base: {
      atoms: {},
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {
        mailScene: {
          schemas: 'mailScene',
        },
      },
      keywords: {},
      schemas,
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
    // scene
    {
      method: 'post',
      path: 'scene/list',
      controller: 'scene',
      meta: { right: { type: 'resource', name: 'mailManagement' } },
    },
    {
      method: 'post',
      path: 'scene/save',
      controller: 'scene',
      middlewares: 'validate',
      meta: {
        right: { type: 'resource', name: 'mailManagement' }, //
        validate: { validator: 'mailScene' },
      },
    },
    {
      method: 'post',
      path: 'scene/delete',
      controller: 'scene',
      meta: { right: { type: 'resource', name: 'mailManagement' } },
    },
    {
      method: 'post',
      path: 'scene/add',
      controller: 'scene',
      meta: { right: { type: 'resource', name: 'mailManagement' } },
    },
  ];
  return routes;
};


/***/ }),

/***/ 93:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Scene extends app.Service {
    get statusModule() {
      return this.ctx.bean.status.module(moduleInfo.relativeName);
    }

    async list() {
      return this.ctx.bean.mailSceneCache.getMailScenesConfigForAdmin();
    }

    async save({ sceneName, data }) {
      const scenes = this.ctx.bean.mailSceneCache.getMailScenesConfigCache();
      const sceneOld = scenes[sceneName];
      data = this.ctx.bean.util.extend({}, sceneOld, data);
      await this._save({ sceneName, data });
    }

    async _save({ sceneName, data }) {
      const scenes = this.ctx.bean.mailSceneCache.getMailScenesConfigCache();
      scenes[sceneName] = data ? this.ctx.bean.mailSceneCache.purgeScene(data) : data;
      // update
      await this.statusModule.set('mailScenes', scenes);
      // changed
      await this.ctx.bean.mailSceneCache.mailSceneChanged();
    }

    async delete({ sceneName }) {
      await this._save({ sceneName, data: undefined });
    }

    async add({ sceneName, data }) {
      data = this.ctx.bean.util.extend({}, this.ctx.config.scene.default, data);
      await this._save({ sceneName, data });
    }
  }

  return Scene;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const scene = __webpack_require__(93);

module.exports = app => {
  const services = { scene };
  return services;
};


/***/ }),

/***/ 638:
/***/ ((module) => {

"use strict";
module.exports = require("require3");

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