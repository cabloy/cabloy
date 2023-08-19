const versionManager = require('./bean/version.manager.js');
const beanFields = require('./bean/bean.fields.js');
const summerCacheFieldsRightOfAtomClass = require('./bean/summer.cache.fieldsRightOfAtomClass.js');
const summerCacheFieldsRightOfUser = require('./bean/summer.cache.fieldsRightOfUser.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // global
    fields: {
      mode: 'ctx',
      bean: beanFields,
      global: true,
    },
    // summer
    'summer.cache.fieldsRightOfAtomClass': {
      mode: 'ctx',
      bean: summerCacheFieldsRightOfAtomClass,
    },
    'summer.cache.fieldsRightOfUser': {
      mode: 'ctx',
      bean: summerCacheFieldsRightOfUser,
    },
  };
  return beans;
};
