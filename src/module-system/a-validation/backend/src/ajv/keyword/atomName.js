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
        throw new module.meta.class.Ajv.ValidationError(errors);
      }
      return true;
    };
  },
};
