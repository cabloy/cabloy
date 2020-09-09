const eventLoginInfo = require('./bean/event.loginInfo.js');
const eventAccountMigration = require('./bean/event.accountMigration.js');
const queueContacts = require('./bean/queue.contacts.js');
const beanWxwork = require('./bean/bean.wxwork.js');

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
    // global
    wxwork: {
      mode: 'ctx',
      bean: beanWxwork,
      global: true,
    },
  };
  return beans;
};
