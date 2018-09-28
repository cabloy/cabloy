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

module.exports = require("util");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const routes = __webpack_require__(2);
const services = __webpack_require__(5);
const models = __webpack_require__(11);
const config = __webpack_require__(14);
const locales = __webpack_require__(15);
const errors = __webpack_require__(17);
const metaFn = __webpack_require__(18);

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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(3);
const auth = __webpack_require__(4);

module.exports = [
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
  { method: 'post', path: 'auth/add', controller: auth, middlewares: 'inner' },
  { method: 'post', path: 'auth/signup', controller: auth, middlewares: 'validate',
    meta: { validate: { validator: 'signup' } },
  },
  { method: 'post', path: 'auth/reset', controller: auth, middlewares: 'validate',
    meta: { validate: { validator: 'reset' } },
  },
];


/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports) {

module.exports = app => {
  class AuthController extends app.Controller {

    async add() {
      const { userId, password } = this.ctx.request.body;
      await this.service.auth.add({ userId, password });
      this.ctx.success();
    }

    async signup() {
      const { userName, realName, email, mobile, password } = this.ctx.request.body.data;
      await this.service.auth.signup({ userName, realName, email, mobile, password });
      this.ctx.success();
    }

    async reset() {
      const { passwordOld, passwordNew } = this.ctx.request.body.data;
      await this.service.auth.reset({ passwordOld, passwordNew, userId: this.ctx.user.agent.id });
      this.ctx.success();
    }

  }
  return AuthController;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(6);
const auth = __webpack_require__(7);
module.exports = {
  version,
  auth,
};


/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const util = __webpack_require__(0);
const passwordFn = __webpack_require__(8);
module.exports = app => {
  class Auth extends app.Service {

    async signup({ userName, realName, email, mobile, password }) {
      const userId = await this.ctx.meta.user.signup({ userName, realName, email, mobile });
      await this.add({ userId, password });
      return userId;
    }

    async add({ userId, password }) {
      password = password || this.ctx.config.defaultPassword;
      const hash = await this._calcPassword({ password });
      // auth simple
      await this.ctx.model.authSimple.insert({
        userId,
        hash,
      });
      // auth
      const info = this.ctx.module.info;
      const providerItem = await this.ctx.meta.user.getAuthProvider({
        module: info.relativeName,
        providerName: info.name,
      });
      await this.ctx.model.auth.insert({
        userId,
        providerId: providerItem.id,
        profileId: userId,
        profile: JSON.stringify({
          userId,
          rememberMe: false,
        }),
      });
    }

    async verify({ userId, password }) {
      if (!password) return false;
      const auth = await this.ctx.model.authSimple.get({
        userId,
      });
      if (!auth) return false;
      return await this._verifyPassword({ password, hash: auth.hash });
    }

    async reset({ passwordOld, passwordNew, userId }) {
      // verify old
      const res = await this.verify({ userId, password: passwordOld });
      if (!res) this.ctx.throw(403);
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(9);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = __webpack_require__(10);

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
/* 10 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const auth = __webpack_require__(12);
const authSimple = __webpack_require__(13);

module.exports = {
  auth,
  authSimple,
};


/***/ }),
/* 12 */
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
/* 13 */
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
/* 14 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {
    defaultPassword: '123456',
  };
  return config;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(16),
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = {
  'Authentication failed': '认证失败',
  'User is disabled': '用户被禁用',
  'Auth-Simple': '认证-简单',
  'Reset password': '重置密码',
  'Element exists': '元素已存在',
  'Cannot contain __': '不能包含__',
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'Authentication failed',
  1002: 'User is disabled',
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  // auth
  const auth = __webpack_require__(19)(app);
  // keywords
  const keywords = __webpack_require__(23)(app);
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
        reset: {
          schemas: 'reset',
        },
      },
      keywords: {
        'x-exists': keywords.exists,
      },
      schemas: {
        signup: schemas.signup,
        signin: schemas.signin,
        reset: schemas.reset,
      },
    },
    user: {
      functions: {
        resetPassword: {
          title: 'Reset password',
          actionPath: 'reset',
        },
      },
    },
  };
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const strategy = __webpack_require__(20);
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
    const verify = await ctx.service.auth.verify({ userId: user.id, password });
    if (!verify) return ctx.throw(1001);
    return {
      module: moduleInfo.relativeName,
      provider,
      profileId: user.id,
      maxAge: rememberMe ? null : 0,
      profile: {
        userId: user.id,
        rememberMe,
      },
    };
  }
  return {
    providers: {
      [provider]: {
        config: {
          successReturnToOrRedirect: false, successRedirect: false,
          addUser: false, addRole: false,
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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const passport = __webpack_require__(21);
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
  const self = this;
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */
var Strategy = __webpack_require__(22);


/**
 * Expose `Strategy` directly from package.
 */
exports = module.exports = Strategy;

/**
 * Export constructors.
 */
exports.Strategy = Strategy;


/***/ }),
/* 22 */
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(24);
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
        if (res) {
          const errors = [{ keyword: 'x-exists', params: [], message: ctx.text('Element exists') }];
          throw new Ajv.ValidationError(errors);
        }
        if (data.indexOf('__') > -1) {
          const errors = [{ keyword: 'x-exists', params: [], message: ctx.text('Cannot contain __') }];
          throw new Ajv.ValidationError(errors);
        }
        return true;
      };
    },
  };
  return keywords;
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 25 */
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
      mobile: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Mobile',
        notEmpty: true,
        'x-exists': true,
      },
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
  schemas.reset = {
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
  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map