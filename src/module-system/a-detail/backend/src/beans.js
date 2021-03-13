const versionManager = require('./bean/version.manager.js');
const localProcedure = require('./bean/local.procedure.js');
const beanDetail = require('./bean/bean.detail.js');
const beanDetailClass = require('./bean/bean.detailClass.js');

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
    detailClass: {
      mode: 'ctx',
      bean: beanDetailClass,
      global: true,
    },
  };
  return beans;
};
