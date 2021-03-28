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
        // unique slug for atomLanguage and atomClass
        const ctx = this;
        //   atomClass from atomId
        const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: rootData.atomId });
        //   read by atomClass, atomLanguage, slug
        const items = await ctx.model.query(`
          select a.id from aAtom a
            left join aCmsArticle b on a.id=b.atomId
              where a.atomStage=0 and a.iid=? and a.deleted=0 and a.atomClassId=? and b.slug=? ${rootData.atomLanguage ? 'and a.atomLanguage=?' : ''}
          `, [ ctx.instance.id, atomClass.id, data, rootData.atomLanguage ]);
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
