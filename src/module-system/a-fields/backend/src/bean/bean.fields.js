module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Fields {
    async parseSchema({ atomClass, fieldsRight }) {
      // schemaBase
      const schemaBase = await this.__parseSchema_getSchemaBase({ atomClass });
      // fieldsRight
      fieldsRight = await this.__parseSchema_getFieldsRight({ atomClass, fieldsRight });
      console.log(fieldsRight);
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
        const details = fieldsRight.details || {};
        fieldsRight = details[atomClassKey];
      }
      // prepare fieldsRight
      fieldsRight = this.__parseSchema_prepareFieldsRight({ fieldsRight });
    }

    async __parseSchema_prepareFieldsRight({ fieldsRight }) {}

    __getAtomClassKey({ atomClass }) {
      return `${atomClass.module}:${atomClass.atomClassName}`;
    }
  }

  return Fields;
};
