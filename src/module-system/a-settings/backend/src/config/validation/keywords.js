const require3 = require('require3');
const Ajv = require3('ajv');

module.exports = app => {
  const keywords = {};
  keywords.languages = {
    async: true,
    type: 'string',
    errors: true,
    compile(sch, parentSchema) {
      const func = async function(data) {
        const ctx = this;
        const context = arguments.callee.context;
        const locales = await ctx.performAction({
          method: 'post',
          url: context.parentSchema.ebOptionsUrl,
          body: context.parentSchema.ebOptionsUrlParams,
        });
        const index = locales.findIndex(item => item.value === data);
        if (index > -1) return true;
        const errors = [{ keyword: 'x-languages', params: [], message: ctx.text('Not expected value') }];
        throw new Ajv.ValidationError(errors);
      };
      func.context = {
        sch, parentSchema,
      };
      return func;
    },
  };
  return keywords;
};
