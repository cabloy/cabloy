module.exports =
/** ****/ (function(modules) { // webpackBootstrap
    /** ****/ 	// The module cache
    /** ****/ 	const installedModules = {};
    /** ****/
    /** ****/ 	// The require function
    /** ****/ 	function __webpack_require__(moduleId) {
      /** ****/
      /** ****/ 		// Check if module is in cache
      /** ****/ 		if (installedModules[moduleId]) {
        /** ****/ 			return installedModules[moduleId].exports;
        /** ****/ 		}
      /** ****/ 		// Create a new module (and put it into the cache)
      /** ****/ 		const module = installedModules[moduleId] = {
        /** ****/ 			i: moduleId,
        /** ****/ 			l: false,
        /** ****/ 			exports: {},
        /** ****/ 		};
      /** ****/
      /** ****/ 		// Execute the module function
      /** ****/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /** ****/
      /** ****/ 		// Flag the module as loaded
      /** ****/ 		module.l = true;
      /** ****/
      /** ****/ 		// Return the exports of the module
      /** ****/ 		return module.exports;
      /** ****/ 	}
    /** ****/
    /** ****/
    /** ****/ 	// expose the modules object (__webpack_modules__)
    /** ****/ 	__webpack_require__.m = modules;
    /** ****/
    /** ****/ 	// expose the module cache
    /** ****/ 	__webpack_require__.c = installedModules;
    /** ****/
    /** ****/ 	// define getter function for harmony exports
    /** ****/ 	__webpack_require__.d = function(exports, name, getter) {
      /** ****/ 		if (!__webpack_require__.o(exports, name)) {
        /** ****/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
        /** ****/ 		}
      /** ****/ 	};
    /** ****/
    /** ****/ 	// define __esModule on exports
    /** ****/ 	__webpack_require__.r = function(exports) {
      /** ****/ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /** ****/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        /** ****/ 		}
      /** ****/ 		Object.defineProperty(exports, '__esModule', { value: true });
      /** ****/ 	};
    /** ****/
    /** ****/ 	// create a fake namespace object
    /** ****/ 	// mode & 1: value is a module id, require it
    /** ****/ 	// mode & 2: merge all properties of value into the ns
    /** ****/ 	// mode & 4: return value when already ns object
    /** ****/ 	// mode & 8|1: behave like require
    /** ****/ 	__webpack_require__.t = function(value, mode) {
      /** ****/ 		if (mode & 1) value = __webpack_require__(value);
      /** ****/ 		if (mode & 8) return value;
      /** ****/ 		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
      /** ****/ 		const ns = Object.create(null);
      /** ****/ 		__webpack_require__.r(ns);
      /** ****/ 		Object.defineProperty(ns, 'default', { enumerable: true, value });
      /** ****/ 		if (mode & 2 && typeof value !== 'string') for (const key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
      /** ****/ 		return ns;
      /** ****/ 	};
    /** ****/
    /** ****/ 	// getDefaultExport function for compatibility with non-harmony modules
    /** ****/ 	__webpack_require__.n = function(module) {
      /** ****/ 		const getter = module && module.__esModule ?
      /** ****/ 			function getDefault() { return module.default; } :
      /** ****/ 			function getModuleExports() { return module; };
      /** ****/ 		__webpack_require__.d(getter, 'a', getter);
      /** ****/ 		return getter;
      /** ****/ 	};
    /** ****/
    /** ****/ 	// Object.prototype.hasOwnProperty.call
    /** ****/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    /** ****/
    /** ****/ 	// __webpack_public_path__
    /** ****/ 	__webpack_require__.p = '';
    /** ****/
    /** ****/
    /** ****/ 	// Load entry module and return exports
    /** ****/ 	return __webpack_require__(__webpack_require__.s = 1);
    /** ****/ })([
    /* 0 */
    /***/ function(module, exports) {

      module.exports = require('util');

      /***/ },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {

      const routes = __webpack_require__(2);
      const services = __webpack_require__(5);
      const models = __webpack_require__(12);
      const config = __webpack_require__(14);
      const locales = __webpack_require__(15);
      const errors = __webpack_require__(18);
      const metaFn = __webpack_require__(19);

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


      /***/ },
    /* 2 */
    /***/ function(module, exports, __webpack_require__) {

      const version = __webpack_require__(3);
      const auth = __webpack_require__(4);

      module.exports = [
        { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
        { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
        { method: 'post', path: 'version/test', controller: 'version', middlewares: 'test' },
        { method: 'post', path: 'auth/add', controller: 'auth', middlewares: 'inner', meta: { auth: { enable: false } } },
        { method: 'post', path: 'auth/signin', controller: 'auth', middlewares: 'captchaVerify',
          meta: {
            captchaVerify: { scene: { name: 'signin' } },
          },
        },
        { method: 'post', path: 'auth/signup', controller: 'auth', middlewares: 'captchaVerify,validate',
          meta: {
            captchaVerify: { scene: { name: 'signup' } },
            validate: { validator: 'signup' },
          },
        },
        { method: 'post', path: 'auth/passwordChange', controller: 'auth', middlewares: 'captchaVerify,validate',
          meta: {
            captchaVerify: { scene: { name: 'passwordChange' } },
            validate: { validator: 'passwordChange' },
          },
        },
        { method: 'post', path: 'auth/passwordForgot', controller: 'auth', middlewares: 'validate,mail',
          meta: { validate: { validator: 'passwordForgot' } },
        },
        { method: 'post', path: 'auth/passwordReset', controller: 'auth', middlewares: 'validate',
          meta: { validate: { validator: 'passwordReset' } },
        },
        { method: 'post', path: 'auth/emailConfirm', controller: 'auth', middlewares: 'validate,mail',
          meta: { validate: { validator: 'emailConfirm' } },
        },
        { method: 'get', path: 'auth/emailConfirmation', controller: 'auth' },

      ];


      /***/ },
    /* 3 */
    /***/ function(module, exports) {

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


      /***/ },
    /* 4 */
    /***/ function(module, exports) {

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
              user: this.ctx.state.user.agent,
              state,
              userName, realName, email, mobile, password,
            });
            this.ctx.success(res);
          }

          async passwordChange() {
            const { passwordOld, passwordNew } = this.ctx.request.body.data;
            await this.service.auth.passwordChange({ passwordOld, passwordNew, userId: this.ctx.state.user.agent.id });
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
            await this.service.auth.emailConfirm({ email, user: this.ctx.state.user.agent });
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


      /***/ },
    /* 5 */
    /***/ function(module, exports, __webpack_require__) {

      const version = __webpack_require__(6);
      const auth = __webpack_require__(7);
      module.exports = {
        version,
        auth,
      };


      /***/ },
    /* 6 */
    /***/ function(module, exports) {

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
              const user = await this.ctx.bean.user.get({ userName: 'root' });
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


      /***/ },
    /* 7 */
    /***/ function(module, exports, __webpack_require__) {

      const util = __webpack_require__(0);
      const passwordFn = __webpack_require__(8); // should compile
      const require3 = __webpack_require__(11);
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
            const verifyUser = await this.ctx.bean.user.verify({ state, profileUser });
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
            await this.ctx.bean.user.save({
              user: userNew,
            });
            // save email
            if (email !== verifyUser.agent.email) {
              await this.ctx.bean.user.setActivated({
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
            const res = await this.ctx.performAction({
              method: 'post',
              url: 'passport/a-authsimple/authsimple',
              body: { auth, password, rememberMe },
            });
            return res;
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
            const providerItem = await this.ctx.bean.user.getAuthProvider({
              module: moduleInfo.relativeName,
              providerName: 'authsimple',
            });
            const modelAuth = this.ctx.model.module('a-base').auth;
            await modelAuth.insert({
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
            const authSimple = await this.verify({ userId, password: passwordOld });
            if (!authSimple) this.ctx.throw(403);
            // save new
            await this._passwordSaveNew({ passwordNew, userId });

            // profileUser
            const authSimpleId = authSimple.id;
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
            const verifyUser = await this.ctx.bean.user.verify({ state: 'associate', profileUser });
            if (!verifyUser) this.ctx.throw(403);
            // login now
            //   always no matter login/associate
            // await this.ctx.login(verifyUser);
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
            const user = await this.ctx.bean.user.get({ id: userId });
            const user2 = await this.signin({ auth: user.email, password: passwordNew, rememberMe: false });
            // ok
            return user2;
          }

          async passwordForgot({ email }) {
            // user by email
            const user = await this.ctx.bean.user.exists({ email });
            // link
            const token = uuid.v4().replace(/-/g, '');
            const link = this.ctx.bean.base.getAbsoluteUrl(`/#!/a/authsimple/passwordReset?token=${token}`);
            // email scene
            const scene = (app.meta.isTest || app.meta.isLocal) ? 'test' : 'system';
            // email subject
            let subject = this.ctx.text('passwordResetEmailSubject');
            subject = this.ctx.bean.util.replaceTemplate(subject, { siteName: this.ctx.instance.title });
            // email body
            let body = this.ctx.text('passwordResetEmailBody');
            body = this.ctx.bean.util.replaceTemplate(body, {
              userName: user.userName,
              link,
              siteName: this.ctx.instance.title,
            });
            // send
            await this.ctx.bean.mail.send({
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
            await this.ctx.bean.user.setActivated({
              user: { id: user.id, email, emailConfirmed: 0 },
            });
            // link
            const token = uuid.v4().replace(/-/g, '');
            const link = this.ctx.bean.base.getAbsoluteUrl(`/api/a/authsimple/auth/emailConfirmation?token=${token}`);
            // email scene
            const scene = (app.meta.isTest || app.meta.isLocal) ? 'test' : 'system';
            // email subject
            let subject = this.ctx.text('confirmationEmailSubject');
            subject = this.ctx.bean.util.replaceTemplate(subject, { siteName: this.ctx.instance.title });
            // email body
            let body = this.ctx.text('confirmationEmailBody');
            body = this.ctx.bean.util.replaceTemplate(body, {
              userName: user.userName,
              link,
              siteName: this.ctx.instance.title,
            });
            // send
            await this.ctx.bean.mail.send({
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
                linkText: this.ctx.text('Resend Confirmation Email'),
              };
              const url = this.ctx.bean.base.getAlertUrl({ data });
              return this.ctx.redirect(url);
            }
            // userId
            const userId = value.userId;
            // activated
            await this.ctx.bean.user.setActivated({
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
            const url = this.ctx.bean.base.getAlertUrl({ data });
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


      /***/ },
    /* 8 */
    /***/ function(module, exports, __webpack_require__) {


      module.exports = __webpack_require__(9);

      /***/ },
    /* 9 */
    /***/ function(module, exports, __webpack_require__) {


      const crypto = __webpack_require__(10);

      const iterations = 10000;
      const password = function(password) {
        return {
          hash(salt, callback) {
            // Make salt optional
            if (callback === undefined && salt instanceof Function) {
              callback = salt;
              salt = undefined;
            }

            if (!password) {
              return callback('No password provided');
            }

            if (typeof salt === 'string') {
              salt = new Buffer(salt, 'hex');
            }

            const calcHash = function() {
              crypto.pbkdf2(password, salt, iterations, 64, 'sha1', function(err, key) {
                if (err) { return callback(err); }
                const res = 'pbkdf2$' + iterations +
								'$' + key.toString('hex') +
								'$' + salt.toString('hex');
                callback(null, res);
              });
            };

            if (!salt) {
              crypto.randomBytes(64, function(err, gensalt) {
                if (err) { return callback(err); }
                salt = gensalt;
                calcHash();
              });
            } else {
              calcHash();
            }
          },

          verifyAgainst(hashedPassword, callback) {
            if (!hashedPassword || !password) { return callback(null, false); }

            const key = hashedPassword.split('$');
            if (key.length !== 4 || !key[2] || !key[3]) { return callback('Hash not formatted correctly'); }

            if (key[0] !== 'pbkdf2' || key[1] !== iterations.toString()) { return callback('Wrong algorithm and/or iterations'); }

            this.hash(key[3], function(error, newHash) {
              if (error) { return callback(error); }
              callback(null, newHash === hashedPassword);
            });
          },
        };
      };


      module.exports = password;


      /***/ },
    /* 10 */
    /***/ function(module, exports) {

      module.exports = require('crypto');

      /***/ },
    /* 11 */
    /***/ function(module, exports) {

      module.exports = require('require3');

      /***/ },
    /* 12 */
    /***/ function(module, exports, __webpack_require__) {

      const authSimple = __webpack_require__(13);

      module.exports = {
        authSimple,
      };


      /***/ },
    /* 13 */
    /***/ function(module, exports) {

      module.exports = app => {

        class AuthSimple extends app.meta.Model {

          constructor(ctx) {
            super(ctx, { table: 'aAuthSimple', options: { disableDeleted: true } });
          }

        }

        return AuthSimple;
      };


      /***/ },
    /* 14 */
    /***/ function(module, exports) {

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

        return config;
      };


      /***/ },
    /* 15 */
    /***/ function(module, exports, __webpack_require__) {

      module.exports = {
        'en-us': __webpack_require__(16),
        'zh-cn': __webpack_require__(17),
      };


      /***/ },
    /* 16 */
    /***/ function(module, exports) {

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


      /***/ },
    /* 17 */
    /***/ function(module, exports) {

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


      /***/ },
    /* 18 */
    /***/ function(module, exports) {

      // error code should start from 1001
      module.exports = {
        1001: 'Authentication Failed',
        1002: 'User is Disabled',
        1003: 'passwordResetEmailExpired',
      };


      /***/ },
    /* 19 */
    /***/ function(module, exports, __webpack_require__) {

      module.exports = app => {
        // auth
        const auth = __webpack_require__(20)(app);
        // keywords
        const keywords = __webpack_require__(24)(app);
        // schemas
        const schemas = __webpack_require__(25)(app);
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


      /***/ },
    /* 20 */
    /***/ function(module, exports, __webpack_require__) {

      const strategy = __webpack_require__(21);
      module.exports = app => {
        const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
        const provider = moduleInfo.name;
        async function verify(ctx, body) {
          const { auth, password, rememberMe } = body;
          // validate
          await ctx.bean.validation.validate({ validator: 'signin', data: body });
          // exists
          const user = await ctx.bean.user.exists({ userName: auth, email: auth, mobile: auth });
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
            authShouldExists: true,
            profile: {
              authSimpleId: authSimple.id,
              rememberMe,
            },
          };
        }
        return {
          providers: {
            [provider]: {
              meta: {
                title: 'User/Password',
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


      /***/ },
    /* 21 */
    /***/ function(module, exports, __webpack_require__) {

      const passport = __webpack_require__(22);
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
            url = req.ctx.bean.base.getAbsoluteUrl(url);
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


      /***/ },
    /* 22 */
    /***/ function(module, exports, __webpack_require__) {

      /**
 * Module dependencies.
 */
      const Strategy = __webpack_require__(23);


      /**
 * Expose `Strategy` directly from package.
 */
      exports = module.exports = Strategy;

      /**
 * Export constructors.
 */
      exports.Strategy = Strategy;


      /***/ },
    /* 23 */
    /***/ function(module, exports) {

      /**
 * Creates an instance of `Strategy`.
 *
 * @class
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


      /***/ },
    /* 24 */
    /***/ function(module, exports) {

      module.exports = app => {
        const keywords = {};
        keywords.exists = {
          async: true,
          type: 'string',
          errors: true,
          compile() {
            return async function(data, path, rootData, name) {
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
            return async function(data, path, rootData, name) {
              const ctx = this;
              const res = await ctx.bean.user.exists({ [name]: data });
              if (!res) {
                const errors = [{ keyword: 'x-passwordForgotEmail', params: [], message: ctx.text('Email Address does not Exist') }];
                throw new app.meta.ajv.ValidationError(errors);
              }
              return true;
            };
          },
        };
        return keywords;
      };


      /***/ },
    /* 25 */
    /***/ function(module, exports) {

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
              ebTitle: 'Password Again',
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
              ebTitle: 'Your Username/Mobile/Email',
              notEmpty: true,
            },
            password: {
              type: 'string',
              ebType: 'text',
              ebTitle: 'Your Password',
              ebSecure: true,
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
        schemas.passwordChange = {
          type: 'object',
          properties: {
            passwordOld: {
              type: 'string',
              ebType: 'text',
              ebTitle: 'Old Password',
              ebSecure: true,
              notEmpty: true,
              minLength: 6,
            },
            passwordNew: {
              type: 'string',
              ebType: 'text',
              ebTitle: 'New Password',
              ebSecure: true,
              notEmpty: true,
              minLength: 6,
            },
            passwordNewAgain: {
              type: 'string',
              ebType: 'text',
              ebTitle: 'New Password Again',
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
              ebTitle: 'New Password',
              ebSecure: true,
              notEmpty: true,
              minLength: 6,
            },
            passwordNewAgain: {
              type: 'string',
              ebType: 'text',
              ebTitle: 'New Password Again',
              ebSecure: true,
              notEmpty: true,
              const: { $data: '1/passwordNew' },
            },
          },
        };
        return schemas;
      };


      /***/ },
    /** ****/ ]);
// # sourceMappingURL=backend.js.map
