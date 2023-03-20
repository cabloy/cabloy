const versionManager = require('./bean/version.manager.js');
const beanSummer = require('./bean/bean.summer.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // summer
    summer: {
      mode: 'ctx',
      bean: beanSummer,
      global: true,
    },
  };
  return beans;
};
