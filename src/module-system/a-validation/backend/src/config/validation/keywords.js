const require3 = require('require3');
const Ajv = require3('ajv');

module.exports = app => {
  const keywords = {};
  keywords.languages = {
    async: true,
    type: 'string',
    errors: true,
    compile() {
      return async function(data) {
        const ctx = this;
        return new Promise((resolve, reject) => {
          const res = [ 'zh-cn', 'en-us' ].indexOf(data) > -1;
          if (!res) {
            const errors = [{ keyword: 'x-languages', params: [], message: ctx.text('Not expected value') }];
            return reject(new Ajv.ValidationError(errors));
          }
          return resolve(res);
        });
      };
    },
  };
  return keywords;
};
