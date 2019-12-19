module.exports = app => {
  const keywords = {};
  keywords.languages = {
    async: true,
    type: 'string',
    errors: true,
    compile(sch, parentSchema) {
      return async function(data) {
        const ctx = this;
        const locales = await ctx.performAction({
          method: 'post',
          url: parentSchema.ebOptionsUrl,
          body: parentSchema.ebOptionsUrlParams,
        });
        const index = locales.findIndex(item => item.value === data);
        if (index > -1) return true;
        const errors = [{ keyword: 'x-languages', params: [], message: ctx.text('Not expected value') }];
        throw new app.meta.ajv.ValidationError(errors);
      };
    },
  };
  return keywords;
};
