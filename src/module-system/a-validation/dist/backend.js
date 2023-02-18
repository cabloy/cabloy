/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 430:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const Ajv = require3('ajv');
const AjvLocalize = require3('ajv-i18n');
const AjvKeywords = require3('ajv-keywords');
const jsBeautify = require3('js-beautify');
const systemKeywords = __webpack_require__(915);

module.exports = app => {
  Ajv.create = function ({ options, keywords, schemas, schemaRoot }) {
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
  return async function ({ ctx, schema, data, filterOptions }) {
    const validate = this.getSchema(schema || schemaRoot);
    try {
      const res = await validate.call(ctx, data);
      if (filterOptions) {
        _filterResult({ ajv: this, validate, data, filterOptions });
      }
      return res;
    } catch (e) {
      if (!Array.isArray(e.errors)) throw e;
      const locale = ctx.locale.split('-')[0];
      if (locale !== 'en' && AjvLocalize[locale]) AjvLocalize[locale](e.errors);
      // need not output error
      // ctx.logger.error(e);
      // error
      throw ctx.createError({
        ...e,
        code: 422,
        message: e.errors,
      });
    }
  };
}

function _filterResult({ ajv, validate, data, filterOptions }) {
  if (filterOptions === true) {
    filterOptions = { type: true, ebReadOnly: true };
  }
  _filterSchema({ ajv, schema: validate.schema, data, filterOptions });
}

function _filterSchema({ ajv, schema, data, filterOptions }) {
  _filterProperties({ ajv, properties: schema.properties, data, filterOptions });
}

function _filterProperties({ ajv, properties, data, filterOptions }) {
  if (!data) return;
  for (const key in properties) {
    const property = properties[key];
    if (data[key] === undefined) continue;
    // special for json
    if (property.ebType === 'json' && property.type === 'string' && data[key] === '') {
      data[key] = null;
    }
    if (filterOptions.type && !property.type) {
      delete data[key];
    } else if (filterOptions.ebReadOnly && property.ebReadOnly === true) {
      delete data[key];
    } else if (property.type === 'object' && property.properties) {
      _filterProperties({ ajv, properties: property.properties, data: data[key], filterOptions });
    } else if (property.type === 'object' && property.$ref) {
      const validate = ajv.getSchema(property.$ref);
      _filterSchema({ ajv, schema: validate.schema, data: data[key], filterOptions });
    }
  }
}


/***/ }),

/***/ 946:
/***/ ((module) => {

module.exports = {
  async: true,
  type: 'string',
  errors: true,
  compile(schema, schemaProperty) {
    return async function (data, path, rootData /* , name*/) {
      // ignore if empty
      if (!data) return true;
      const atomName = data.trim();
      const ctx = this;
      // validateHost
      if (!ctx.meta || !ctx.meta.validateHost) {
        // not check
        return true;
      }
      const atomId = ctx.meta.validateHost.key.atomId;
      const atomClass = ctx.meta.validateHost.atomClass;
      //   read by atomClass, atomLanguage, atomName
      const atomLanguageClause = rootData.atomLanguage ? 'and a.atomLanguage=?' : '';
      const items = await ctx.model.query(
        `
          select a.atomStage,a.id from aAtom a
              where a.atomStage in (0,1) and a.iid=? and a.deleted=0 and a.atomClassId=? and a.atomName=? ${atomLanguageClause}
          `,
        [ctx.instance.id, atomClass.id, atomName, rootData.atomLanguage]
      );
      // check draft/formal
      const checkExists = await ctx.bean.util.checkAtomIdExists({ atomId, items });
      if (checkExists) {
        const _title = ctx.text(schemaProperty.ebTitle || 'Atom Name');
        const message = `${_title} ${ctx.text('ExistsValidation')}`;
        const errors = [{ keyword: 'x-atomName', params: [], message }];
        throw new ctx.app.meta.ajv.ValidationError(errors);
      }
      return true;
    };
  },
};


/***/ }),

/***/ 528:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const moment = require3('moment');

module.exports = {
  errors: true,
  compile(schema) {
    const fun = function (data, path, rootData, name) {
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
  compile(schema, schemaProperty) {
    const fun = function (data, path, rootData) {
      // notEmpty=false
      if (!schema) return true;
      // ctx
      const ctx = this;
      // ignoreNotEmpty
      const ignoreNotEmpty = ctx.bean.util.getProperty(ctx.meta, 'validateHost.options.ignoreNotEmpty');
      if (ignoreNotEmpty) {
        // not check
        return true;
      }
      // expression
      const expression = schema && schema.expression;
      if (expression) {
        const res = evaluateExpression({ expression, rootData, ctx });
        if (!res) return true;
      }
      if (checkIfEmpty(schema, schemaProperty, data)) {
        fun.errors = [{ keyword: 'notEmpty', params: [], message: this.text('RequiredField') }];
        return false;
      }
      return true;
    };
    return fun;
  },
};

function evaluateExpression({ expression, rootData, ctx }) {
  try {
    const globals = {
      ...rootData,
      _meta: {
        host: ctx.meta && ctx.meta.validateHost,
        user: ctx.state.user && ctx.state.user.op,
      },
    };
    return ctx.bean.util.evaluateExpression({ expression, globals });
  } catch (err) {
    console.log(expression, rootData);
    throw err;
  }
}

function checkIfEmpty(schema, schemaProperty, value) {
  const type = schemaProperty.type;
  // ignoreZero
  let ignoreZero = schema.ignoreZero;
  if (ignoreZero === undefined) {
    ignoreZero = type !== 'number' && type !== 'integer';
  }
  if (schema.ignoreZero && value === 0) return false;
  return !value;
}


/***/ }),

/***/ 10:
/***/ ((module) => {

module.exports = {
  async: true,
  type: 'string',
  errors: true,
  compile() {
    return async function (data, path, rootData /* , name*/) {
      // ignore if empty
      if (!data) return true;
      const slug = data.trim();
      // unique slug for atomLanguage and atomClass
      const ctx = this;
      // validateHost
      if (!ctx.meta || !ctx.meta.validateHost) {
        // not check
        return true;
      }
      const atomId = ctx.meta.validateHost.key.atomId;
      const atomClass = ctx.meta.validateHost.atomClass;
      //   read by atomClass, atomLanguage, slug
      const atomLanguageClause = rootData.atomLanguage ? 'and a.atomLanguage=?' : '';
      const items = await ctx.model.query(
        `
          select a.atomStage,a.id from aAtom a
            left join aCmsArticle b on a.id=b.atomId
              where a.atomStage in (0,1) and a.iid=? and a.deleted=0 and a.atomClassId=? and b.slug=? ${atomLanguageClause}
          `,
        [ctx.instance.id, atomClass.id, slug, rootData.atomLanguage]
      );
      // check draft/formal
      const checkExists = await ctx.bean.util.checkAtomIdExists({ atomId, items });
      if (checkExists) {
        const errors = [{ keyword: 'x-slug', params: [], message: ctx.text('Slug Exists') }];
        throw new ctx.app.meta.ajv.ValidationError(errors);
      }
      return true;
    };
  },
};


/***/ }),

/***/ 915:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const notEmpty = __webpack_require__(629);
const date = __webpack_require__(528);
const atomName = __webpack_require__(946);
const slug = __webpack_require__(10);
module.exports = {
  notEmpty,
  'x-date': date,
  'x-atomName': atomName,
  'x-slug': slug,
};


/***/ }),

/***/ 728:
/***/ ((module) => {

module.exports = ctx => {
  class Validation extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'validation');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    getSchema({ module, validator, schema }) {
      // for flexible
      if (schema && typeof schema === 'object') {
        return { module, validator, schema };
      }
      module = module || this.moduleName;
      const meta = ctx.app.meta.modules[module].main.meta;
      if (!schema) {
        const _validator = ctx.bean.util.getProperty(meta, `validation.validators.${validator}`);
        if (!_validator) throw new Error(`validator not found: ${module}:${validator}`);
        const schemas = this._adjustSchemas(_validator.schemas);
        schema = schemas[0];
      }
      return {
        module,
        validator,
        schema: ctx.bean.util.getProperty(meta, `validation.schemas.${schema}`),
      };
    }

    async validate({ module, validator, schema, data, filterOptions }) {
      // validator
      const _validator = this._checkValidator({ module, validator, filterOptions });
      // ignoreRules
      const ignoreRules = filterOptions && filterOptions.ignoreRules;
      // cache key
      const cacheKey = ignoreRules ? 'ajv_ignoreRules' : 'ajv';
      return await _validator[cacheKey].v({ ctx, schema, data, filterOptions });
    }

    async ajvFromSchemaAndValidate({ module, schema, options, data, filterOptions }) {
      if (typeof schema === 'string') {
        const _schema = this.getSchema({ module, schema });
        schema = _schema.schema;
      }
      const ajv = this.ajvFromSchema({ module, schema, options, filterOptions });
      return await this.ajvValidate({ ajv, schema: null, data, filterOptions });
    }

    async ajvValidate({ ajv, schema, data, filterOptions }) {
      return await ajv.v({ ctx, schema, data, filterOptions });
    }

    ajvFromSchema({ module, schema, options, filterOptions }) {
      // ignoreRules
      const ignoreRules = filterOptions && filterOptions.ignoreRules;
      // params
      if (ignoreRules) {
        options = { coerceTypes: false }; // not use _validator.options
      }
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
      params.schemaRoot = ctx.bean.util.uuid.v4();
      const schemas = {
        [params.schemaRoot]: { ...schema, $async: true },
      };
      params.schemas = this._prepareSchemas_ignoreRules({ schemas });
      // create
      return ctx.app.meta.ajv.create(params);
    }

    _checkValidator({ module, validator }) {
      // check ajv cache
      module = module || this.moduleName;
      const meta = ctx.app.meta.modules[module].main.meta;
      const _validator = meta.validation.validators[validator];
      if (!_validator) throw new Error(`validator not found: ${module}:${validator}`);
      if (_validator.ajv) return _validator;
      // create ajv
      const _schemas = this._adjustSchemas(_validator.schemas);
      const schemas = {};
      for (const _schema of _schemas) {
        schemas[_schema] = meta.validation.schemas[_schema];
        if (!schemas[_schema]) throw new Error(`schema not found: ${module}:${_schema}`);
        schemas[_schema].$async = true;
      }
      _validator.ajv = ctx.app.meta.ajv.create({
        options: _validator.options,
        keywords: meta.validation.keywords,
        schemas,
        schemaRoot: _schemas[0],
      });
      // create ajv_ignoreRules
      const schemas2 = this._prepareSchemas_ignoreRules({ schemas });
      _validator.ajv_ignoreRules = ctx.app.meta.ajv.create({
        options: { coerceTypes: false }, // not use _validator.options
        keywords: meta.validation.keywords,
        schemas: schemas2,
        schemaRoot: _schemas[0],
      });
      // ok
      return _validator;
    }

    _prepareSchemas_ignoreRules({ schemas }) {
      const schemas2 = {};
      for (const schemaName in schemas) {
        const schema = schemas[schemaName];
        const schema2 = { type: 'object', properties: {} };
        this._prepareProperties_ignoreRules({ propertiesFrom: schema.properties, propertiesTo: schema2.properties });
        schemas2[schemaName] = schema2;
      }
      return schemas2;
    }

    _prepareProperties_ignoreRules({ propertiesFrom, propertiesTo }) {
      const __basicRuleNames = ['type', 'ebType', 'ebReadOnly', '$async'];
      for (const key in propertiesFrom) {
        const propertyFrom = propertiesFrom[key];
        const propertyTo = {};
        propertiesTo[key] = propertyTo;
        for (const ruleName in propertyFrom) {
          if (__basicRuleNames.includes(ruleName)) {
            propertyTo[ruleName] = propertyFrom[ruleName];
          }
          if (ruleName === 'properties') {
            propertyTo.properties = {};
            this._prepareProperties_ignoreRules({
              propertiesFrom: propertyFrom.properties,
              propertiesTo: propertyTo.properties,
            });
          }
        }
      }
    }

    _adjustSchemas(schemas) {
      if (typeof schemas === 'string') return schemas.split(',');
      return schemas;
    }

    async _validate({ atomClass, detailClass, data, options, filterOptions }) {
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
            filterOptions,
          });
        } else {
          // create validator dynamicly
          await this.ajvFromSchemaAndValidate({
            module: optionsSchema.module,
            schema: optionsSchema.schema,
            data,
            filterOptions,
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
            filterOptions,
          });
        }
      } else if (detailClass) {
        const validator = await ctx.bean.detail.validator({ detailClass });
        if (validator) {
          // if error throw 422
          await this.validate({
            module: validator.module,
            validator: validator.validator,
            schema: validator.schema,
            data,
            filterOptions,
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
        filterOptions: true,
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

module.exports = {};


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
  ExistsValidation: 'Exists',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  test: '测试',
  Required: '必需的',
  RequiredField: '不允许为空',
  ExistsValidation: '已存在',
  'Invalid Date': '无效的日期',
  'Not Expected Value': '不是期望的值',
  'Validator Not Specified': '没有指定validator',
  'Slug Exists': 'Slug已存在',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
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
    async validate() {
      const res = await this.service.validation.validate({
        params: this.ctx.request.body.params,
        data: this.ctx.request.body.data,
      });
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
/***/ ((module) => {

module.exports = app => {
  const meta = {};
  return meta;
};


/***/ }),

/***/ 230:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    { method: 'post', path: 'validation/schema', controller: 'validation' },
    { method: 'post', path: 'validation/validate', controller: 'validation' },
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
    async validate({ params, data }) {
      await this.ctx.bean.validation.validate({
        ...params,
        data,
      });
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