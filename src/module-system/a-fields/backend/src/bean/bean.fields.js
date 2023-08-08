module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Fields {
    async parseSchema({ atomClass, fieldsRight }) {
      // atomClass
      atomClass = await ctx.bean.atomClass.get(atomClass);
      // schemaBase
      let schemaBase = await this.__parseSchema_getSchemaBase({ atomClass });
      // fieldsRight
      fieldsRight = await this.__parseSchema_getFieldsRight({ atomClass, fieldsRight });
      // check
      if (fieldsRight._mode === 'general') {
        schemaBase = this.__parseSchema_checkModeGeneral({ schemaBase, fieldsRight });
      } else {
        // custom: array/object
        if (Array.isArray(fieldsRight.custom)) {
          schemaBase = this.__parseSchema_checkModeCustom_array({ schemaBase, fieldsRight });
        } else {
          schemaBase = this.__parseSchema_checkModeCustom_object({ schemaBase, fieldsRight });
        }
      }
      return schemaBase;
    }

    async _fieldsRightLocale({ items }) {}

    async __parseSchema_checkModeCustom_array({ schemaBase, fieldsRight }) {
      const schema = schemaBase.schema;
      const properties = schema.properties;
      const propertiesNew = {};
      for (const field of fieldsRight.custom) {
        if (typeof field === 'string') {
          if (properties[field]) {
            propertiesNew[field] = properties[field];
          }
        } else {
          // { name, property }
          propertiesNew[field.name] = field.property;
        }
      }
      // return
      const schemaNew = {
        ...schema,
        properties: propertiesNew,
      };
      return {
        ...schemaBase,
        schema: schemaNew,
      };
    }

    async __parseSchema_checkModeCustom_object({ /* schemaBase,*/ fieldsRight }) {
      const schemaParams = {
        module: fieldsRight.custom.module,
        validator: fieldsRight.custom.validator,
        schema: fieldsRight.custom.schema,
      };
      return ctx.bean.validation.getSchema(schemaParams);
    }

    async __parseSchema_checkModeGeneral({ schemaBase, fieldsRight }) {
      const schema = schemaBase.schema;
      const properties = schema.properties;
      const propertiesNew = {};
      for (const key in properties) {
        const property = properties[key];
        let propertyNew;
        // base controls
        if (!fieldsRight.basic.read) {
          propertyNew = null;
        } else if (!fieldsRight.basic.write) {
          propertyNew = {
            ...property,
            ebReadOnly: true,
          };
        } else {
          // if basic.write === true and ebReadOnly:true, then hold current state
          // the same
          propertyNew = property;
        }
        // specific controls
        const field = fieldsRight.fields.find(item => item.name === key);
        if (!field) {
          // do nothing
        } else if (!field.read) {
          // hide
          propertyNew = null;
        } else if (!field.write) {
          propertyNew = {
            ...property, // not use propertyNew, for maybe null
            ebReadOnly: true,
          };
        } else {
          // read and write
          propertyNew = {
            ...property, // not use propertyNew, for maybe null
            ebReadOnly: false,
          };
        }
        // record
        if (propertyNew) {
          propertiesNew[key] = propertyNew;
        }
      }
      // return
      const schemaNew = {
        ...schema,
        properties: propertiesNew,
      };
      return {
        ...schemaBase,
        schema: schemaNew,
      };
    }

    async __parseSchema_getSchemaBase({ atomClass }) {
      // validator
      const validator = await ctx.bean.atom.validator({ atomClass });
      // schemaBase
      return ctx.bean.validation.getSchema({
        module: validator.module,
        validator: validator.validator,
        schema: null,
      });
    }

    async __parseSchema_getFieldsRight({ atomClass, fieldsRight }) {
      // atomClassBase
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      if (atomClassBase.detail) {
        const atomClassKey = this.__getAtomClassKey({ atomClass });
        const details = fieldsRight?.details || {};
        fieldsRight = details[atomClassKey];
      }
      // prepare fieldsRight
      return this.__parseSchema_prepareFieldsRight({ fieldsRight });
    }

    async __parseSchema_prepareFieldsRight({ fieldsRight }) {
      // extend
      fieldsRight = ctx.bean.util.extend({}, fieldsRight);
      // mode
      if (!fieldsRight.mode) {
        fieldsRight.mode = 'allowAllFieldsRead';
      }
      const mode = fieldsRight.mode;
      // check mode
      if (mode === 'allowAllFieldsRead') {
        fieldsRight._mode = 'general';
        fieldsRight.basic = { read: true, write: false };
        fieldsRight.fields = [];
      } else if (mode === 'allowAllFieldsReadWrite') {
        fieldsRight._mode = 'general';
        fieldsRight.basic = { read: true, write: true };
        fieldsRight.fields = [];
      } else if (mode === 'allowSpecificFields') {
        fieldsRight._mode = 'general';
        if (!fieldsRight.basic) {
          fieldsRight.basic = { read: true, write: false };
        }
        if (!fieldsRight.fields) {
          fieldsRight.fields = [];
        }
      } else if (mode === 'custom') {
        // array/object: do nothing
      }
      // adjust fields
      if (fieldsRight.fields && fieldsRight.fields.length > 0) {
        fieldsRight.fields = fieldsRight.fields.map(field => {
          if (typeof field === 'string') {
            return { name: field, read: false, write: false };
          }
          return field;
        });
      }
      // ok
      return fieldsRight;
    }

    __getAtomClassKey({ atomClass }) {
      return `${atomClass.module}:${atomClass.atomClassName}`;
    }
  }

  return Fields;
};
