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

module.exports = require("require3");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(2);
const locales = __webpack_require__(3);
const errors = __webpack_require__(6);
const middlewares = __webpack_require__(7);

module.exports = app => {

  // routes
  const routes = __webpack_require__(8)(app);
  // services
  const services = __webpack_require__(12)(app);
  // models
  const models = __webpack_require__(19)(app);
  // meta
  const meta = __webpack_require__(20)(app);

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
  smsProviderNonePrompt: 'Please specify the sms provider',
  SMSCodeInvalid: 'Verification code is invalid, please retrieve again',
  SMSCodeMismatch: 'Mismatch Verification Code',
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {
  SMS: '短信',
  smsProviderNonePrompt: '请指定SMS Provider',
  SMSCodeInvalid: '认证码已失效，请重新获取',
  SMSCodeMismatch: '认证码不匹配',
  'Element Exists': '元素已存在',
  'Cannot Contain __': '不能包含__',
  'SMS Verification': '短信认证',
  'Authentication Failed': '认证失败',
  'User is Disabled': '用户被禁用',
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'smsProviderNonePrompt',
  1002: 'SMSCodeInvalid',
  1003: 'SMSCodeMismatch',
  1004: 'Authentication Failed',
  1005: 'User is Disabled',
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(9);
const captcha = __webpack_require__(10);
const auth = __webpack_require__(11);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // captcha
    { method: 'post', path: 'captcha/sendCode', controller: captcha, middlewares: 'captcha' },
    { method: 'post', path: 'captcha/verify', controller: captcha, middlewares: 'inner' },
    // auth
    { method: 'post', path: 'auth/signin', controller: auth, middlewares: 'captchaVerify',
      meta: {
        captchaVerify: { scene: { name: 'signin' } },
      },
    },
    { method: 'post', path: 'auth/signup', controller: auth, middlewares: 'captchaVerify,validate',
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
    { method: 'post', path: 'auth/mobileVerify', controller: auth, middlewares: 'validate,captchaVerify',
      meta: {
        validate: { validator: 'mobileVerify' },
        captchaVerify: { scene: { name: 'mobileVerify' } },
      },
    },
  ];
  return routes;
};


/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, exports) {

module.exports = app => {
  class CaptchaController extends app.Controller {

    async sendCode() {
      await this.ctx.service.captcha.sendCode({
        providerInstanceId: this.ctx.request.body.providerInstanceId,
        context: this.ctx.request.body.context,
      });
      this.ctx.success();
    }

    async verify() {
      const { providerInstanceId, context, data, dataInput } = this.ctx.request.body;
      await this.ctx.service.captcha.verify({ providerInstanceId, context, data, dataInput });
      this.ctx.success();
    }

  }
  return CaptchaController;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = app => {
  class AuthController extends app.Controller {

    async signin() {
      const { mobile, rememberMe } = this.ctx.request.body.data;
      const res = await this.service.auth.signin({ mobile, rememberMe });
      this.ctx.success(res);
    }

    async signup() {
      const { userName, realName, mobile } = this.ctx.request.body.data;
      const state = this.ctx.request.body.state;
      const res = await this.service.auth.signup({
        user: this.ctx.user.agent,
        state,
        userName, realName, mobile,
      });
      this.ctx.success(res);
    }

    async mobileVerify() {
      const { mobile } = this.ctx.request.body.data;
      const res = await this.service.auth.mobileVerify({
        user: this.ctx.user.agent,
        mobile,
      });
      this.ctx.success(res);
    }


  }
  return AuthController;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(13);
const captcha = __webpack_require__(14);
const auth = __webpack_require__(18);

module.exports = app => {
  const services = {
    version,
    captcha,
    auth,
  };
  return services;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
    }

    async init(options) {
    }

    async test() {
    }

  }

  return Version;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const chalk = require3('chalk');
const boxen = require3('boxen');
const SMSProviders = __webpack_require__(15);

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = app => {

  class Captcha extends app.Service {

    async sendCode({ providerInstanceId, context }) {
      // sms provider
      const { provider, config } = this.__createSMSProvider();
      // sendCode
      const data = await provider.sendCode({ providerInstanceId, context, config });
      // update
      await this.ctx.meta.captcha.update({
        providerInstanceId, data, context,
      });
    }

    async verify({ providerInstanceId, context, data, dataInput }) {
      // sms provider
      const { provider, config } = this.__createSMSProvider();
      // verify
      await provider.verify({ providerInstanceId, context, data, dataInput, config });
    }

    __createSMSProvider() {
      // providerName
      let providerName = this.ctx.config.sms.provider.default;
      if (!providerName && (app.meta.isTest || app.meta.isLocal)) {
        providerName = 'test';
      }
      if (!providerName) {
        // prompt
        const message = chalk.keyword('orange')(this.ctx.text('smsProviderNonePrompt'));
        console.log('\n' + boxen(message, boxenOptions));
        this.ctx.throw(1001);
      }
      // provider
      const provider = new (SMSProviders[providerName](this.ctx))();
      const config = this.ctx.config.sms.providers[providerName];
      return { provider, config };
    }

  }

  return Captcha;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const test = __webpack_require__(16);
const aliyun = __webpack_require__(17);

module.exports = {
  test,
  aliyun,
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const chalk = require3('chalk');
const boxen = require3('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = function(ctx) {

  class Provider {

    async sendCode({ context }) {
      // token
      const token = this.__prefix0(parseInt(Math.random() * 10000), 4);
      // prompt
      const message = chalk.keyword('cyan')('Test SMS Verification Code To: ')
                        + chalk.keyword('yellow')(context.mobile)
                        + chalk.keyword('orange')('\n' + token);
      console.log('\n' + boxen(message, boxenOptions));
      // ok
      return { token };
    }

    async verify({ data, dataInput }) {
      if (!data) ctx.throw(1002);
      if (data.token !== dataInput.token) ctx.throw(1003);
    }

    __prefix0(num, length) {
      return (Array(length).join('0') + num).slice(-length);
    }

  }

  return Provider;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const popCore = require3('@alicloud/pop-core');

module.exports = function(ctx) {

  class Provider {

    async sendCode({ providerInstanceId, context, config }) {
      // get
      const providerInstance = await ctx.meta.captcha.getProviderInstance({ providerInstanceId });
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
      if (!data) ctx.throw(1002);
      if (data.token !== dataInput.token) ctx.throw(1003);
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
/* 18 */
/***/ (function(module, exports) {

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
      const verifyUser = await this.ctx.meta.user.verify({ state, profileUser });
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
      await this.ctx.meta.user.save({
        user: userNew,
      });
      // save mobile
      await this.ctx.meta.user.setActivated({
        user: { id: userId, mobile, mobileVerified: 1 },
      });

      // login now
      //   always no matter login/associate
      await this.ctx.login(verifyUser);

      // ok
      return verifyUser;
    }

    async signin({ mobile, rememberMe }) {
      const res = await this.ctx.performAction({
        method: 'post',
        url: 'passport/a-authsms/authsms',
        body: { mobile, rememberMe },
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
/* 19 */
/***/ (function(module, exports) {

module.exports = app => {
  const models = {
  };
  return models;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  // auth
  const auth = __webpack_require__(21)(app);
  // keywords
  const keywords = __webpack_require__(26)(app);
  // schemas
  const schemas = __webpack_require__(27)(app);
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
  };
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const strategy = __webpack_require__(22);
module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const provider = moduleInfo.name;
  async function verify(ctx, body) {
    const { mobile, rememberMe } = body;
    // validate
    await ctx.meta.validation.validate({ validator: 'signin', data: body });
    // exists
    const user = await ctx.meta.user.exists({ mobile });
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
          mode: 'direct',
          component: 'signin',
        },
        config: {
        },
        handler: app => {
          return {
            strategy,
            callback: (req, body, done) => {
              verify(req.ctx, body).then(user => {
                app.passport.doVerify(req, user, done);
              }).catch(err => { done(err); });
            },
          };
        },
      },
    },
  };
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const passport = __webpack_require__(23);
const util = __webpack_require__(25);

function Strategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError('LocalStrategy requires a verify callback'); }

  passport.Strategy.call(this);
  this.name = 'sms';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function(req) {
  // self
  const self = this;

  // check
  if (req.method === 'GET') {
    if (req.query.state === 'associate') {
      // goto signup
      let url = '/#!/a/authsms/signup?state=associate';
      if (req.query.returnTo) {
        url = `${url}&returnTo=${encodeURIComponent(req.query.returnTo)}`;
      }
      url = req.ctx.meta.base.getAbsoluteUrl(url);
      return self.redirect(url);
    }
    // not allow
    return self.error(req.ctx.parseFail(403));
  }

  // verified
  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */
var Strategy = __webpack_require__(24);


/**
 * Expose `Strategy` directly from package.
 */
exports = module.exports = Strategy;

/**
 * Export constructors.
 */
exports.Strategy = Strategy;


/***/ }),
/* 24 */
/***/ (function(module, exports) {

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
/* 25 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = app => {
  const keywords = {};
  keywords.exists = {
    async: true,
    type: 'string',
    errors: true,
    compile() {
      return async function(data, path, rootData, name) {
        const ctx = this;
        const res = await ctx.meta.user.exists({ [name]: data });
        if (res && res.id !== ctx.user.agent.id) {
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
/* 27 */
/***/ (function(module, exports) {

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
        ebInputType: 'tel',
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
        ebInputType: 'tel',
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
        ebInputType: 'tel',
        ebTitle: 'Phone Number',
        notEmpty: true,
        'x-exists': true,
      },
    },
  };

  return schemas;
};



/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map