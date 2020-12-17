module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 430:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const Ajv = require3('ajv');
const AjvLocalize = require3('ajv-i18n');
const AjvKeywords = require3('ajv-keywords');
const jsBeautify = require3('js-beautify');
const systemKeywords = __webpack_require__(915);

module.exports = app => {
  Ajv.create = function({ options, keywords, schemas, schemaRoot }) {
    // default
    const _options = {
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
    };
      // processCode
    if (app.meta.isTest || app.meta.isLocal) {
      _options.processCode = jsBeautify.js_beautify;
    }
    // override
    Object.assign(_options, options);
    // ajv
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
  };
  return Ajv;
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
      ctx.logger.error(e);
      // error
      throw ctx.createError({
        ...e,
        code: 422, message: e.errors,
      });
    }
  };
}


/***/ }),

/***/ 528:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const moment = require3('moment');

module.exports = {
  errors: true,
  compile(schema) {
    const fun = function(data, path, rootData, name) {
      if (!schema) return true;
      if (Array.isArray(data)) {
        const res = [];
        for (const item of data) {
          const _date = transformDate(fun, this, item);
          if (_date === false) return false;
          res.push(_date);
        }
        rootData[name] = res;
        return true;
      }
      const _date = transformDate(fun, this, data);
      if (_date === false) return false;
      rootData[name] = _date;
      return true;
    };
    return fun;
  },
};

function transformDate(fun, ctx, data) {
  if (!data) return null; // support null
  const _date = moment(data);
  if (!_date.isValid()) {
    fun.errors = [{ keyword: 'x-date', params: [], message: ctx.text('Invalid Date') }];
    return false;
  }
  return _date.toDate();
}


/***/ }),

/***/ 629:
/***/ ((module) => {

module.exports = {
  errors: true,
  compile(schema) {
    const fun = function(data) {
      if (schema && checkIfEmpty(data)) {
        fun.errors = [{ keyword: 'notEmpty', params: [], message: this.text('RequiredField') }];
        return false;
      }
      return true;
    };
    return fun;
  },
};

function checkIfEmpty(value) {
  // except 0
  return value === '' || value === undefined || value === null;
}


/***/ }),

/***/ 915:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const notEmpty = __webpack_require__(629);
const date = __webpack_require__(528);
module.exports = {
  notEmpty,
  'x-date': date,
};


/***/ }),

/***/ 728:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const uuid = require3('uuid');

module.exports = ctx => {
  class Validation extends ctx.app.meta.BeanModuleBase {

    constructor(moduleName) {
      super(ctx, 'validation');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    getSchema({ module, validator, schema }) {
      module = module || this.moduleName;
      const meta = ctx.app.meta.modules[module].main.meta;
      if (!schema) {
        const schemas = this._adjustSchemas(meta.validation.validators[validator].schemas);
        schema = schemas[0];
      }
      return {
        module, validator,
        schema: meta.validation.schemas[schema],
      };
    }

    async validate({ module, validator, schema, data }) {
      const _validator = this._checkValidator({ module, validator });
      return await _validator.ajv.v({ ctx, schema, data });
    }

    async ajvFromSchemaAndValidate({ module, schema, options, data }) {
      if (typeof schema === 'string') {
        const _schema = this.getSchema({ module, schema });
        schema = _schema.schema;
      }
      const ajv = this.ajvFromSchema({ module, schema, options });
      return await this.ajvValidate({ ajv, schema: null, data });
    }

    async ajvValidate({ ajv, schema, data }) {
      return await ajv.v({ ctx, schema, data });
    }

    ajvFromSchema({ module, schema, options }) {
      // params
      const params = {
        options,
      };
      // keywords
      if (module) {
        module = module || this.moduleName;
        const meta = ctx.app.meta.modules[module].main.meta;
        params.keywords = meta.validation.keywords;
      }
      // schemas
      params.schemaRoot = uuid.v4();
      params.schemas = {
        [params.schemaRoot]: { ... schema, $async: true },
      };
      // create
      return ctx.app.meta.ajv.create(params);
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

    async _validate({ atomClass, data, options }) {
      // validator
      const optionsSchema = options && options.schema;
      if (optionsSchema) {
        if (optionsSchema.validator) {
          // use validator directly
          await this.validate({
            module: optionsSchema.module,
            validator: optionsSchema.validator,
            schema: optionsSchema.schema,
            data,
          });
        } else {
          // create validator dynamicly
          await this.ajvFromSchemaAndValidate({
            module: optionsSchema.module,
            schema: optionsSchema.schema,
            data,
          });
        }
      } else if (atomClass) {
        const validator = await ctx.bean.atom.validator({ atomClass });
        if (validator) {
          // if error throw 422
          await this.validate({
            module: validator.module,
            validator: validator.validator,
            schema: validator.schema,
            data,
          });
        }
      }
    }

  }

  return Validation;
};


/***/ }),

/***/ 363:
/***/ ((module) => {

// request.body
//   validate: module(optional), validator, schema(optional)
//   data:
module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async execute(options, next) {
      // must exists
      const validator = options.validator;
      if (!validator) ctx.throw.module(moduleInfo.relativeName, 1001);
      // params
      const module = options.module || ctx.module.info.relativeName;
      const schema = options.schema || (ctx.meta._validator && ctx.meta._validator.schema);
      const data = ctx.request.body[options.data || 'data'];
      // if error throw 422
      await ctx.bean.validation.validate({
        module,
        validator,
        schema,
        data,
      });
      // next
      await next();
    }
  }
  return Middleware;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const beanValidation = __webpack_require__(728);
const middlewareValidate = __webpack_require__(363);

module.exports = app => {
  const beans = {
    // middleware
    'middleware.validate': {
      mode: 'ctx',
      bean: middlewareValidate,
    },
    // global
    validation: {
      mode: 'ctx',
      bean: beanValidation,
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

  // middlewares
  config.middlewares = {
    validate: {
      bean: 'validate',
      global: false,
    },
  };

  return config;
};


/***/ }),

/***/ 479:
/***/ ((module) => {

module.exports = {
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
  1001: 'Validator Not Specified',
};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  RequiredField: 'Required',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  test: '测试',
  Required: '必需的',
  RequiredField: '不允许为空',
  'Invalid Date': '无效的日期',
  'Not Expected Value': '不是期望的值',
  'Validator Not Specified': '没有指定validator',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 415:
/***/ ((module) => {

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
            const errors = [{ keyword: 'x-languages', params: [], message: ctx.text('Not Expected Value') }];
            return reject(new app.meta.ajv.ValidationError(errors));
          }
          return resolve(res);
        });
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

/***/ 42:
/***/ ((module) => {

module.exports = app => {
  class ValidationController extends app.Controller {

    schema() {
      const res = this.service.validation.schema(this.ctx.request.body);
      this.ctx.success(res);
    }

  }
  return ValidationController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const validation = __webpack_require__(42);

module.exports = app => {
  const controllers = {
    validation,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const services = __webpack_require__(214);
const models = __webpack_require__(230);
const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);
const constants = __webpack_require__(479);

// eslint-disable-next-line
module.exports = app => {

  // beans
  const beans = __webpack_require__(187)(app);
  // meta
  const meta = __webpack_require__(458)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);

  // ajv
  app.meta.ajv = __webpack_require__(430)(app);

  return {
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    constants,
    meta,
  };

};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const meta = {};
  if (app.meta.isTest || app.meta.isLocal) {
    // schemas
    const schemas = __webpack_require__(232)(app);
    // keywords
    const keywords = __webpack_require__(415)(app);
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

/***/ 230:
/***/ ((module) => {

module.exports = {
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    { method: 'post', path: 'validation/schema', controller: 'validation' },
  ];
  return routes;
};


/***/ }),

/***/ 929:
/***/ ((module) => {

module.exports = app => {

  class Validation extends app.Service {

    schema({ module, validator, schema }) {
      return this.ctx.bean.validation.getSchema({ module, validator, schema });
    }

  }

  return Validation;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const validation = __webpack_require__(929);

module.exports = {
  validation,
};


/***/ }),

/***/ 718:
/***/ ((module) => {

"use strict";
module.exports = require("require3");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
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
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(421);
/******/ })()
;
//# sourceMappingURL=backend.js.map