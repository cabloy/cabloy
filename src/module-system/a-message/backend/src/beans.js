const versionManager = require('./bean/version.manager.js');
const beanMessage = require('./bean/bean.message.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // global
    message: {
      mode: 'ctx',
      bean: beanMessage,
      global: true,
    },
  };
  return beans;
};
