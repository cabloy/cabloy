module.exports = app => {
  const staticLayouts = require('./config/static/layouts.js')(app);
  // meta
  const meta = {
    base: {
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
      },
    },
  };
  return meta;
};
