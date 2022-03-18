const versionManager = require('./bean/version.manager.js');
const eventLoginInfo = require('./bean/event.loginInfo.js');
const eventAccountMigration = require('./bean/event.accountMigration.js');
const middlewareInWechat = require('./bean/middleware.inWechat.js');
const authProviderWechat = require('./bean/auth.provider.wechat.js');
const authProviderWechatWeb = require('./bean/auth.provider.wechatWeb.js');
const authProviderWechatMini = require('./bean/auth.provider.wechatMini.js');
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
    'auth.provider.wechatWeb': {
      mode: 'ctx',
      bean: authProviderWechatWeb,
    },
    'auth.provider.wechatMini': {
      mode: 'ctx',
      bean: authProviderWechatMini,
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
