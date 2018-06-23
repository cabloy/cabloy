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
