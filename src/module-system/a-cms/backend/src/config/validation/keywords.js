module.exports = app => {
  const keywords = {};
  keywords.slug = {
    async: true,
    type: 'string',
    errors: true,
    compile() {
      return async function(data, path, rootData, name) {
        // ignore if empty
        if (!data) return true;
        // unique slug for language and atomClass
        const ctx = this;
        //   atomClass from atomId
        const atomClass = await ctx.meta.atomClass.getByAtomId({ atomId: rootData.atomId });
        //   read by atomClass, language, slug
        const items = await ctx.model.query(`
          select a.id from aAtom a
            left join aCmsArticle b on a.id=b.atomId
              where a.iid=? and a.deleted=0 and a.atomClassId=? and b.language=? and b.slug=?
          `, [ ctx.instance.id, atomClass.id, rootData.language, data ]);
        if (items[0] && items[0].id !== rootData.atomId) {
          const errors = [{ keyword: 'x-slug', params: [], message: ctx.text('Slug Exists') }];
          throw new app.meta.ajv.ValidationError(errors);
        }
        return true;
      };
    },
  };
  return keywords;
};
