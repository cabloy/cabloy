module.exports = app => {
  // atomClasses
  const atomClasses = require('./config/atomClass/atomClasses.js')(app);
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticLayouts = require('./config/static/layouts.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  const staticDicts = require('./config/static/dicts.js')(app);
  // meta
  const meta = {
    base: {
      atoms: atomClasses,
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
        'a-base.resource': {
          items: staticResources,
        },
        'a-dict.dict': {
          items: staticDicts,
        },
      },
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
    index: {
      indexes: {
        aUserOnline: 'createdAt,updatedAt,atomId,userId,onlineTimeLast,expireTime',
        aUserOnlineHistory: 'createdAt,updatedAt,userId,onlineTime',
      },
    },
  };
  return meta;
};
