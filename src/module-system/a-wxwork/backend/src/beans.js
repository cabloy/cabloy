const eventLoginInfo = require('./bean/eventLoginInfo.js');
const eventAccountMigration = require('./bean/eventAccountMigration.js');

module.exports = app => {
  const beans = {
    'event.loginInfo': {
      mode: 'ctx',
      bean: eventLoginInfo,
    },
    'event.accountMigration': {
      mode: 'ctx',
      bean: eventAccountMigration,
    },
  };
  return beans;
};
