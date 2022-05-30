/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 718:
/***/ ((module) => {

const _cacheMessageClassesUniform = {};

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'message');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    async group(/* {  options, user }*/) {
      const items = this.messageClassesUniform();
      return items;
    }

    messageClassesUniform() {
      if (!_cacheMessageClassesUniform[ctx.locale]) {
        _cacheMessageClassesUniform[ctx.locale] = this._prepareMessageClassesUniform();
      }
      return _cacheMessageClassesUniform[ctx.locale];
    }

    _prepareMessageClassesUniform() {
      const messageClasses = ctx.bean.io.messageClass.messageClasses();
      const items = [];
      for (const relativeName in messageClasses) {
        const _module = messageClasses[relativeName];
        for (const messageClassName in _module) {
          const messageClass = _module[messageClassName];
          if (messageClass.info.uniform) {
            items.push({
              module: relativeName,
              messageClassName,
              messageClass,
            });
          }
        }
      }
      return items;
    }
  }
  return Message;
};


/***/ }),

/***/ 283:
/***/ ((module) => {

const __PATH_MESSAGE_UNIFORM = '/a/message/uniform';

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IOMessageUniformBase extends ctx.app.meta.IOMessageBase(ctx) {
    async onPublish({ /* path,*/ message, messageClass, options }) {
      // onPublish
      return await super.onPublish({ path: __PATH_MESSAGE_UNIFORM, message, messageClass, options });
    }

    async onSaveSync({ path, options, message, messageSync, messageClass }) {
      if (messageSync.userId > 0 && messageSync.messageDirection === 2) {
        // user
        const user = { id: messageSync.userId };
        // stats
        this._notify({ messageClass, user });
      }
      return await super.onSaveSync({ path, options, message, messageSync, messageClass });
    }

    async onSetRead({ messageClass, messageIds, all, user }) {
      // stats
      if (messageClass) {
        this._notify({ messageClass, user });
      }
      // onPublish
      return await super.onSetRead({ messageClass, messageIds, all, user });
    }

    async onPushEnable(/* { options, message, messageSyncs, messageClass }*/) {
      return true;
    }

    async onChannels({ options, message, messageSync, messageClass }) {
      let channels = await super.onChannels({ options, message, messageSync, messageClass });
      if (!channels) {
        channels = ctx.config.module(moduleInfo.relativeName).socketio.message.push.channels;
      }
      return channels;
    }

    async onChannelRender({ channelFullName, options, message, messageSync, messageClass }) {
      if (channelFullName === 'a-mail:mail') {
        return await this._onChannelRenderMail({ channelFullName, options, message, messageSync, messageClass });
      }
      // super
      return await super.onChannelRender({ channelFullName, options, message, messageSync, messageClass });
    }

    async _onChannelRenderMail({ channelFullName, message, messageSync }) {
      // user
      const userId = messageSync.userId;
      const user = await ctx.bean.user.get({ id: userId });
      if (!user) {
        ctx.logger.info('not found user:', userId);
        return null;
      }
      let to = user.email;
      if (!to && (ctx.app.meta.isTest || ctx.app.meta.isLocal)) {
        to = `${user.userName}@test.com`;
      }
      if (!to) return null;
      // content
      const content = JSON.parse(message.content);
      // link
      const link = ctx.bean.base.getAbsoluteUrl(`/#!/a/message/autojump?id=${message.id}`);
      // scope
      const scope = {
        user,
        message,
        content,
        info: {
          link,
          siteName: ctx.instance.title,
        },
      };
      // config
      const configTemplate = ctx.config.module(moduleInfo.relativeName).socketio.message.render.templates[
        channelFullName
      ];
      // subject
      let subject = ctx.text.locale(user.locale, configTemplate.subject);
      subject = ctx.bean.util.replaceTemplate(subject, scope);
      // body
      let body = ctx.text.locale(user.locale, configTemplate.body);
      body = ctx.bean.util.replaceTemplate(body, scope);
      // message
      const _message = {
        to,
        subject,
        text: body,
      };
      // ok
      return {
        scene: null, // use default
        message: _message,
      };
    }

    _notify({ messageClass, user }) {
      if (user.id <= 0) return;
      // stats
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'message',
        nameSub: `${messageClass.module}_${messageClass.messageClassName}`,
        user,
      });
    }
  }
  return IOMessageUniformBase;
};


/***/ }),

/***/ 815:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {
    async execute(context) {
      const { keys, user } = context;
      if (keys.length === 2) {
        // messageClass
        const [module, messageClassName] = keys[1].split('_');
        const messageClass = { module, messageClassName };
        const messageClassBase = ctx.bean.io.messageClass.messageClass(messageClass);
        // options
        const options = {
          where: {
            messageRead: 0,
          },
        };
        // count
        const res = await ctx.bean.io.message.count({ messageClass, options, user });
        const count = res.count;
        // stat
        const color = messageClassBase.info.uniform.stats.color;
        return { [color]: count };
      } else if (keys.length === 1) {
        // message
        const modelStats = ctx.model.module('a-stats').stats;
        const items = await modelStats.select({
          where: {
            module: moduleInfo.relativeName,
            name: {
              op: 'likeRight',
              val: 'message.',
            },
            userId: user.id,
          },
        });
        // count
        const stat = {
          red: 0,
          gray: 0,
        };
        for (const item of items) {
          // only level 2
          if (item.name.split('.').length !== 2) continue;
          const value = JSON.parse(item.value);
          if (value.red !== undefined) stat.red += value.red;
          if (value.gray !== undefined) stat.gray += value.gray;
        }
        // ok
        return stat;
      }
    }
  }

  return Stats;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {}

    async init(options) {}

    async test() {}
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const beanMessage = __webpack_require__(718);
const statsMessage = __webpack_require__(815);
const localIoMessageUniformBase = __webpack_require__(283);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // global
    message: {
      mode: 'ctx',
      bean: beanMessage,
      global: true,
    },
    // stats
    'stats.message': {
      mode: 'ctx',
      bean: statsMessage,
    },
    // local
    'local.ioMessageUniformBase': {
      mode: 'ctx',
      bean: localIoMessageUniformBase,
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

  // socketio
  config.socketio = {
    message: {
      push: {
        channels: ['a-mail:mail'],
      },
      render: {
        templates: {
          'a-mail:mail': {
            subject: 'uniformMessageRenderTemplateMailSubject',
            body: 'uniformMessageRenderTemplateMailBody',
          },
        },
      },
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

// confirmationEmail
//   subject
const uniformMessageRenderTemplateMailSubject = '[{{info.siteName}}] {{content.title}}';
//   body
const uniformMessageRenderTemplateMailBody = `
Hi {{user.userName}},

You have received a new message. Here are the details:

From: {{content.issuerName}}
Title: {{content.title}}
Body: {{content.body}}
Link: {{info.link}}

Regards,
{{info.siteName}} Team
`;

module.exports = {
  uniformMessageRenderTemplateMailSubject,
  uniformMessageRenderTemplateMailBody,
};


/***/ }),

/***/ 72:
/***/ ((module) => {

// confirmationEmail
//   subject
const uniformMessageRenderTemplateMailSubject = '[{{info.siteName}}] {{content.title}}';
//   body
const uniformMessageRenderTemplateMailBody = `
您好，{{user.userName}}，

您收到一条新消息，详情如下：

来自: {{content.issuerName}}
标题: {{content.title}}
正文: {{content.body}}
链接: {{info.link}}

此致，
{{info.siteName}} 团队
`;

module.exports = {
  Messages: '消息',
  Message: '消息',
  uniformMessageRenderTemplateMailSubject,
  uniformMessageRenderTemplateMailBody,
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 935:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'list',
          medium: 'list',
          large: 'list',
        },
      },
    },
    layouts: {
      base: {
        blocks: {},
      },
      list: {
        providerOptions: {
          providerName: 'all',
          autoInit: true,
        },
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutMessageGroupBase',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 7,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 900:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'list',
          medium: 'list',
          large: 'list',
        },
      },
    },
    layouts: {
      base: {
        blocks: {},
      },
      list: {},
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutMessageListBase',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 8,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 512:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const layoutMessageGroupBase = __webpack_require__(935);
const layoutMessageListBase = __webpack_require__(900);

module.exports = app => {
  const layouts = [layoutMessageGroupBase(app), layoutMessageListBase(app)];
  return layouts;
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ }),

/***/ 222:
/***/ ((module) => {

module.exports = app => {
  class MessageController extends app.Controller {
    // options
    //   where, orders
    async group() {
      const options = this.ctx.request.body.options;
      const items = await this.ctx.service.message.group({
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(items);
    }
  }
  return MessageController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const message = __webpack_require__(222);

module.exports = app => {
  const controllers = {
    message,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);
const IOMessageUniformBaseFn = __webpack_require__(283);

module.exports = app => {
  // base
  app.meta.IOMessageUniformBase = IOMessageUniformBaseFn;

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
  const schemas = __webpack_require__(232)(app);
  const staticLayouts = __webpack_require__(512)(app);
  const meta = {
    base: {
      atoms: {},
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
      },
    },
    validation: {
      validators: {},
      keywords: {},
      schemas: {},
    },
    stats: {
      providers: {
        message: {
          user: true,
          bean: 'message',
          dependents: ['a-user:user'],
        },
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 230:
/***/ ((module) => {

module.exports = app => {
  const models = {};
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [{ method: 'post', path: 'message/group', controller: 'message' }];
  return routes;
};


/***/ }),

/***/ 833:
/***/ ((module) => {

module.exports = app => {
  class Message extends app.Service {
    async group({ options, user }) {
      return await this.ctx.bean.message.group({ options, user });
    }
  }
  return Message;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const message = __webpack_require__(833);

module.exports = app => {
  const services = {
    message,
  };
  return services;
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