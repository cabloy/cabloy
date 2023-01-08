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
      const _validator = this._checkValidator({ module, validator });
      return await _validator.ajv.v({ ctx, schema, data, filterOptions });
    }

    async ajvFromSchemaAndValidate({ module, schema, options, data, filterOptions }) {
      if (typeof schema === 'string') {
        const _schema = this.getSchema({ module, schema });
        schema = _schema.schema;
      }
      const ajv = this.ajvFromSchema({ module, schema, options });
      return await this.ajvValidate({ ajv, schema: null, data, filterOptions });
    }

    async ajvValidate({ ajv, schema, data, filterOptions }) {
      return await ajv.v({ ctx, schema, data, filterOptions });
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
      params.schemaRoot = ctx.bean.util.uuid.v4();
      params.schemas = {
        [params.schemaRoot]: { ...schema, $async: true },
      };
      // create
      return ctx.app.meta.ajv.create(params);
    }

    _checkValidator({ module, validator }) {
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
      return _validator;
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
