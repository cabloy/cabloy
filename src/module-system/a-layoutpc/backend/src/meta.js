module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const staticLayouts = require('./config/static/layouts.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      resources: {
        button: {
          title: 'Sidebar Button',
        },
        panel: {
          title: 'Sidebar Panel',
        },
      },
      statics: {
        'a-layoutpc.layout': {
          items: staticLayouts,
        },
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {},
      keywords: {},
      schemas: {},
    },
  };
  return meta;
};
