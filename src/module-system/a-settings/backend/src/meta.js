module.exports = app => {
  // static
  const staticResources = require('./meta/static/resources.js')(app);
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
