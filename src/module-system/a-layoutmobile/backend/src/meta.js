module.exports = app => {
  const staticLayouts = require('./meta/static/layouts.js');
  const staticResources = require('./meta/static/resources.js');
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
