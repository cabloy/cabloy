const Ajv = require('ajv');
const AjvLocalize = require('ajv-i18n');
const AjvKeywords = require('ajv-keywords');
const jsBeautify = require('js-beautify');
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
      for (const key in keywords) {
        const _key = key.indexOf('x-') === 0 ? key : `x-${key}`;
        ajv.addKeyword(_key, keywords[key]);
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
    filterOptions = { type: true, ebCopy: true, ebReadOnly: true };
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
    } else if (filterOptions.ebCopy && property.ebCopy === false) {
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
