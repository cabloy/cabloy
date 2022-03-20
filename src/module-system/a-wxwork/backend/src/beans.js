const versionManager = require('./bean/version.manager.js');
const eventLoginInfo = require('./bean/event.loginInfo.js');
const eventAccountMigration = require('./bean/event.accountMigration.js');
const queueContacts = require('./bean/queue.contacts.js');
const middlewareInWxwork = require('./bean/middleware.inWxwork.js');
const ioChannelApp = require('./bean/io.channel.app.js');
const authProviderWxwork = require('./bean/auth.provider.wxwork.js');
const authProviderWxworkweb = require('./bean/auth.provider.wxworkweb.js');
const authProviderWxworkmini = require('./bean/auth.provider.wxworkmini.js');
const localHelper = require('./bean/local.helper.js');
const localUtils = require('./bean/local.utils.js');
const beanWxwork = require('./bean/bean.wxwork.js');

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
    // queue
    'queue.contacts': {
      mode: 'app',
      bean: queueContacts,
    },
    // middleware
    'middleware.inWxwork': {
      mode: 'ctx',
      bean: middlewareInWxwork,
    },
    // io
    'io.channel.app': {
      mode: 'ctx',
      bean: ioChannelApp,
    },
    // auth.provider
    'auth.provider.wxwork': {
      mode: 'ctx',
      bean: authProviderWxwork,
    },
    'auth.provider.wxworkweb': {
      mode: 'ctx',
      bean: authProviderWxworkweb,
    },
    'auth.provider.wxworkmini': {
      mode: 'ctx',
      bean: authProviderWxworkmini,
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
    wxwork: {
      mode: 'ctx',
      bean: beanWxwork,
      global: true,
    },
  };
  return beans;
};
