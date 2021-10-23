/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 806:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {
    async execute(context, next) {
      const data = context.data;
      const message = data.message;
      console.log('-------dingtalk callback, EventType: ', message.EventType);
      // next
      await next();
    }
  }

  return eventBean;
};


/***/ }),

/***/ 427:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const extend = require3('extend2');

module.exports = ctx => {
  class eventBean {
    async execute(context, next) {
      const info = context.data.info;
      const provider = info.user && info.user.provider;
      if (provider && provider.module === 'a-dingtalk' && provider.providerName === 'dingtalk') {
        info.config = extend(true, info.config, {
          modules: {
            'a-layoutmobile': {
              layout: {
                presets: {
                  authenticated: {
                    scene: {
                      web: 'test-dingtalk:layoutTest',
                    },
                  },
                },
              },
            },
          },
        });
      }
      // next
      await next();
    }
  }

  return eventBean;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const eventLoginInfo = __webpack_require__(427);
const eventDingtalkCallback = __webpack_require__(806);

module.exports = app => {
  const beans = {
    'event.loginInfo': {
      mode: 'ctx',
      bean: eventLoginInfo,
    },
    'event.dingtalkCallback': {
      mode: 'ctx',
      bean: eventDingtalkCallback,
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
  return config;
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
  Reply: '回复',
  'Test Layout(Dingtalk)': '测试布局（钉钉）',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 756:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    toolbar: {
      buttons: [
        { module: 'test-dingtalk', name: 'buttonTest' },
        { module: 'a-layoutmobile', name: 'buttonHome' },
        { module: 'a-layoutmobile', name: 'buttonMine' },
      ],
    },
  };
  const layout = {
    atomName: 'Test Layout(Dingtalk)',
    atomStaticKey: 'layoutTest',
    atomRevision: 2,
    description: '',
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 512:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const layoutTest = __webpack_require__(756);

module.exports = app => {
  const layouts = [layoutTest(app)];
  return layouts;
};


/***/ }),

/***/ 429:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // tabbar buttons
    {
      atomName: 'Test',
      description: 'Tabbar Button: Test(Dingtalk)',
      atomStaticKey: 'buttonTest',
      atomRevision: 0,
      atomCategoryId: 'a-layoutmobile:button.General',
      resourceType: 'a-layoutmobile:button',
      resourceConfig: JSON.stringify({
        module: 'a-layoutmobile',
        component: 'buttonLink',
        icon: { material: 'group_work' },
        url: '/test/dingtalk/test/index',
      }),
      resourceRoles: 'root',
    },
  ];
  return resources;
};


/***/ }),

/***/ 821:
/***/ ((module) => {

module.exports = app => {
  class TestController extends app.Controller {
    async getMemberId() {
      const res = await this.service.test.getMemberId({
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async sendAppMessage() {
      const res = await this.service.test.sendAppMessage({
        message: this.ctx.request.body.message,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }
  return TestController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const test = __webpack_require__(821);

module.exports = app => {
  const controllers = {
    test,
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
  const staticLayouts = __webpack_require__(512)(app);
  const staticResources = __webpack_require__(429)(app);
  const meta = {
    base: {
      atoms: {},
      statics: {
        'a-layoutpc.layout': {
          items: staticLayouts,
        },
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {},
      keywords: {},
      schemas: {},
    },
    event: {
      implementations: {
        'a-dingtalk:dingtalkCallback': 'dingtalkCallback',
        'a-base:loginInfo': 'loginInfo',
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

const _sceneAll = 'dingtalk,dingtalkweb,dingtalkadmin,dingtalkmini';

module.exports = app => {
  const routes = [
    // test
    {
      method: 'post',
      path: 'test/getMemberId',
      controller: 'test',
      middlewares: 'inDingtalk',
      meta: {
        inDingtalk: {
          scene: _sceneAll,
        },
      },
    },
    {
      method: 'post',
      path: 'test/sendAppMessage',
      controller: 'test',
      middlewares: 'inDingtalk',
      meta: {
        inDingtalk: {
          scene: _sceneAll,
        },
      },
    },
  ];
  return routes;
};


/***/ }),

/***/ 618:
/***/ ((module) => {

module.exports = app => {
  class Test extends app.Service {
    async getMemberId({ user }) {
      const modelMember = this.ctx.model.module('a-dingtalk').member;
      const member = await modelMember.get({ userId: user.id });
      return {
        memberId: member.memberId,
      };
    }

    async sendAppMessage({ message, user }) {
      const msg = {
        msgtype: 'text',
        text: {
          content: message.text,
        },
      };
      const content = {
        userIds: [user.id],
        data: { msg },
      };
      await this.ctx.bean.io.pushDirect({
        content,
        channel: { module: 'a-dingtalk', name: 'app' },
      });
    }
  }

  return Test;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const test = __webpack_require__(618);

module.exports = app => {
  const services = {
    test,
  };
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