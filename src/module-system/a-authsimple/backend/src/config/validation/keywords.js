const require3 = require('require3');
const Ajv = require3('ajv');

module.exports = app => {
  const keywords = {};
  keywords.exists = {
    async: true,
    type: 'string',
    errors: true,
    compile() {
      return async function(data, path, rootData, name) {
        const ctx = this;
        const res = await ctx.meta.user.exists({ [name]: data });
        if (res && res.id !== ctx.user.agent.id) {
          const errors = [{ keyword: 'x-exists', params: [], message: ctx.text('Element exists') }];
          throw new Ajv.ValidationError(errors);
        }
        if (!res && data.indexOf('__') > -1) {
          const errors = [{ keyword: 'x-exists', params: [], message: ctx.text('Cannot contain __') }];
          throw new Ajv.ValidationError(errors);
        }
        return true;
      };
    },
  };
  return keywords;
};
