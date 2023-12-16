module.exports = app => {
  const atomClasses = require('./meta/atomClass/atomClasses.js');
  const schemas = require('./meta/validation/schemas.js');
  const staticLayouts = require('./meta/static/layouts.js');
  const staticResources = require('./meta/static/resources.js');
  const staticDicts = require('./meta/static/dicts.js');
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
