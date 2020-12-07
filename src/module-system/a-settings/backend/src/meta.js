module.exports = app => {
  // static
  const staticResources = require('./config/static/resources.js')(app);
  const meta = {
    base: {
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
  };
  return meta;
};
