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

const services = __webpack_require__(2);
const models = __webpack_require__(4);
const config = __webpack_require__(5);
const locales = __webpack_require__(6);
const errors = __webpack_require__(8);
const middlewares = __webpack_require__(9);
const constants = __webpack_require__(13);
const ajv = __webpack_require__(14);

// eslint-disable-next-line
module.exports = app => {

  // meta
  const meta = __webpack_require__(17)(app);
  const routes = __webpack_require__(20)(app);

  // ajv
  app.meta.ajv = ajv;

  return {
    routes,
    services,
    models,
    config,
    locales,
    errors,
    middlewares,
    constants,
    meta,
  };

};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const validation = __webpack_require__(3);

module.exports = {
  validation,
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = app => {

  class Validation extends app.Service {

    schema({ module, validator, schema }) {
      return this.ctx.meta.validation.getSchema({ module, validator, schema });
    }

  }

  return Validation;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    validation: {
      global: true,
      dependencies: 'instance',
    },
    validate: {
      global: false,
    },
  };

  return config;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(7),
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = {
  test: '测试',
  'Not empty': '不允许为空',
  'Not expected value': '不是期望的值',
  'validator not specified': '没有指定validator',
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'validator not specified',
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const validation = __webpack_require__(10);
const validate = __webpack_require__(12);

module.exports = {
  validation,
  validate,
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// validation
const ValidationFn = __webpack_require__(11);
const VALIDATION = Symbol('CTX#__VALIDATION');

module.exports = (options, app) => {
  return async function validation(ctx, next) {
    ctx.meta = ctx.meta || {};
    Object.defineProperty(ctx.meta, 'validation', {
      get() {
        if (ctx.meta[VALIDATION] === undefined) {
          ctx.meta[VALIDATION] = new (ValidationFn(ctx))();
        }
        return ctx.meta[VALIDATION];
      },
    });
    // next
    await next();
  };
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

const Fn = module.exports = ctx => {
  class Validation {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's validation
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    getSchema({ module, validator, schema }) {
      module = module || this.moduleName;
      const meta = ctx.app.meta.modules[module].main.meta;
      if (!schema) {
        const schemas = this._adjustSchemas(meta.validation.validators[validator].schemas);
        schema = schemas[0];
      }
      return meta.validation.schemas[schema];
    }

    async validate({ module, validator, schema, data }) {
      const _validator = this._checkValidator({ module, validator });
      const res = await _validator.ajv.v({ ctx, schema, data });
      return res;
    }

    _checkValidator({ module, validator }) {
      module = module || this.moduleName;
      const meta = ctx.app.meta.modules[module].main.meta;
      const _validator = meta.validation.validators[validator];
      if (_validator.ajv) return _validator;
      // create ajv
      const _schemas = this._adjustSchemas(_validator.schemas);
      const schemas = {};
      for (const _schema of _schemas) {
        schemas[_schema] = meta.validation.schemas[_schema];
        schemas[_schema].$async = true;
      }
      _validator.ajv = ctx.app.meta.ajv.create({ options: _validator.options, keywords: meta.validation.keywords, schemas, schemaRoot: _schemas[0] });
      return _validator;
    }

    _adjustSchemas(schemas) {
      if (typeof schemas === 'string') return schemas.split(',');
      return schemas;
    }

  }

  return Validation;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

// request.body
//   validate: module(optional), validator, schema(optional)
//   data:
module.exports = (options2, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function validate(ctx, next, options) {
    // must exists
    const validator = options.validator;
    if (!validator) ctx.throw.module(moduleInfo.relativeName, 1001);
    // params
    const module = options.module || ctx.module.info.relativeName;
    const schema = options.schema || (ctx.meta._validator && ctx.meta._validator.schema);
    const data = ctx.request.body[options.data || 'data'];
    // if error throw 422
    await ctx.meta.validation.validate({
      module,
      validator,
      schema,
      data,
    });
    // next
    await next();
  };
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const Ajv = require3('ajv');
const AjvLocalize = require3('ajv-i18n');
const AjvKeywords = require3('ajv-keywords');
const systemKeywords = __webpack_require__(15);

module.exports = {
  create({ options, keywords, schemas, schemaRoot }) {
    const _options = Object.assign({
      $data: true,
      allErrors: true,
      verbose: false,
      jsonPointers: true,
      format: 'full',
      unknownFormats: true,
      useDefaults: true,
      coerceTypes: true,
      transpile: false,
      passContext: true,
      removeAdditional: 'all',
    }, options);
    const ajv = new Ajv(_options);
    AjvKeywords(ajv);
    ajv.v = createValidate(schemaRoot);
    // systemKeywords
    for (const _keyword in systemKeywords) {
      ajv.addKeyword(_keyword, systemKeywords[_keyword]);
    }
    // keywords
    if (keywords) {
      for (const _keyword in keywords) {
        ajv.addKeyword(_keyword, keywords[_keyword]);
      }
    }
    // schemas
    if (schemas) {
      for (const key in schemas) {
        ajv.addSchema(schemas[key], key);
      }
    }
    return ajv;
  },
};

function createValidate(schemaRoot) {
  return async function({ ctx, schema, data }) {
    const validate = this.getSchema(schema || schemaRoot);
    try {
      const res = await validate.call(ctx, data);
      return res;
    } catch (e) {
      const locale = ctx.locale.split('-')[0];
      if (locale !== 'en' && AjvLocalize[locale]) AjvLocalize[locale](e.errors);
      // error
      throw ctx.createError({
        ...e,
        code: 422, message: e.errors,
      });
    }
  };
}


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const notEmpty = __webpack_require__(16);

module.exports = {
  notEmpty,
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = {
  errors: true,
  compile(schema) {
    const fun = function(data) {
      const res = schema ? !!data : !data;
      if (!res) {
        fun.errors = [{ keyword: 'notEmpty', params: [], message: this.text('Not empty') }];
      }
      return res;
    };
    return fun;
  },
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  const meta = {};
  if (app.meta.isTest || app.meta.isLocal) {
    // schemas
    const schemas = __webpack_require__(18)(app);
    // keywords
    const keywords = __webpack_require__(19)(app);
    // meta
    Object.assign(meta, {
      validation: {
        validators: {
          test: {
            schemas: 'root,extra',
          },
        },
        keywords: {
          'x-languages': keywords.languages,
        },
        schemas: {
          root: schemas.root,
          extra: schemas.extra,
        },
      },
    });
  }
  return meta;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  schemas.root = {
    type: 'object',
    ebTitle: 'test',
    properties: {
      info: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          username: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'User Name',
            ebDescription: 'Your name',
            notEmpty: true,
          },
          password: {
            type: 'string',
            ebType: 'text',
            ebSecure: true,
          },
          sex: {
            type: 'number',
            ebType: 'select',
            ebOptions: [
              { title: 'Male', value: 1 },
              { title: 'Female', value: 2 },
            ],
          },
        },
      },
      extra: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Extra Group',
        properties: {
          extra: {
            ebType: 'panel',
            $ref: 'extra',
          },
        },
      },
    },
  };
  schemas.extra = {
    type: 'object',
    ebTitle: 'extra',
    properties: {
      info: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          language: {
            type: 'string',
            ebType: 'select',
            ebOptionsUrl: 'test/languages',
            notEmpty: true,
            'x-languages': true,
          },
        },
        required: [ 'language' ],
      },
    },
  };
  return schemas;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const Ajv = require3('ajv');

module.exports = app => {
  const keywords = {};
  keywords.languages = {
    async: true,
    type: 'string',
    errors: true,
    compile() {
      return async function(data) {
        const ctx = this;
        return new Promise((resolve, reject) => {
          const res = [ 'zh-cn', 'en-us' ].indexOf(data) > -1;
          if (!res) {
            const errors = [{ keyword: 'x-languages', params: [], message: ctx.text('Not expected value') }];
            return reject(new Ajv.ValidationError(errors));
          }
          return resolve(res);
        });
      };
    },
  };
  return keywords;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const validation = __webpack_require__(21);

module.exports = app => {
  const routes = [
    { method: 'post', path: 'validation/schema', controller: validation },
  ];
  return routes;
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = app => {
  class ValidationController extends app.Controller {

    schema() {
      const res = this.service.validation.schema(this.ctx.request.body);
      this.ctx.success(res);
    }

  }
  return ValidationController;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map