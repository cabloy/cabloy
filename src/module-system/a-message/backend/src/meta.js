const schemas = require('./meta/validation/schemas.js');
const staticLayouts = require('./meta/static/layouts.js');
const meta = {
  base: {
    atoms: {},
    statics: {
      'a-baselayout.layout': {
        items: staticLayouts,
      },
    },
  },
  validation: {
    validators: {},
    keywords: {},
    schemas: {},
  },
  stats: {
    providers: {
      message: {
        user: true,
        bean: 'message',
        dependents: ['a-user:user'],
      },
    },
  },
};
module.exports = meta;
