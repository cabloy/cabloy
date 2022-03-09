/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 581:
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */
var Strategy = __webpack_require__(703);


/**
 * Expose `Strategy` directly from package.
 */
exports = module.exports = Strategy;

/**
 * Export constructors.
 */
exports.Strategy = Strategy;


/***/ }),

/***/ 703:
/***/ ((module) => {

/**
 * Creates an instance of `Strategy`.
 *
 * @constructor
 * @api public
 */
function Strategy() {
}

/**
 * Authenticate request.
 *
 * This function must be overridden by subclasses.  In abstract form, it always
 * throws an exception.
 *
 * @param {Object} req The request to authenticate.
 * @param {Object} [options] Strategy-specific options.
 * @api public
 */
Strategy.prototype.authenticate = function(req, options) {
  throw new Error('Strategy#authenticate must be overridden by subclass');
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;


/***/ }),

/***/ 952:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const chalk = require3('chalk');
const boxen = require3('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Captcha {
    async verify(_context) {
      const { providerInstanceId, context, data, dataInput } = _context;
      // sms provider
      const { provider, config } = this.__createSMSProvider();
      // verify
      await provider.verify({ providerInstanceId, context, data, dataInput, config });
    }

    __createSMSProvider(options) {
      const configModule = ctx.config.module(moduleInfo.relativeName);
      // provider name
      let providerName = options && options.providerName;
      if (!providerName) {
        providerName = configModule.sms.provider.default;
        if (!providerName && (ctx.app.meta.isTest || ctx.app.meta.isLocal)) {
          providerName = 'test';
        }
        if (!providerName) {
          // prompt
          const message = chalk.keyword('orange')(ctx.text('smsProviderNonePrompt'));
          console.log('\n' + boxen(message, boxenOptions));
          ctx.throw.module(moduleInfo.relativeName, 1001);
        }
      }
      // provider
      const provider = ctx.bean._getBean(moduleInfo.relativeName, `sms.provider.${providerName}`);
      const config = configModule.sms.providers[providerName];
      return { provider, config };
    }
  }
  return Captcha;
};


/***/ }),

/***/ 836:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {
    async execute(context, next) {
      const data = context.data;
      // provider
      const providerItem = await ctx.bean.user.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: 'authsms',
      });
      // model auth
      const modelAuth = ctx.model.module('a-base').auth;
      const authItem = await modelAuth.get({ userId: data.userIdFrom, providerId: providerItem.id });
      if (authItem) {
        const user = { id: data.userIdTo, mobile: authItem.profileId };
        await ctx.bean.user.save({ user });
      }
      // next
      await next();
    }
  }

  return eventBean;
};


/***/ }),

/***/ 881:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const popCore = require3('@alicloud/pop-core');

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider {
    async sendCode({ providerInstanceId, context, config }) {
      // get
      const providerInstance = await ctx.bean.captcha.getProviderInstance({ providerInstanceId });
      if (!providerInstance) ctx.throw(403);
      // token
      const token = this.__prefix0(parseInt(Math.random() * 10000), 4);
      const templateParam = { code: token };
      // params
      const params = {
        PhoneNumbers: context.mobile,
        SignName: config.signName,
        TemplateCode: config.templates[providerInstance.sceneName],
        TemplateParam: JSON.stringify(templateParam),
      };
      // send
      await this.__sendSms({ params, config });
      // ok
      return { token };
    }

    async verify({ data, dataInput }) {
      if (!data) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (data.token !== dataInput.token) ctx.throw.module(moduleInfo.relativeName, 1003);
    }

    async __sendSms({ params, config }) {
      const client = new popCore.RPCClient({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        endpoint: config.endpoint,
        apiVersion: config.apiVersion,
      });
      const requestOption = {
        method: 'POST',
      };
      await client.request('SendSms', params, requestOption);
    }

    __prefix0(num, length) {
      return (Array(length).join('0') + num).slice(-length);
    }
  }

  return Provider;
};


/***/ }),

/***/ 87:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const chalk = require3('chalk');
const boxen = require3('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider {
    async sendCode({ context }) {
      // token
      const token = this.__prefix0(parseInt(Math.random() * 10000), 4);
      // prompt
      const message =
        chalk.keyword('cyan')('Test SMS Verification Code To: ') +
        chalk.keyword('yellow')(context.mobile) +
        chalk.keyword('orange')('\n' + token);
      console.log('\n' + boxen(message, boxenOptions));
      // ok
      return { token };
    }

    async verify({ data, dataInput }) {
      if (!data) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (data.token !== dataInput.token) ctx.throw.module(moduleInfo.relativeName, 1003);
    }

    __prefix0(num, length) {
      return (Array(length).join('0') + num).slice(-length);
    }
  }

  return Provider;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const eventAccountMigration = __webpack_require__(836);
const smsProviderTest = __webpack_require__(87);
const smsProviderAliyun = __webpack_require__(881);
const captchaProvider = __webpack_require__(952);

module.exports = app => {
  const beans = {
    // event
    'event.accountMigration': {
      mode: 'ctx',
      bean: eventAccountMigration,
    },
    // sms.provider
    'sms.provider.test': {
      mode: 'ctx',
      bean: smsProviderTest,
    },
    'sms.provider.aliyun': {
      mode: 'ctx',
      bean: smsProviderAliyun,
    },
    // captcha.provider
    'captcha.provider.captcha': {
      mode: 'ctx',
      bean: captchaProvider,
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

  // account
  config.account = {
    url: {
      mobileVerify: '/a/authsms/mobileVerify',
    },
  };

  // captcha scenes
  // const _captchaSimple = {
  //   module: 'a-captchasimple',
  //   name: 'captcha',
  // };
  const _captchaSMS = {
    module: 'a-authsms',
    name: 'captcha',
  };
  config.captcha = {
    scenes: {
      mobileVerify: _captchaSMS,
      signup: _captchaSMS,
      signin: _captchaSMS,
      signupCode: null, // _captchaSimple,
    },
  };

  // sms provider
  config.sms = {
    provider: {
      default: '',
    },
    providers: {
      aliyun: {
        accessKeyId: '',
        secretAccessKey: '',
        endpoint: 'https://dysmsapi.aliyuncs.com',
        apiVersion: '2017-05-25',
        signName: '',
        templates: {
          mobileVerify: '',
          signup: '',
          signin: '',
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
module.exports = {
  1001: 'smsProviderNonePrompt',
  1002: 'SMSCodeInvalid',
  1003: 'SMSCodeMismatch',
  1004: 'Authentication Failed',
  1005: 'User is Disabled',
};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  smsProviderNonePrompt: 'Please specify the sms provider',
  SMSCodeInvalid: 'Verification code is invalid, please retrieve again',
  SMSCodeMismatch: 'Mismatch Verification Code',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  SMS: '短信',
  smsProviderNonePrompt: '请指定SMS Provider',
  SMSCodeInvalid: '认证码已失效，请重新获取',
  SMSCodeMismatch: '认证码不匹配',
  'Auth-SMS': '认证-短信',
  'Element Exists': '元素已存在',
  'Cannot Contain __': '不能包含__',
  'SMS Verification': '短信认证',
  'Authentication Failed': '认证失败',
  'User is Disabled': '用户被禁用',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 443:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const strategy = __webpack_require__(966);
module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const provider = moduleInfo.name;
  async function verify(ctx, body) {
    const { mobile, rememberMe } = body.data;
    // validate
    await ctx.bean.validation.validate({ validator: 'signin', data: body.data });
    // exists
    const user = await ctx.bean.user.exists({ mobile });
    if (!user) return ctx.throw(1004);
    // disabled
    if (user.disabled) return ctx.throw(1005);
    return {
      module: moduleInfo.relativeName,
      provider,
      profileId: mobile,
      maxAge: rememberMe ? null : 0,
      authShouldExists: true,
      profile: {
        mobile,
        rememberMe,
      },
    };
  }
  return {
    providers: {
      [provider]: {
        meta: {
          title: 'SMS',
          inline: true,
          mode: 'direct',
          component: 'signin',
        },
        config: {},
        handler: app => {
          return {
            strategy,
            callback: (req, body, done) => {
              verify(req.ctx, body)
                .then(user => {
                  app.passport.doVerify(req, user, done);
                })
                .catch(err => {
                  done(err);
                });
            },
          };
        },
      },
    },
  };
};


/***/ }),

/***/ 966:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const passport = __webpack_require__(581);
const util = __webpack_require__(837);

function Strategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }
  if (!verify) {
    throw new TypeError('LocalStrategy requires a verify callback');
  }

  passport.Strategy.call(this);
  this.name = 'sms';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function (req) {
  // self
  const self = this;

  // check
  if (req.method === 'GET') {
    // not allow
    return self.error(req.ctx.parseFail(403));
  }

  // verified
  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    req.ctx.success(user);
    self.success(user, info);
  }

  try {
    if (self._passReqToCallback) {
      this._verify(req, req.body, verified);
    } else {
      this._verify(req.body, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};

module.exports = Strategy;


/***/ }),

/***/ 415:
/***/ ((module) => {

module.exports = app => {
  const keywords = {};
  keywords.exists = {
    async: true,
    type: 'string',
    errors: true,
    compile() {
      return async function (data, path, rootData, name) {
        const ctx = this;
        const res = await ctx.bean.user.exists({ [name]: data });
        if (res && res.id !== ctx.state.user.agent.id) {
          const errors = [{ keyword: 'x-exists', params: [], message: ctx.text('Element Exists') }];
          throw new app.meta.ajv.ValidationError(errors);
        }
        if (!res && data.indexOf('__') > -1) {
          const errors = [{ keyword: 'x-exists', params: [], message: ctx.text('Cannot Contain __') }];
          throw new app.meta.ajv.ValidationError(errors);
        }
        return true;
      };
    },
  };
  return keywords;
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  schemas.signup = {
    type: 'object',
    properties: {
      userName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        notEmpty: true,
        'x-exists': true,
      },
      realName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Realname',
        notEmpty: true,
      },
      mobile: {
        type: 'string',
        ebType: 'text',
        ebParams: {
          inputType: 'tel',
        },
        ebTitle: 'Phone Number',
        notEmpty: true,
        'x-exists': true,
      },
    },
  };
  schemas.signin = {
    type: 'object',
    properties: {
      mobile: {
        type: 'string',
        ebType: 'text',
        ebParams: {
          inputType: 'tel',
        },
        ebTitle: 'Phone Number',
        notEmpty: true,
      },
      rememberMe: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Remember Me',
      },
    },
  };
  schemas.mobileVerify = {
    type: 'object',
    properties: {
      userName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        ebReadOnly: true,
      },
      mobile: {
        type: 'string',
        ebType: 'text',
        ebParams: {
          inputType: 'tel',
        },
        ebTitle: 'Phone Number',
        notEmpty: true,
        'x-exists': true,
      },
    },
  };

  return schemas;
};


/***/ }),

/***/ 523:
/***/ ((module) => {

module.exports = app => {
  class AuthController extends app.Controller {
    async signin() {
      // data: { mobile, rememberMe }
      const data = this.ctx.request.body.data;
      const state = this.ctx.request.body.state;
      const res = await this.service.auth.signin({ data, state });
      this.ctx.success(res);
    }

    async signup() {
      const { userName, realName, mobile } = this.ctx.request.body.data;
      const state = this.ctx.request.body.state;
      const res = await this.service.auth.signup({
        user: this.ctx.state.user.agent,
        state,
        userName,
        realName,
        mobile,
      });
      this.ctx.success(res);
    }

    async mobileVerify() {
      const { mobile } = this.ctx.request.body.data;
      const res = await this.service.auth.mobileVerify({
        user: this.ctx.state.user.agent,
        mobile,
      });
      this.ctx.success(res);
    }
  }
  return AuthController;
};


/***/ }),

/***/ 820:
/***/ ((module) => {

module.exports = app => {
  class CaptchaController extends app.Controller {
    async sendCode() {
      await this.ctx.service.captcha.sendCode({
        providerInstanceId: this.ctx.request.body.providerInstanceId,
        context: this.ctx.request.body.context,
      });
      this.ctx.success();
    }
  }
  return CaptchaController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const captcha = __webpack_require__(820);
const auth = __webpack_require__(523);

module.exports = app => {
  const controllers = {
    captcha,
    auth,
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
  // auth
  const auth = __webpack_require__(443)(app);
  // keywords
  const keywords = __webpack_require__(415)(app);
  // schemas
  const schemas = __webpack_require__(232)(app);
  return {
    auth,
    validation: {
      validators: {
        signup: {
          schemas: 'signup',
        },
        signin: {
          schemas: 'signin',
        },
        mobileVerify: {
          schemas: 'mobileVerify',
        },
      },
      keywords: {
        'x-exists': keywords.exists,
      },
      schemas: {
        signup: schemas.signup,
        signin: schemas.signin,
        mobileVerify: schemas.mobileVerify,
      },
    },
    event: {
      implementations: {
        'a-base:accountMigration': 'accountMigration',
      },
    },
  };
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
    // captcha
    { method: 'post', path: 'captcha/sendCode', controller: 'captcha' },
    // auth
    {
      method: 'post',
      path: 'auth/signin',
      controller: 'auth',
      middlewares: 'captchaVerify',
      meta: {
        captchaVerify: { scene: { name: 'signin' } },
      },
    },
    {
      method: 'post',
      path: 'auth/signup',
      controller: 'auth',
      middlewares: 'captchaVerify,validate',
      meta: {
        captchaVerify: {
          scenes: [
            { name: 'signupCode', dataKey: 'captchaCode', fieldKey: 'tokenCode' },
            { name: 'signup', dataKey: 'captcha', fieldKey: 'token' },
          ],
        },
        validate: { validator: 'signup' },
      },
    },
    {
      method: 'post',
      path: 'auth/mobileVerify',
      controller: 'auth',
      middlewares: 'validate,captchaVerify',
      meta: {
        validate: { validator: 'mobileVerify' },
        captchaVerify: { scene: { name: 'mobileVerify' } },
      },
    },
  ];
  return routes;
};


/***/ }),

/***/ 300:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Auth extends app.Service {
    async signup({ user, state = 'login', userName, realName, mobile }) {
      // profileUser
      const profileUser = {
        module: moduleInfo.relativeName,
        provider: 'authsms',
        profileId: mobile,
        maxAge: 0,
        profile: {
          mobile,
          rememberMe: false,
        },
      };

      // verify
      const verifyUser = await this.ctx.bean.user.verify({ state, profileUser });
      if (!verifyUser) this.ctx.throw(403);

      // userId
      const userId = verifyUser.agent.id;

      // override user's info: userName/realName/mobile
      const userNew = { id: userId };
      if (userName) {
        if (state === 'login' || !user.userName || user.userName.indexOf('__') > -1) {
          userNew.userName = userName;
        }
      }
      if (realName) {
        userNew.realName = realName;
      }
      await this.ctx.bean.user.save({
        user: userNew,
      });
      // save mobile
      await this.ctx.bean.user.setActivated({
        user: { id: userId, mobile, mobileVerified: 1 },
      });

      // login now
      //   always no matter login/associate
      await this.ctx.login(verifyUser);

      // ok
      return verifyUser;
    }

    // data: { mobile, rememberMe }
    async signin({ data, state = 'login' }) {
      const res = await this.ctx.meta.util.performAction({
        method: 'post',
        url: `passport/a-authsms/authsms?state=${state}`,
        body: { data },
      });
      return res;
    }

    async mobileVerify({ user, mobile }) {
      await this.signup({ user, state: 'associate', userName: null, realName: null, mobile });
    }
  }

  return Auth;
};


/***/ }),

/***/ 68:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Captcha extends app.Service {
    async sendCode({ providerInstanceId, context }) {
      // sms provider
      const bean = this.ctx.bean._getBean(`${moduleInfo.relativeName}.captcha.provider.captcha`);
      const { provider, config } = bean.__createSMSProvider();
      // sendCode
      const data = await provider.sendCode({ providerInstanceId, context, config });
      // update
      await this.ctx.bean.captcha.update({
        providerInstanceId,
        data,
        context,
      });
    }
  }

  return Captcha;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const captcha = __webpack_require__(68);
const auth = __webpack_require__(300);

module.exports = app => {
  const services = {
    captcha,
    auth,
  };
  return services;
};


/***/ }),

/***/ 638:
/***/ ((module) => {

"use strict";
module.exports = require("require3");

/***/ }),

/***/ 837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

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