const versionManager = require('./bean/version.manager.js');
const beanMail = require('./bean/bean.mail.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // global
    mail: {
      mode: 'ctx',
      bean: beanMail,
      global: true,
    },
  };
  return beans;
};
