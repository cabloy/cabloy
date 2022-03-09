/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 435:
/***/ ((module) => {

module.exports = ctx => {
  class Stats {
    async execute(context) {
      const { provider, user } = context;
      const dependencies = provider.dependencies;
      const res = { red: 0, orange: 0 };
      for (const dep of dependencies) {
        const [module, fullName] = dep.split(':');
        const value = await ctx.bean.stats._get({
          module,
          fullName,
          user,
        });
        // value maybe undefined
        if (!value) continue;
        if (dep === 'a-user:userRed') {
          res.red += value;
        } else if (dep === 'a-user:userOrange') {
          res.orange += value;
        } else if (dep === 'a-message:message' || dep === 'a-base:starsLabels') {
          if (value.red !== undefined) {
            res.red += value.red;
          }
          if (value.orange !== undefined) {
            res.orange += value.orange;
          }
          // ignore gray
        }
      }
      return res;
    }
  }

  return Stats;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const statsUser = __webpack_require__(435);
module.exports = app => {
  const beans = {
    // stats
    'stats.user': {
      mode: 'ctx',
      bean: statsUser,
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
  User: '用户',
  Comments: '评论',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 836:
/***/ ((module) => {

module.exports = app => {
  class PublicController extends app.Controller {
    async profile() {
      const res = await this.service.public.profile({
        userId: this.ctx.request.body.userId,
      });
      this.ctx.success(res);
    }
  }
  return PublicController;
};


/***/ }),

/***/ 37:
/***/ ((module) => {

module.exports = app => {
  class UserController extends app.Controller {
    async save() {
      const res = await this.service.user.save({
        data: this.ctx.request.body.data,
        user: this.ctx.state.user.agent,
      });
      this.ctx.success(res);
    }

    async saveAvatar() {
      const res = await this.service.user.saveAvatar({
        data: this.ctx.request.body.data,
        user: this.ctx.state.user.agent,
      });
      this.ctx.success(res);
    }

    async saveLocale() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.saveLocale({
        data: this.ctx.request.body.data,
        user: this.ctx.state.user.agent,
      });
      this.ctx.success(res);
    }

    async agent() {
      const res = await this.service.user.agent({ userId: this.ctx.state.user.agent.id });
      this.ctx.success(res);
    }

    async agentsBy() {
      const res = await this.service.user.agentsBy({ userId: this.ctx.state.user.agent.id });
      this.ctx.success(res);
    }

    async userByMobile() {
      const res = await this.service.user.userByMobile({ mobile: this.ctx.request.body.mobile });
      this.ctx.success(res);
    }

    async addAgent() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.addAgent({
        userIdAgent: this.ctx.request.body.userIdAgent,
        userId: this.ctx.state.user.agent.id,
      });
      this.ctx.success(res);
    }

    async removeAgent() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.removeAgent({
        userIdAgent: this.ctx.request.body.userIdAgent,
        userId: this.ctx.state.user.agent.id,
      });
      this.ctx.success(res);
    }

    async switchAgent() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.switchAgent({
        userIdAgent: this.ctx.request.body.userIdAgent,
      });
      this.ctx.success(res);
    }

    async switchOffAgent() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.switchOffAgent();
      this.ctx.success(res);
    }

    async authentications() {
      const res = await this.service.user.authentications({
        user: this.ctx.state.user.agent,
      });
      this.ctx.success(res);
    }

    async authenticationDisable() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.authenticationDisable({
        authId: this.ctx.request.body.authId,
        user: this.ctx.state.user.agent,
      });
      this.ctx.success(res);
    }

    async themeLoad() {
      const res = await this.service.user.themeLoad({
        user: this.ctx.state.user.agent,
      });
      this.ctx.success(res);
    }

    async themeSave() {
      await this.service.user.themeSave({
        theme: this.ctx.request.body.theme,
        user: this.ctx.state.user.agent,
      });
      this.ctx.success();
    }
  }
  return UserController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const user = __webpack_require__(37);
const public2 = __webpack_require__(836);

module.exports = app => {
  const controllers = {
    user,
    public: public2,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

// eslint-disable-next-line
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
/***/ ((module) => {

module.exports = app => {
  // meta
  const meta = {
    stats: {
      providers: {
        userRed: {
          user: true,
          bean: {
            module: 'a-stats',
            name: 'deps',
          },
          dependencies: ['a-flowtask:taskClaimings', 'a-flowtask:taskHandlings'],
        },
        userOrange: {
          user: true,
          bean: {
            module: 'a-stats',
            name: 'deps',
          },
          dependencies: [
            'a-base:drafts',
            // 'a-base:stars',
            'a-flow:flowInitiateds',
          ],
        },
        user: {
          user: true,
          bean: {
            module: 'a-user',
            name: 'user',
          },
          // dependencies: ['a-user:userRed', 'a-user:userOrange', 'a-message:message', 'a-base:starsLabels'],
          dependencies: ['a-user:userRed', 'a-user:userOrange'],
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
  const routes = [
    // user
    {
      method: 'post',
      path: 'user/save',
      controller: 'user',
      middlewares: 'validate',
      meta: { validate: { module: 'a-base', validator: 'user' } },
    },
    { method: 'post', path: 'user/saveAvatar', controller: 'user' },
    { method: 'post', path: 'user/saveLocale', controller: 'user' },
    { method: 'post', path: 'user/agent', controller: 'user' },
    { method: 'post', path: 'user/agentsBy', controller: 'user' },
    { method: 'post', path: 'user/userByMobile', controller: 'user' },
    { method: 'post', path: 'user/addAgent', controller: 'user' },
    { method: 'post', path: 'user/removeAgent', controller: 'user' },
    { method: 'post', path: 'user/switchAgent', controller: 'user' },
    { method: 'post', path: 'user/switchOffAgent', controller: 'user' },
    { method: 'post', path: 'user/authentications', controller: 'user' },
    { method: 'post', path: 'user/authenticationDisable', controller: 'user' },
    { method: 'post', path: 'user/themeLoad', controller: 'user' },
    { method: 'post', path: 'user/themeSave', controller: 'user' },
    // public
    { method: 'post', path: 'public/profile', controller: 'public' },
  ];
  return routes;
};


/***/ }),

/***/ 879:
/***/ ((module) => {

module.exports = app => {
  class Public2 extends app.Service {
    async profile({ userId }) {
      const item = await this.ctx.bean.user.get({ id: userId });
      const user = {
        userName: item.userName,
        avatar: item.avatar,
        motto: item.motto,
      };
      return { user };
    }
  }
  return Public2;
};


/***/ }),

/***/ 323:
/***/ ((module) => {

module.exports = app => {
  class User extends app.Service {
    async save({ data, user }) {
      // id
      data.id = user.id;
      // readOnly
      delete data.userName;
      delete data.email;
      delete data.mobile;
      delete data.locale;
      // save
      return await this.ctx.bean.user.save({ user: data });
    }

    async saveAvatar({ data, user }) {
      const userData = { id: user.id, avatar: data.avatar };
      return await this.ctx.bean.user.save({ user: userData });
    }

    async saveLocale({ data, user }) {
      const userData = { id: user.id, locale: data.locale };
      return await this.ctx.bean.user.save({ user: userData });
    }

    async agent({ userId }) {
      return await this.ctx.bean.user.agent({ userId });
    }

    async agentsBy({ userId }) {
      return await this.ctx.bean.user.agentsBy({ userId });
    }

    async userByMobile({ mobile }) {
      return await this.ctx.bean.user.exists({ mobile });
    }

    async addAgent({ userIdAgent, userId }) {
      return await this.ctx.bean.user.addAgent({ userIdAgent, userId });
    }

    async removeAgent({ userIdAgent, userId }) {
      return await this.ctx.bean.user.removeAgent({ userIdAgent, userId });
    }

    async switchAgent({ userIdAgent }) {
      return await this.ctx.bean.user.switchAgent({ userIdAgent });
    }

    async switchOffAgent() {
      return await this.ctx.bean.user.switchOffAgent();
    }

    async authentications({ user }) {
      // 1. get auth providers list from a-login
      const listLogin = await this.ctx.meta.util.performAction({
        method: 'post',
        url: '/a/login/auth/list',
      });
      if (listLogin.length === 0) return [];
      const ids = listLogin.map(item => item.id);
      // 2. list with aAuth
      const sql = `
        select a.id as providerId,a.module,a.providerName,b.id as authId from aAuthProvider a
          left join aAuth b on a.id=b.providerId and b.userId=?
            where a.id in (${ids.join(',')})
      `;
      const list = await this.ctx.model.query(sql, [user.id]);
      // sort
      list.sort((a, b) => ids.findIndex(item => item === a.providerId) - ids.findIndex(item => item === b.providerId));
      // meta
      const authProviders = this.ctx.bean.base.authProviders();
      for (const item of list) {
        const key = `${item.module}:${item.providerName}`;
        const authProvider = authProviders[key];
        item.meta = authProvider.meta;
      }
      // ok
      return list;
    }

    async authenticationDisable({ authId, user }) {
      // must use userId in where
      await this.ctx.model.query('delete from aAuth where id=? and userId=?', [authId, user.id]);
    }

    async themeLoad({ user }) {
      const name = `user-theme:${user.id}`;
      return await this.ctx.bean.status.get(name);
    }

    async themeSave({ theme, user }) {
      const name = `user-theme:${user.id}`;
      await this.ctx.bean.status.set(name, theme);
    }
  }

  return User;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const user = __webpack_require__(323);
const public2 = __webpack_require__(879);

module.exports = app => {
  const services = {
    user,
    public: public2,
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