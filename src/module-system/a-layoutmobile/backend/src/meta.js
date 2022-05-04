module.exports = app => {
  const staticLayouts = require('./config/static/layouts.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      resources: {
        button: {
          title: 'Tabbar Button',
        },
      },
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
  };
  return meta;
};
