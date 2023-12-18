const versionManager = require('./bean/version.manager.js');
const beanFields = require('./bean/bean.fields.js');
const summerCacheFieldsRightOfAtomClass = require('./bean/summer.cache.fieldsRightOfAtomClass.js');
const summerCacheFieldsRightOfUser = require('./bean/summer.cache.fieldsRightOfUser.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // global
  fields: {
    bean: beanFields,
    global: true,
  },
  // summer
  'summer.cache.fieldsRightOfAtomClass': {
    bean: summerCacheFieldsRightOfAtomClass,
  },
  'summer.cache.fieldsRightOfUser': {
    bean: summerCacheFieldsRightOfUser,
  },
};
