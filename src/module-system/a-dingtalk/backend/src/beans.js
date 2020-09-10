const eventLoginInfo = require('./bean/event.loginInfo.js');
const eventAccountMigration = require('./bean/event.accountMigration.js');
const queueContacts = require('./bean/queue.contacts.js');
const startupRegisterBusinessCallbackList = require('./bean/startup.registerBusinessCallbackList.js');
const middlewareInDingtalk = require('./bean/middleware.inDingtalk.js');
const beanDingtalk = require('./bean/bean.dingtalk.js');

module.exports = app => {
  const beans = {
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
    // startup
    'startup.registerBusinessCallbackList': {
      mode: 'app',
      bean: startupRegisterBusinessCallbackList,
    },
    // middleware
    'middleware.inDingtalk': {
      mode: 'ctx',
      bean: middlewareInDingtalk,
    },
    // global
    dingtalk: {
      mode: 'ctx',
      bean: beanDingtalk,
      global: true,
    },
  };
  return beans;
};
