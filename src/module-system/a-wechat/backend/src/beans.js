const versionManager = require('./bean/version.manager.js');
const eventLoginInfo = require('./bean/event.loginInfo.js');
const eventAccountMigration = require('./bean/event.accountMigration.js');
const middlewareInWechat = require('./bean/middleware.inWechat.js');
const authProviderWechat = require('./bean/auth.provider.wechat.js');
const authProviderWechatweb = require('./bean/auth.provider.wechatweb.js');
const authProviderWechatmini = require('./bean/auth.provider.wechatmini.js');
const localHelper = require('./bean/local.helper.js');
const localUtils = require('./bean/local.utils.js');
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
    // auth.provider
    'auth.provider.wechat': {
      mode: 'ctx',
      bean: authProviderWechat,
    },
    'auth.provider.wechatweb': {
      mode: 'ctx',
      bean: authProviderWechatweb,
    },
    'auth.provider.wechatmini': {
      mode: 'ctx',
      bean: authProviderWechatmini,
    },
    // local
    'local.helper': {
      mode: 'ctx',
      bean: localHelper,
    },
    'local.utils': {
      mode: 'ctx',
      bean: localUtils,
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
