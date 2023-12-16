const schemas = require('./meta/validation/schemas.js');
const staticLayouts = require('./meta/static/layouts.js');
// meta
const meta = {
  base: {
    statics: {
      'a-baselayout.layout': {
        items: staticLayouts,
      },
    },
  },
  validation: {
    validators: {},
    schemas,
  },
};
module.exports = meta;
