const eventLoginInfo = require('./bean/event.loginInfo.js');
const eventAccountMigration = require('./bean/event.accountMigration.js');
const beanWechat = require('./bean/bean.wechat.js');

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
    wechat: {
      mode: 'ctx',
      bean: beanWechat,
      global: true,
    },
  };
  return beans;
};
