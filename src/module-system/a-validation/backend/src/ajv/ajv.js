const require3 = require('require3');
const Ajv = require3('ajv');
const AjvLocalize = require3('ajv-i18n');
const AjvKeywords = require3('ajv-keywords');
const jsBeautify = require3('js-beautify');
const systemKeywords = require('./keywords.js');

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
