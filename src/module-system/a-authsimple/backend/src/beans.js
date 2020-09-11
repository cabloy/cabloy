const versionManager = require('./bean/version.manager.js');
const eventAccountMigration = require('./bean/event.accountMigration.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // event
    'event.accountMigration': {
      mode: 'ctx',
      bean: eventAccountMigration,
    },
  };
  return beans;
};
