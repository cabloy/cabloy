const schemas = require('./meta/validation/schemas.js');
const meta = {
  validation: {
    validators: {},
    keywords: {},
    schemas,
  },
  settings: {
    instance: {
      actionPath: 'instance/config',
    },
  },
};
module.exports = meta;
