const eventAccountMigration = require('./bean/eventAccountMigration.js');

module.exports = app => {
  const beans = {
    'event.accountMigration': {
      mode: 'ctx',
      bean: eventAccountMigration,
    },
  };
  return beans;
};
