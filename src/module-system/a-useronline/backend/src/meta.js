module.exports = app => {
  // atomClasses
  const atomClasses = require('./meta/atomClass/atomClasses.js')(app);
  // schemas
  const schemas = require('./meta/validation/schemas.js')(app);
  // static
  const staticLayouts = require('./meta/static/layouts.js')(app);
  const staticResources = require('./meta/static/resources.js')(app);
  const staticDicts = require('./meta/static/dicts.js')(app);
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
