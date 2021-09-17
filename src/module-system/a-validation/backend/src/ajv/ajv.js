const require3 = require('require3');
const Ajv = require3('ajv');
const AjvLocalize = require3('ajv-i18n');
const AjvKeywords = require3('ajv-keywords');
const jsBeautify = require3('js-beautify');
const systemKeywords = require('./keywords.js');

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
  return async function ({ ctx, schema, data, options }) {
    const validate = this.getSchema(schema || schemaRoot);
    try {
      const res = await validate.call(ctx, data);
      if (options && options.filter) {
        _filterResult({ ajv: this, validate, data, options });
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

function _filterResult({ ajv, validate, data, options }) {
  const filter = options && options.filter;
  _filterSchema({ ajv, schema: validate.schema, data, filter });
}

function _filterSchema({ ajv, schema, data, filter }) {
  _filterProperties({ ajv, properties: schema.properties, data, filter });
}

function _filterProperties({ ajv, properties, data, filter }) {
  for (const key in properties) {
    const property = properties;
    if (data[key] === undefined) continue;
    if (filter.type && !property.type) {
      delete data[key];
    } else if (filter.ebReadOnly && property.ebReadOnly === true) {
      delete data[key];
    } else if (property.type === 'object' && property.properties) {
      _filterProperties({ ajv, properties: property.properties, data: data[key], filter });
    } else if (property.type === 'object' && property.$ref) {
      const validate = ajv.getSchema(property.$ref);
      _filterSchema({ ajv, schema: validate.schema, data: data[key], filter });
    }
  }
}
