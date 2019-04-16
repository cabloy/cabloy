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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const routes = __webpack_require__(3);
const services = __webpack_require__(6);
const models = __webpack_require__(12);
const config = __webpack_require__(15);
const locales = __webpack_require__(16);
const errors = __webpack_require__(19);
const metaFn = __webpack_require__(20);

module.exports = app => {
  return {
    routes,
    services,
    models,
    config,
    locales,
    errors,
    meta: metaFn(app),
  };
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(4);
const auth = __webpack_require__(5);

module.exports = [
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
  { method: 'post', path: 'auth/add', controller: auth, middlewares: 'inner' },
  { method: 'post', path: 'auth/signin', controller: auth, middlewares: 'captchaVerify' },
  { method: 'post', path: 'auth/signup', controller: auth, middlewares: 'captchaVerify,validate',
    meta: { validate: { validator: 'signup' } },
  },
  { method: 'post', path: 'auth/passwordChange', controller: auth, middlewares: 'captchaVerify,validate',
    meta: { validate: { validator: 'passwordChange' } },
  },
  { method: 'post', path: 'auth/passwordForgot', controller: auth, middlewares: 'validate,mail',
    meta: { validate: { validator: 'passwordForgot' } },
  },
  { method: 'post', path: 'auth/passwordReset', controller: auth, middlewares: 'validate',
    meta: { validate: { validator: 'passwordReset' } },
  },
  { method: 'post', path: 'auth/emailConfirm', controller: auth, middlewares: 'validate,mail',
    meta: { validate: { validator: 'emailConfirm' } },
  },
  { method: 'get', path: 'auth/emailConfirmation', controller: auth },

];


/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports) {

module.exports = app => {
  class AuthController extends app.Controller {

    async add() {
      const { userId, password } = this.ctx.request.body;
      await this.service.auth.add({ userId, password });
      this.ctx.success();
    }

    async signin() {
      const { auth, password, rememberMe } = this.ctx.request.body.data;
      const res = await this.service.auth.signin({ auth, password, rememberMe });
      this.ctx.success(res);
    }

    async signup() {
      const { userName, realName, email, mobile, password } = this.ctx.request.body.data;
      const state = this.ctx.request.body.state;
      const res = await this.service.auth.signup({
        user: this.ctx.user.agent,
        state,
        userName, realName, email, mobile, password,
      });
      this.ctx.success(res);
    }

    async passwordChange() {
      const { passwordOld, passwordNew } = this.ctx.request.body.data;
      await this.service.auth.passwordChange({ passwordOld, passwordNew, userId: this.ctx.user.agent.id });
      this.ctx.success();
    }

    async passwordForgot() {
      const { email } = this.ctx.request.body.data;
      await this.service.auth.passwordForgot({ email });
      this.ctx.success();
    }

    async passwordReset() {
      const { passwordNew } = this.ctx.request.body.data;
      const token = this.ctx.request.body.token;
      await this.service.auth.passwordReset({ passwordNew, token });
      this.ctx.success();
    }

    async emailConfirm() {
      const { email } = this.ctx.request.body.data;
      await this.service.auth.emailConfirm({ email, user: this.ctx.user.agent });
      this.ctx.success();
    }

    async emailConfirmation() {
      const token = this.ctx.request.query.token;
      await this.service.auth.emailConfirmation({ token });
      // this.ctx.success();
    }


  }
  return AuthController;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(7);
const auth = __webpack_require__(8);
module.exports = {
  version,
  auth,
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = app => {
  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // create table: aStatus
        const sql = `
          CREATE TABLE aAuthSimple (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            hash text DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        // root
        const user = await this.ctx.meta.user.get({ userName: 'root' });
        await this.ctx.service.auth.add({
          userId: user.id,
          password: options.password,
        });
      }
    }

    async test() {

    }

  }

  return Version;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const util = __webpack_require__(0);
const passwordFn = __webpack_require__(9); // should compile
const require3 = __webpack_require__(1);
const uuid = require3('uuid');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Auth extends app.Service {

    // mobile: not use
    async signup({ user, state = 'login', userName, realName, email, mobile, password }) {

      // add authsimple
      const authSimpleId = await this._addAuthSimple({ password });

      // profileUser
      const profileUser = {
        module: moduleInfo.relativeName,
        provider: 'authsimple',
        profileId: authSimpleId,
        maxAge: 0,
        profile: {
          authSimpleId,
          rememberMe: false,
        },
      };

      // verify
      const verifyUser = await this.ctx.meta.user.verify({ state, profileUser });
      if (!verifyUser) this.ctx.throw(403);

      // userId
      const userId = verifyUser.agent.id;
      // remove old records
      await this.ctx.model.authSimple.delete({ userId });
      // update userId
      await this.ctx.model.authSimple.update({ id: authSimpleId, userId });

      // override user's info: userName/realName/email
      const userNew = { id: userId, realName };
      if (state === 'login' || !user.userName || user.userName.indexOf('__') > -1) {
        userNew.userName = userName;
      }
      await this.ctx.meta.user.save({
        user: userNew,
      });
      // save email
      if (email !== verifyUser.agent.email) {
        await this.ctx.meta.user.setActivated({
          user: { id: userId, email, emailConfirmed: 0 },
        });
      }

      // login now
      //   always no matter login/associate
      await this.ctx.login(verifyUser);

      // ok
      return verifyUser;
    }

    async signin({ auth, password, rememberMe }) {
      try {
        const res = await this.ctx.performAction({
          method: 'post',
          url: 'passport/a-authsimple/authsimple',
          body: { auth, password, rememberMe },
        });
        return res;
      } catch (err) {
        const error = new Error();
        error.code = err.code;
        error.message = err.message;
        throw error;
      }
    }

    async _addAuthSimple({ password }) {
      // hash
      password = password || this.ctx.config.defaultPassword;
      const hash = await this._calcPassword({ password });
      // auth simple
      const res = await this.ctx.model.authSimple.insert({
        userId: 0,
        hash,
      });
      return res.insertId;
    }

    async add({ userId, password }) {
      // add authsimple
      const authSimpleId = await this._addAuthSimple({ password });
      // update userId
      await this.ctx.model.authSimple.update({ id: authSimpleId, userId });

      // auth
      const providerItem = await this.ctx.meta.user.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: 'authsimple',
      });
      await this.ctx.model.auth.insert({
        userId,
        providerId: providerItem.id,
        profileId: authSimpleId,
        profile: JSON.stringify({
          authSimpleId,
          rememberMe: false,
        }),
      });
    }

    async verify({ userId, password }) {
      // check
      if (!password) return false;
      // authSimple
      const authSimple = await this.ctx.model.authSimple.get({
        userId,
      });
      if (!authSimple) return false;
      // verify
      const res = await this._verifyPassword({ password, hash: authSimple.hash });
      if (!res) return false;
      // ok
      return authSimple;
    }

    async passwordChange({ passwordOld, passwordNew, userId }) {
      // verify old
      const res = await this.verify({ userId, password: passwordOld });
      if (!res) this.ctx.throw(403);
      // save new
      await this._passwordSaveNew({ passwordNew, userId });
    }

    async _passwordSaveNew({ passwordNew, userId }) {
      // save new
      const auth = await this.ctx.model.authSimple.get({
        userId,
      });
      const hash = await this._calcPassword({ password: passwordNew });
      await this.ctx.model.authSimple.update({
        id: auth.id,
        hash,
      });
    }

    async passwordReset({ passwordNew, token }) {
      // token value
      const cacheKey = `passwordReset:${token}`;
      const value = await this.ctx.cache.db.get(cacheKey);
      if (!value) {
        // expired, send confirmation mail again
        //  1003: passwordResetEmailExpired
        this.ctx.throw(1003);
      }
      // userId
      const userId = value.userId;

      // save new
      await this._passwordSaveNew({ passwordNew, userId });
      // clear token
      await this.ctx.cache.db.remove(cacheKey);
      // login antomatically
      const user = await this.ctx.meta.user.get({ id: userId });
      const user2 = await this.signin({ auth: user.email, password: passwordNew, rememberMe: false });
      // ok
      return user2;
    }

    async passwordForgot({ email }) {
      // user by email
      const user = await this.ctx.meta.user.exists({ email });
      // link
      const token = uuid.v4().replace(/-/g, '');
      const link = this.ctx.meta.base.getAbsoluteUrl(`/#!/a/authsimple/passwordReset?token=${token}`);
      // email scene
      const scene = (app.meta.isTest || app.meta.isLocal) ? 'test' : 'system';
      // email subject
      let subject = this.ctx.text('passwordResetEmailSubject');
      subject = this.ctx.meta.util.replaceTemplate(subject, { siteName: this.ctx.instance.title });
      // email body
      let body = this.ctx.text('passwordResetEmailBody');
      body = this.ctx.meta.util.replaceTemplate(body, {
        userName: user.userName,
        link,
        siteName: this.ctx.instance.title,
      });
      // send
      await this.ctx.meta.mail.send({
        scene,
        message: {
          to: email,
          subject,
          text: body,
        },
      });
      // save
      await this.ctx.cache.db.set(
        `passwordReset:${token}`,
        { userId: user.id },
        this.ctx.config.passwordReset.timeout
      );
    }

    async emailConfirm({ email, user }) {
      // save email
      await this.ctx.meta.user.setActivated({
        user: { id: user.id, email, emailConfirmed: 0 },
      });
      // link
      const token = uuid.v4().replace(/-/g, '');
      const link = this.ctx.meta.base.getAbsoluteUrl(`/api/a/authsimple/auth/emailConfirmation?token=${token}`);
      // email scene
      const scene = (app.meta.isTest || app.meta.isLocal) ? 'test' : 'system';
      // email subject
      let subject = this.ctx.text('confirmationEmailSubject');
      subject = this.ctx.meta.util.replaceTemplate(subject, { siteName: this.ctx.instance.title });
      // email body
      let body = this.ctx.text('confirmationEmailBody');
      body = this.ctx.meta.util.replaceTemplate(body, {
        userName: user.userName,
        link,
        siteName: this.ctx.instance.title,
      });
      // send
      await this.ctx.meta.mail.send({
        scene,
        message: {
          to: email,
          subject,
          text: body,
        },
      });
      // save
      await this.ctx.cache.db.set(
        `emailConfirm:${token}`,
        { userId: user.id },
        this.ctx.config.confirmation.timeout
      );
    }

    // invoke by user clicking the link
    async emailConfirmation({ token }) {
      // token value
      const cacheKey = `emailConfirm:${token}`;
      const value = await this.ctx.cache.db.get(cacheKey);
      if (!value) {
        // expired, send confirmation mail again
        const data = {
          message: this.ctx.text('confirmationEmailExpired'),
          link: '/a/authsimple/emailConfirm',
          linkText: this.ctx.text('Resend confirmation email'),
        };
        const url = this.ctx.meta.base.getAlertUrl({ data });
        return this.ctx.redirect(url);
      }
      // userId
      const userId = value.userId;
      // activated
      await this.ctx.meta.user.setActivated({
        user: { id: userId, emailConfirmed: 1 },
      });
      // clear token
      await this.ctx.cache.db.remove(cacheKey);
      // not: login antomatically
      // ok
      const data = {
        message: this.ctx.text('confirmationEmailSucceeded'),
        link: '#back',
        linkText: this.ctx.text('Close'),
      };
      const url = this.ctx.meta.base.getAlertUrl({ data });
      return this.ctx.redirect(url);
    }

    async _calcPassword({ password }) {
      const _password = passwordFn(password.toString());
      const hashFn = util.promisify(_password.hash);
      return await hashFn.call(_password);
    }

    async _verifyPassword({ password, hash }) {
      const _password = passwordFn(password.toString());
      const verifyFn = util.promisify(_password.verifyAgainst);
      return await verifyFn.call(_password, hash);
    }

  }

  return Auth;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(10);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = __webpack_require__(11);

var iterations = 10000;
var password = function(password) {
	return {
		hash: function(salt, callback) {
			// Make salt optional
			if(callback === undefined && salt instanceof Function) {
				callback = salt;
				salt = undefined;
			}

			if(!password) {
				return callback('No password provided')
			}

			if(typeof salt === 'string') {
				salt = new Buffer(salt, 'hex');
			}

			var calcHash = function() {
				crypto.pbkdf2(password, salt, iterations, 64, 'sha1', function(err, key) {
					if(err)
						return callback(err);
					var res = 'pbkdf2$' + iterations + 
								'$' + key.toString('hex') + 
								'$' + salt.toString('hex');
					callback(null, res);
				})		
			};

			if(!salt) {
				crypto.randomBytes(64, function(err, gensalt) {
					if(err)
						return callback(err);
					salt = gensalt;
					calcHash();
				});		
			} else {
				calcHash();
			}			
		},

		verifyAgainst: function(hashedPassword, callback) {
			if(!hashedPassword || !password)
				return callback(null, false);

			var key = hashedPassword.split('$');
			if(key.length !== 4 || !key[2] || !key[3])
				return callback('Hash not formatted correctly');

			if(key[0] !== 'pbkdf2' || key[1] !== iterations.toString())
				return callback('Wrong algorithm and/or iterations');

			this.hash(key[3], function(error, newHash) {
				if(error)
					return callback(error);
				callback(null, newHash === hashedPassword);				
			});	
		}
	};
}


module.exports = password;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const auth = __webpack_require__(13);
const authSimple = __webpack_require__(14);

module.exports = {
  auth,
  authSimple,
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = app => {

  class Auth extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAuth', options: { disableDeleted: true } });
    }

  }

  return Auth;
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {

  class AuthSimple extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAuthSimple', options: { disableDeleted: true } });
    }

  }

  return AuthSimple;
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {
  };

  // defaultPassword
  config.defaultPassword = '123456';

  // confirmation
  config.confirmation = {
    timeout: 2 * 24 * 60 * 60 * 1000, // 2 days
  };

  // passwordReset
  config.passwordReset = {
    timeout: 30 * 60 * 1000, // 30 minutes
  };

  return config;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'en-us': __webpack_require__(17),
  'zh-cn': __webpack_require__(18),
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

// confirmationEmail
//   subject
const confirmationEmailSubject = '{{siteName}} Account Confirmation';
//   body
const confirmationEmailBody =
`
Hi {{userName}},

Welcome to join us. Please click this link to confirm your email:

{{link}}

Regards,
{{siteName}} Team
`;

// passwordResetEmail
//   subject
const passwordResetEmailSubject = 'Password Reset for {{siteName}}';
//   body
const passwordResetEmailBody =
`
Hi {{userName}},

To reset your password, visit the following address:

{{link}}

Regards,
{{siteName}} Team
`;

//
module.exports = {
  confirmationEmailExpired: 'This email confirmation link has expired',
  confirmationEmailSucceeded: 'Your email address has been confirmed',
  confirmationEmailSubject,
  confirmationEmailBody,
  passwordResetEmailExpired: 'This password reset link has expired',
  passwordResetEmailSubject,
  passwordResetEmailBody,
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

// confirmationEmail
//   subject
const confirmationEmailSubject = '{{siteName}} 账号确认';
//   body
const confirmationEmailBody =
`
您好，{{userName}}，

欢迎加入我们。请点击以下链接验证您的邮件：

{{link}}

此致，
{{siteName}} 团队
`;

// passwordResetEmail
//   subject
const passwordResetEmailSubject = '{{siteName}}重置密码';
//   body
const passwordResetEmailBody =
`
您好，{{userName}}，

请点击以下链接重置密码：

{{link}}

此致，
{{siteName}} 团队
`;

module.exports = {
  Close: '关闭',
  'Authentication failed': '认证失败',
  'User is disabled': '用户被禁用',
  'Auth-Simple': '认证-简单',
  'Reset password': '重置密码',
  'Element exists': '元素已存在',
  'Cannot contain __': '不能包含__',
  'Resend confirmation email': '重新发送确认邮件',
  'Email address does not exist': '邮件地址不存在',
  confirmationEmailExpired: '确认邮件链接已经过期',
  confirmationEmailSucceeded: '您的邮件地址已经确认',
  confirmationEmailSubject,
  confirmationEmailBody,
  passwordResetEmailExpired: '重置密码链接已经过期',
  passwordResetEmailSubject,
  passwordResetEmailBody,
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'Authentication failed',
  1002: 'User is disabled',
  1003: 'passwordResetEmailExpired',
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  // auth
  const auth = __webpack_require__(21)(app);
  // keywords
  const keywords = __webpack_require__(25)(app);
  // schemas
  const schemas = __webpack_require__(26)(app);
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
        passwordChange: {
          schemas: 'passwordChange',
        },
        passwordForgot: {
          schemas: 'passwordForgot',
        },
        passwordReset: {
          schemas: 'passwordReset',
        },
        emailConfirm: {
          schemas: 'emailConfirm',
        },
      },
      keywords: {
        'x-exists': keywords.exists,
        'x-passwordForgotEmail': keywords.passwordForgotEmail,
      },
      schemas: {
        signup: schemas.signup,
        signin: schemas.signin,
        passwordChange: schemas.passwordChange,
        passwordForgot: schemas.passwordForgot,
        passwordReset: schemas.passwordReset,
        emailConfirm: schemas.emailConfirm,
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
    const { auth, password, rememberMe } = body;
    // validate
    await ctx.meta.validation.validate({ validator: 'signin', data: body });
    // exists
    const user = await ctx.meta.user.exists({ userName: auth, email: auth, mobile: auth });
    if (!user) return ctx.throw(1001);
    // disabled
    if (user.disabled) return ctx.throw(1002);
    // verify
    const authSimple = await ctx.service.auth.verify({ userId: user.id, password });
    if (!authSimple) return ctx.throw(1001);
    return {
      module: moduleInfo.relativeName,
      provider,
      profileId: authSimple.id,
      maxAge: rememberMe ? null : 0,
      profile: {
        authSimpleId: authSimple.id,
        rememberMe,
      },
    };
  }
  return {
    providers: {
      [provider]: {
        config: {
          successReturnToOrRedirect: false,
          successRedirect: false,
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
const util = __webpack_require__(0);

function Strategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError('LocalStrategy requires a verify callback'); }

  passport.Strategy.call(this);
  this.name = 'simple';
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
      let url = '/#!/a/authsimple/signup?state=associate';
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
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(1);
const Ajv = require3('ajv');

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
          const errors = [{ keyword: 'x-exists', params: [], message: ctx.text('Element exists') }];
          throw new Ajv.ValidationError(errors);
        }
        if (!res && data.indexOf('__') > -1) {
          const errors = [{ keyword: 'x-exists', params: [], message: ctx.text('Cannot contain __') }];
          throw new Ajv.ValidationError(errors);
        }
        return true;
      };
    },
  };
  keywords.passwordForgotEmail = {
    async: true,
    type: 'string',
    errors: true,
    compile() {
      return async function(data, path, rootData, name) {
        const ctx = this;
        const res = await ctx.meta.user.exists({ [name]: data });
        if (!res) {
          const errors = [{ keyword: 'x-passwordForgotEmail', params: [], message: ctx.text('Email address does not exist') }];
          throw new Ajv.ValidationError(errors);
        }
        return true;
      };
    },
  };
  return keywords;
};


/***/ }),
/* 26 */
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
      email: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Email',
        notEmpty: true,
        format: 'email',
        'x-exists': true,
      },
      // mobile: {
      //   type: 'string',
      //   ebType: 'text',
      //   ebTitle: 'Mobile',
      //   notEmpty: true,
      //   'x-exists': true,
      // },
      password: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Password',
        ebSecure: true,
        notEmpty: true,
        minLength: 6,
      },
      passwordAgain: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Password again',
        ebSecure: true,
        notEmpty: true,
        const: { $data: '1/password' },
      },
    },
  };
  schemas.signin = {
    type: 'object',
    properties: {
      auth: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Your mobile/email',
        notEmpty: true,
      },
      password: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Your password',
        ebSecure: true,
        notEmpty: true,
        minLength: 6,
      },
      rememberMe: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Remember me',
      },
    },
  };
  schemas.passwordChange = {
    type: 'object',
    properties: {
      passwordOld: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Old password',
        ebSecure: true,
        notEmpty: true,
        minLength: 6,
      },
      passwordNew: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'New password',
        ebSecure: true,
        notEmpty: true,
        minLength: 6,
      },
      passwordNewAgain: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'New password again',
        ebSecure: true,
        notEmpty: true,
        const: { $data: '1/passwordNew' },
      },
    },
  };
  schemas.emailConfirm = {
    type: 'object',
    properties: {
      userName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        ebReadOnly: true,
      },
      email: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Email',
        notEmpty: true,
        format: 'email',
        'x-exists': true,
      },
    },
  };
  schemas.passwordForgot = {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Email',
        notEmpty: true,
        format: 'email',
        'x-passwordForgotEmail': true,
      },
    },
  };
  schemas.passwordReset = {
    type: 'object',
    properties: {
      passwordNew: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'New password',
        ebSecure: true,
        notEmpty: true,
        minLength: 6,
      },
      passwordNewAgain: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'New password again',
        ebSecure: true,
        notEmpty: true,
        const: { $data: '1/passwordNew' },
      },
    },
  };
  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map