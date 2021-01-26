module.exports = app => {
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
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
  };
  return meta;
};
