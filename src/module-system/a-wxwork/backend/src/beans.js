const eventLoginInfo = require('./bean/event.loginInfo.js');
const eventAccountMigration = require('./bean/event.accountMigration.js');
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
    // global
    wxwork: {
      mode: 'ctx',
      bean: beanWxwork,
      global: true,
    },
  };
  return beans;
};
