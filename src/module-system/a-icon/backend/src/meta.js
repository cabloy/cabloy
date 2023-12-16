const schemas = require('./meta/validation/schemas.js');
// static
const staticResources = require('./meta/static/resources.js');
const meta = {
  base: {
    atoms: {},
    statics: {
      'a-base.resource': {
        items: staticResources,
      },
    },
  },
  validation: {
    validators: {},
    keywords: {},
    schemas,
  },
};
module.exports = meta;
