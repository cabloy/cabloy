const versionManager = require('./bean/version.manager.js');
const eventLoginInfo = require('./bean/event.loginInfo.js');
const eventAccountMigration = require('./bean/event.accountMigration.js');
const middlewareInWechat = require('./bean/middleware.inWechat.js');
const beanWechat = require('./bean/bean.wechat.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // event
    'event.loginInfo': {
      mode: 'ctx',
      bean: eventLoginInfo,
    },
    'event.accountMigration': {
      mode: 'ctx',
      bean: eventAccountMigration,
    },
    // middleware
    'middleware.inWechat': {
      mode: 'ctx',
      bean: middlewareInWechat,
    },
    // global
    wechat: {
      mode: 'ctx',
      bean: beanWechat,
      global: true,
    },
  };
  return beans;
};
