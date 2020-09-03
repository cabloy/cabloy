const eventAccountMigration = require('./bean/event.accountMigration.js');

module.exports = app => {
  const beans = {
    'event.accountMigration': {
      mode: 'ctx',
      bean: eventAccountMigration,
    },
  };
  return beans;
};
