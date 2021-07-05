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
      const items = await ctx.model.query(
        `
          select a.id from aAtom a
              where a.atomStage=0 and a.iid=? and a.deleted=0 and a.atomClassId=? and a.atomName=? ${rootData.atomLanguage ? 'and a.atomLanguage=?' : ''}
          `,
        [ctx.instance.id, atomClass.id, atomName, rootData.atomLanguage]
      );
      if (items[0] && items[0].id !== atomId) {
        const _title = ctx.text(schemaProperty.ebTitle || 'Atom Name');
        const message = `${_title} ${ctx.text('ExistsValidation')}`;
        const errors = [{ keyword: 'x-atomName', params: [], message }];
        throw new ctx.app.meta.ajv.ValidationError(errors);
      }
      return true;
    };
  },
};
