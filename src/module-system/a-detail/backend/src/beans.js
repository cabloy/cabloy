const versionManager = require('./bean/version.manager.js');
const localProcedure = require('./bean/local.procedure.js');
const beanDetail = require('./bean/bean.detail.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // local
    'local.procedure': {
      mode: 'ctx',
      bean: localProcedure,
    },
    // global
    detail: {
      mode: 'ctx',
      bean: beanDetail,
      global: true,
    },
  };
  return beans;
};
