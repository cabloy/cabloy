import Vue from 'vue';

export default {
  state() {
    return {
      validators: {},
      schemas: {},
    };
  },
  actions: {
    setValidator({ atomClass, validator }) {
      const key = `${atomClass.module}:${atomClass.atomClassName}`;
      this.validators = {
        ...this.validators,
        [key]: validator,
      };
    },
    async getValidator({ atomClass }) {
      const key = `${atomClass.module}:${atomClass.atomClassName}`;
      if (this.validators[key]) return this.validators[key];
      const validator = await Vue.prototype.$meta.api.post('/a/base/atom/validator', {
        atomClass,
      });
      this.setValidator({ atomClass, validator });
      return validator;
    },
    setSchema({ module, validator, schema, schemaRes }) {
      const key = `${module}:${validator || ''}:${schema || ''}`;
      this.schemas = {
        ...this.schemas,
        [key]: schemaRes,
      };
    },
    async getSchema({ module, validator, schema }) {
      const key = `${module}:${validator || ''}:${schema || ''}`;
      if (this.schemas[key]) return this.schemas[key];
      // schema
      const schemaRes = await Vue.prototype.$meta.api.post('/a/validation/validation/schema', {
        module,
        validator,
        schema,
      });
      this.setSchema({ module, validator, schema, schemaRes });
      return schemaRes;
    },
    async getSchemaByAtomClass({ atomClass }) {
      const validator = await this.getValidator({ atomClass });
      if (!validator) return null;
      return await this.getSchema({
        module: validator.module,
        validator: validator.validator,
        schema: null,
      });
    },
  },
};
