const versionManager = require('./bean/version.manager.js');
const beanFields = require('./bean/bean.fields.js');

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
  };
  return beans;
};
