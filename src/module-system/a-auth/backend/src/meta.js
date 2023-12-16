const schemas = require('./meta/validation/schemas.js');
const meta = {
  base: {
    atoms: {},
  },
  validation: {
    validators: {},
    keywords: {},
    schemas,
  },
  settings: {
    user: {
      actionPath: '/a/user/user/authentications',
    },
  },
};
module.exports = meta;
