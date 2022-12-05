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

/***/ 907:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(933);

/***/ }),

/***/ 933:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var crypto = __webpack_require__(113);

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

/***/ 71:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Strategy = __webpack_require__(966);

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Provider extends ctx.app.meta.IAuthProviderBase(ctx) {
    get localSimple() {
      return ctx.bean.local.module(moduleInfo.relativeName).simple;
    }
    async getConfigDefault() {
      return null;
    }
    checkConfigValid(/* config*/) {
      return true;
    }
    getStrategy() {
      return Strategy;
    }
    async onVerify(body) {
      const { auth, password, rememberMe } = body.data;
      // validate
      await ctx.bean.validation.validate({ module: moduleInfo.relativeName, validator: 'signin', data: body.data });
      // exists
      const user = await ctx.bean.user.exists({ userName: auth, email: auth, mobile: auth });
      if (!user) return ctx.throw.module(moduleInfo.relativeName, 1001);
      // disabled
      if (user.disabled) return ctx.throw.module(moduleInfo.relativeName, 1002);
      // verify
      const authSimple = await this.localSimple.verify({ userId: user.id, password });
      if (!authSimple) return ctx.throw.module(moduleInfo.relativeName, 1001);
      return {
        module: this.providerModule,
        provider: this.providerName,
        providerScene: this.providerScene,
        profileId: authSimple.id,
        maxAge: rememberMe ? null : 0,
        authShouldExists: true,
        profile: {
          authSimpleId: authSimple.id,
          rememberMe,
        },
      };
    }
  }

  return Provider;
};


/***/ }),

/***/ 454:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const uuid = require3('uuid');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  class AuthSimple {
    get modelAuthSimple() {
      return ctx.model.module(moduleInfo.relativeName).authSimple;
    }
    get modelAuth() {
      return ctx.model.module('a-base').auth;
    }
    get localSimple() {
      return ctx.bean.local.module(moduleInfo.relativeName).simple;
    }
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    get cacheDb() {
      return ctx.cache.db.module(moduleInfo.relativeName);
    }

    // mobile: not use
    async signup({ user, state = 'login', userName, realName, email, /* mobile,*/ password }) {
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
      const verifyUser = await ctx.bean.user.verify({ state, profileUser });
      if (!verifyUser) ctx.throw(403);

      // userId
      const userId = verifyUser.agent.id;
      // remove old records
      await this.modelAuthSimple.delete({ userId });
      // update userId
      await this.modelAuthSimple.update({ id: authSimpleId, userId });

      // override user's info: userName/realName/email
      const userNew = { id: userId, realName };
      if (state === 'login' || !user.userName || user.userName.indexOf('__') > -1) {
        userNew.userName = userName;
      }
      await ctx.bean.user.save({
        user: userNew,
      });
      // save email
      if (email !== verifyUser.agent.email) {
        await ctx.bean.user.setActivated({
          user: { id: userId, email, emailConfirmed: 0 },
        });
      }

      // login now
      //   always no matter login/associate
      await ctx.login(verifyUser);

      // ok
      return verifyUser;
    }

    // data: { auth, password, rememberMe }
    async signin({ data, state = 'login' }) {
      const res = await ctx.bean.authProvider.authenticateDirect({
        module: moduleInfo.relativeName,
        providerName: 'authsimple',
        query: { state },
        body: { data },
      });
      // const res = await ctx.meta.util.performAction({
      //   method: 'post',
      //   url: `/a/auth/passport/a-authsimple/authsimple?state=${state}`,
      //   body: { data },
      // });
      return res;
    }

    async _addAuthSimple({ password }) {
      // hash
      password = password || this.configModule.defaultPassword;
      const hash = await this.localSimple.calcPassword({ password });
      // auth simple
      const res = await this.modelAuthSimple.insert({
        userId: 0,
        hash,
      });
      return res.insertId;
    }

    async add({ userId, password }) {
      // add authsimple
      const authSimpleId = await this._addAuthSimple({ password });
      // update userId
      await this.modelAuthSimple.update({ id: authSimpleId, userId });

      // auth
      const providerItem = await ctx.bean.authProvider.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: 'authsimple',
      });
      await this.modelAuth.insert({
        userId,
        providerId: providerItem.id,
        profileId: authSimpleId,
        profile: JSON.stringify({
          authSimpleId,
          rememberMe: false,
        }),
      });
      return authSimpleId;
    }

    async passwordChange({ passwordOld, passwordNew, userId }) {
      let authSimpleId;
      // check if exists
      const authSimple = await this.modelAuthSimple.get({ userId });
      if (!authSimple) {
        // create a new one
        authSimpleId = await this.add({ userId, password: passwordNew });
      } else {
        // verify old one
        const authSimple = await this.localSimple.verify({ userId, password: passwordOld });
        if (!authSimple) ctx.throw(403);
        authSimpleId = authSimple.id;
      }

      // save new
      await this._passwordSaveNew({ passwordNew, userId });

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
      const verifyUser = await ctx.bean.user.verify({ state: 'associate', profileUser });
      if (!verifyUser) ctx.throw(403);

      // force kickout all login records
      await ctx.bean.userOnline.kickOut({ user: { id: userId } });

      // login now
      //   always no matter login/associate
      // await ctx.login(verifyUser);
    }

    async _passwordSaveNew({ passwordNew, userId }) {
      // save new
      const auth = await this.modelAuthSimple.get({
        userId,
      });
      const hash = await this.localSimple.calcPassword({ password: passwordNew });
      await this.modelAuthSimple.update({
        id: auth.id,
        hash,
      });
    }

    async passwordReset({ passwordNew, token }) {
      // token value
      const cacheKey = `passwordReset:${token}`;
      const value = await this.cacheDb.get(cacheKey);
      if (!value) {
        // expired, send confirmation mail again
        //  1003: passwordResetEmailExpired
        ctx.throw(1003);
      }
      // userId
      const userId = value.userId;

      // save new
      await this._passwordSaveNew({ passwordNew, userId });
      // clear token
      await this.cacheDb.remove(cacheKey);
      // login antomatically
      const user = await ctx.bean.user.get({ id: userId });
      const data = { auth: user.email, password: passwordNew, rememberMe: false };
      const user2 = await this.signin({ data, state: 'login' });
      // ok
      return user2;
    }

    async passwordForgot({ email }) {
      // user by email
      const user = await ctx.bean.user.exists({ email });
      // link
      const token = uuid.v4().replace(/-/g, '');
      const link = ctx.bean.base.getAbsoluteUrl(`/#!/a/authsimple/passwordReset?token=${token}`);
      // config
      const configTemplate = this.configModule.email.templates.passwordReset;
      // email subject
      let subject = ctx.text(configTemplate.subject);
      subject = ctx.bean.util.replaceTemplate(subject, { siteName: ctx.instance.title });
      // email body
      let body = ctx.text(configTemplate.body);
      body = ctx.bean.util.replaceTemplate(body, {
        userName: user.userName,
        link,
        siteName: ctx.instance.title,
      });
      // send
      await ctx.bean.mail.send({
        scene: null, // use default
        message: {
          to: email,
          subject,
          text: body,
        },
      });
      // save
      await this.cacheDb.set(`passwordReset:${token}`, { userId: user.id }, this.configModule.passwordReset.timeout);
    }

    async emailConfirm({ email, user }) {
      // save email
      await ctx.bean.user.setActivated({
        user: { id: user.id, email, emailConfirmed: 0 },
      });
      // link
      const token = uuid.v4().replace(/-/g, '');
      const link = ctx.bean.base.getAbsoluteUrl(`/api/a/authsimple/auth/emailConfirmation?token=${token}`);
      // config
      const configTemplate = this.configModule.email.templates.confirmation;
      // email subject
      let subject = ctx.text(configTemplate.subject);
      subject = ctx.bean.util.replaceTemplate(subject, { siteName: ctx.instance.title });
      // email body
      let body = ctx.text(configTemplate.body);
      body = ctx.bean.util.replaceTemplate(body, {
        userName: user.userName,
        link,
        siteName: ctx.instance.title,
      });
      // send
      await ctx.bean.mail.send({
        scene: null, // use default
        message: {
          to: email,
          subject,
          text: body,
        },
      });
      // save
      await this.cacheDb.set(`emailConfirm:${token}`, { userId: user.id }, this.configModule.confirmation.timeout);
    }

    // invoke by user clicking the link
    async emailConfirmation({ token }) {
      // token value
      const cacheKey = `emailConfirm:${token}`;
      const value = await this.cacheDb.get(cacheKey);
      if (!value) {
        // expired, send confirmation mail again
        const data = {
          message: ctx.text('confirmationEmailExpired'),
          link: '/a/authsimple/emailConfirm',
          linkText: ctx.text('Resend Confirmation Email'),
        };
        const url = ctx.bean.base.getAlertUrl({ data });
        return ctx.redirect(url);
      }
      // userId
      const userId = value.userId;
      // activated
      await ctx.bean.user.setActivated({
        user: { id: userId, emailConfirmed: 1 },
      });
      // clear token
      await this.cacheDb.remove(cacheKey);
      // not: login antomatically
      // ok
      const data = {
        message: ctx.text('confirmationEmailSucceeded'),
        link: '#back',
        linkText: ctx.text('Close'),
      };
      const url = ctx.bean.base.getAlertUrl({ data });
      return ctx.redirect(url);
    }

    async checkStatus({ user }) {
      // check if exists
      const auth = await this.modelAuthSimple.get({
        userId: user.id,
      });
      return {
        exists: !!auth,
      };
    }
  }
  return AuthSimple;
};


/***/ }),

/***/ 836:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {
    async execute(context, next) {
      const data = context.data;
      const modelAuthSimple = ctx.model.module(moduleInfo.relativeName).authSimple;
      // check userIdFrom
      const authSimple = await modelAuthSimple.get({ userId: data.userIdFrom });
      if (authSimple) {
        // delete old record
        await ctx.model.query('delete from aAuthSimple where deleted=0 and iid=? and userId=?', [
          ctx.instance.id,
          data.userIdTo,
        ]);
        // update
        await ctx.model.query('update aAuthSimple a set a.userId=? where a.deleted=0 and a.iid=? and a.userId=?', [
          data.userIdTo,
          ctx.instance.id,
          data.userIdFrom,
        ]);
      }
      // next
      await next();
    }
  }

  return eventBean;
};


/***/ }),

/***/ 988:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const util = __webpack_require__(837);
const passwordFn = __webpack_require__(907); // should compile

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Simple {
    get modelAuthSimple() {
      return ctx.model.module(moduleInfo.relativeName).authSimple;
    }

    async verify({ userId, password }) {
      // check
      if (!password) return false;
      // authSimple
      const authSimple = await this.modelAuthSimple.get({
        userId,
      });
      if (!authSimple) return false;
      // verify
      const res = await this.verifyPassword({ password, hash: authSimple.hash });
      if (!res) return false;
      // ok
      return authSimple;
    }

    async verifyPassword({ password, hash }) {
      const _password = passwordFn(password.toString());
      const verifyFn = util.promisify(_password.verifyAgainst);
      return await verifyFn.call(_password, hash);
    }

    async calcPassword({ password }) {
      const _password = passwordFn(password.toString());
      const hashFn = util.promisify(_password.hash);
      return await hashFn.call(_password);
    }
  }
  return Simple;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
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
        const userRoot = await this.ctx.bean.user.get({ userName: 'root' });
        await this.ctx.bean.authSimple.add({
          userId: userRoot.id,
          password: options.password,
        });
        // admin
        const userAdmin = await this.ctx.bean.user.get({ userName: 'admin' });
        if (userAdmin) {
          await this.ctx.bean.authSimple.add({
            userId: userAdmin.id,
            password: '123456',
          });
        }
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
const eventAccountMigration = __webpack_require__(836);
const authProviderSimple = __webpack_require__(71);
const localSimple = __webpack_require__(988);
const beanAuthSimple = __webpack_require__(454);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // event
    'event.accountMigration': {
      mode: 'ctx',
      bean: eventAccountMigration,
    },
    // auth.provider
    'auth.provider.simple': {
      mode: 'ctx',
      bean: authProviderSimple,
    },
    // local
    'local.simple': {
      mode: 'ctx',
      bean: localSimple,
    },
    // global
    authSimple: {
      mode: 'ctx',
      bean: beanAuthSimple,
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

  // account
  config.account = {
    url: {
      emailConfirm: '/a/authsimple/emailConfirm',
      passwordChange: '/a/authsimple/passwordChange',
      passwordForgot: '/a/authsimple/passwordForgot',
      passwordReset: '/a/authsimple/passwordReset',
    },
  };

  // captcha scenes
  config.captcha = {
    scenes: {
      passwordChange: null,
      signup: null,
      signin: null, // means using default
      // signin: {
      //   module: 'a-captchasimple',
      //   name: 'captcha',
      // },
    },
  };

  // email
  config.email = {
    templates: {
      confirmation: {
        subject: 'confirmationEmailSubject',
        body: 'confirmationEmailBody',
      },
      passwordReset: {
        subject: 'passwordResetEmailSubject',
        body: 'passwordResetEmailBody',
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
  1001: 'Authentication Failed',
  1002: 'User is Disabled',
  1003: 'passwordResetEmailExpired',
};


/***/ }),

/***/ 327:
/***/ ((module) => {

// confirmationEmail
//   subject
const confirmationEmailSubject = '[{{siteName}}] Account Confirmation';
//   body
const confirmationEmailBody = `
Hi {{userName}},

Welcome to join us. Please click this link to confirm your email:

{{link}}

Regards,
{{siteName}} Team
`;

// passwordResetEmail
//   subject
const passwordResetEmailSubject = '[{{siteName}}] Password Reset';
//   body
const passwordResetEmailBody = `
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

/***/ 72:
/***/ ((module) => {

// confirmationEmail
//   subject
const confirmationEmailSubject = '[{{siteName}}] 账号确认';
//   body
const confirmationEmailBody = `
您好，{{userName}}，

欢迎加入我们。请点击以下链接验证您的邮件：

{{link}}

此致，
{{siteName}} 团队
`;

// passwordResetEmail
//   subject
const passwordResetEmailSubject = '[{{siteName}}] 重置密码';
//   body
const passwordResetEmailBody = `
您好，{{userName}}，

请点击以下链接重置密码：

{{link}}

此致，
{{siteName}} 团队
`;

module.exports = {
  Close: '关闭',
  'User/Password': '用户/密码',
  'Authentication Failed': '认证失败',
  'User is Disabled': '用户被禁用',
  'Auth-Simple': '认证-简单',
  'Reset Password': '重置密码',
  'Element Exists': '元素已存在',
  'Cannot Contain __': '不能包含__',
  'Resend Confirmation Email': '重新发送确认邮件',
  'Email Address does not Exist': '邮件地址不存在',
  confirmationEmailExpired: '确认邮件链接已经过期',
  confirmationEmailSucceeded: '您的邮件地址已经确认',
  confirmationEmailSubject,
  confirmationEmailBody,
  passwordResetEmailExpired: '重置密码链接已经过期',
  passwordResetEmailSubject,
  passwordResetEmailBody,
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
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const provider = moduleInfo.name;
  return {
    providers: {
      [provider]: {
        meta: {
          title: 'User/Password',
          inline: true,
          mode: 'direct',
          bean: 'simple',
          render: 'blockSignin',
          icon: { f7: ':auth:password' },
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
  this.name = 'simple';
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
  const ctx = req.ctx;

  // check
  if (req.method === 'GET') {
    // not allow
    return self.error(ctx.parseFail(403));
  }

  // verified
  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    ctx.success(user);
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
  keywords.passwordForgotEmail = {
    async: true,
    type: 'string',
    errors: true,
    compile() {
      return async function (data, path, rootData, name) {
        const ctx = this;
        const res = await ctx.bean.user.exists({ [name]: data });
        if (!res) {
          const errors = [
            { keyword: 'x-passwordForgotEmail', params: [], message: ctx.text('Email Address does not Exist') },
          ];
          throw new app.meta.ajv.ValidationError(errors);
        }
        return true;
      };
    },
  };
  return keywords;
};


/***/ }),

/***/ 615:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
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
  return schemas;
};


/***/ }),

/***/ 910:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  schemas.passwordChange = {
    type: 'object',
    properties: {
      passwordOld: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Old Password',
        ebParams: {
          secure: true,
        },
        notEmpty: true,
        minLength: 6,
      },
      passwordNew: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'New Password',
        ebParams: {
          secure: true,
        },
        notEmpty: true,
        minLength: 6,
      },
      passwordNewAgain: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'New Password Again',
        ebParams: {
          secure: true,
        },
        notEmpty: true,
        const: { $data: '1/passwordNew' },
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 608:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
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
  return schemas;
};


/***/ }),

/***/ 490:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  schemas.passwordReset = {
    type: 'object',
    properties: {
      passwordNew: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'New Password',
        ebParams: {
          secure: true,
        },
        notEmpty: true,
        minLength: 6,
      },
      passwordNewAgain: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'New Password Again',
        ebParams: {
          secure: true,
        },
        notEmpty: true,
        const: { $data: '1/passwordNew' },
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 13:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  schemas.signin = {
    type: 'object',
    properties: {
      auth: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Your Username/Mobile/Email',
        notEmpty: true,
      },
      password: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Your Password',
        ebParams: {
          secure: true,
        },
        notEmpty: true,
        minLength: 6,
      },
      rememberMe: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Remember Me',
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 516:
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
        ebParams: {
          secure: true,
        },
        notEmpty: true,
        minLength: 6,
      },
      passwordAgain: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Password Again',
        ebParams: {
          secure: true,
        },
        notEmpty: true,
        const: { $data: '1/password' },
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const emailConfirm = __webpack_require__(615);
const passwordChange = __webpack_require__(910);
const passwordForgot = __webpack_require__(608);
const passwordReset = __webpack_require__(490);
const signin = __webpack_require__(13);
const signup = __webpack_require__(516);

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, emailConfirm(app));
  Object.assign(schemas, passwordChange(app));
  Object.assign(schemas, passwordForgot(app));
  Object.assign(schemas, passwordReset(app));
  Object.assign(schemas, signin(app));
  Object.assign(schemas, signup(app));
  // ok
  return schemas;
};


/***/ }),

/***/ 523:
/***/ ((module) => {

module.exports = app => {
  class AuthController extends app.Controller {
    async signin() {
      // data: { auth, password, rememberMe }
      const data = this.ctx.request.body.data;
      const state = this.ctx.request.body.state;
      const res = await this.service.auth.signin({ data, state });
      this.ctx.success(res);
    }

    async signup() {
      const { userName, realName, email, mobile, password } = this.ctx.request.body.data;
      const state = this.ctx.request.body.state;
      const res = await this.service.auth.signup({
        user: this.ctx.state.user.agent,
        state,
        userName,
        realName,
        email,
        mobile,
        password,
      });
      this.ctx.success(res);
    }

    async passwordChange() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const { passwordOld, passwordNew } = this.ctx.request.body.data;
      await this.service.auth.passwordChange({ passwordOld, passwordNew, userId: this.ctx.state.user.agent.id });
      this.ctx.success();
    }

    async passwordForgot() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const { email } = this.ctx.request.body.data;
      await this.service.auth.passwordForgot({ email });
      this.ctx.success();
    }

    async passwordReset() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const { passwordNew } = this.ctx.request.body.data;
      const token = this.ctx.request.body.token;
      await this.service.auth.passwordReset({ passwordNew, token });
      this.ctx.success();
    }

    async emailConfirm() {
      const { email } = this.ctx.request.body.data;
      await this.service.auth.emailConfirm({ email, user: this.ctx.state.user.agent });
      this.ctx.success();
    }

    async emailConfirmation() {
      const token = this.ctx.request.query.token;
      await this.service.auth.emailConfirmation({ token });
      // this.ctx.success();
    }

    async checkStatus() {
      const res = await this.service.auth.checkStatus({ user: this.ctx.state.user.agent });
      this.ctx.success(res);
    }
  }
  return AuthController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const auth = __webpack_require__(523);

module.exports = app => {
  const controllers = {
    auth,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const routes = __webpack_require__(825);
const services = __webpack_require__(214);
const models = __webpack_require__(230);
const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);
const metaFn = __webpack_require__(458);

module.exports = app => {
  // beans
  const beans = __webpack_require__(187)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  return {
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta: metaFn(app),
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
    event: {
      implementations: {
        'a-base:accountMigration': 'accountMigration',
      },
    },
  };
};


/***/ }),

/***/ 496:
/***/ ((module) => {

module.exports = app => {
  class AuthSimple extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aAuthSimple', options: { disableDeleted: true } });
    }
  }

  return AuthSimple;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const authSimple = __webpack_require__(496);

module.exports = {
  authSimple,
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = [
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
      captchaVerify: { scene: { name: 'signup' } },
      validate: { validator: 'signup' },
    },
  },
  {
    method: 'post',
    path: 'auth/passwordChange',
    controller: 'auth',
    middlewares: 'captchaVerify,validate',
    meta: {
      captchaVerify: { scene: { name: 'passwordChange' } },
      validate: { validator: 'passwordChange' },
    },
  },
  {
    method: 'post',
    path: 'auth/passwordForgot',
    controller: 'auth',
    middlewares: 'validate',
    meta: { validate: { validator: 'passwordForgot' } },
  },
  {
    method: 'post',
    path: 'auth/passwordReset',
    controller: 'auth',
    middlewares: 'validate',
    meta: { validate: { validator: 'passwordReset' } },
  },
  {
    method: 'post',
    path: 'auth/emailConfirm',
    controller: 'auth',
    middlewares: 'validate',
    meta: { validate: { validator: 'emailConfirm' } },
  },
  { method: 'get', path: 'auth/emailConfirmation', controller: 'auth' },
  { method: 'post', path: 'auth/checkStatus', controller: 'auth', meta: { auth: { user: true } } },
];


/***/ }),

/***/ 300:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Auth extends app.Service {
    // mobile: not use
    async signup({ user, state = 'login', userName, realName, email, /* mobile,*/ password }) {
      return await this.ctx.bean.authSimple.signup({ user, state, userName, realName, email, /* mobile,*/ password });
    }

    // data: { auth, password, rememberMe }
    async signin({ data, state = 'login' }) {
      return await this.ctx.bean.authSimple.signin({ data, state });
    }

    async add({ userId, password }) {
      return await this.ctx.bean.authSimple.add({ userId, password });
    }

    async passwordChange({ passwordOld, passwordNew, userId }) {
      return await this.ctx.bean.authSimple.passwordChange({ passwordOld, passwordNew, userId });
    }

    async passwordReset({ passwordNew, token }) {
      return await this.ctx.bean.authSimple.passwordReset({ passwordNew, token });
    }

    async passwordForgot({ email }) {
      return await this.ctx.bean.authSimple.passwordForgot({ email });
    }

    async emailConfirm({ email, user }) {
      return await this.ctx.bean.authSimple.emailConfirm({ email, user });
    }

    // invoke by user clicking the link
    async emailConfirmation({ token }) {
      return await this.ctx.bean.authSimple.emailConfirmation({ token });
    }

    async checkStatus({ user }) {
      return await this.ctx.bean.authSimple.checkStatus({ user });
    }
  }

  return Auth;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const auth = __webpack_require__(300);
module.exports = {
  auth,
};


/***/ }),

/***/ 638:
/***/ ((module) => {

"use strict";
module.exports = require("require3");

/***/ }),

/***/ 113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

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