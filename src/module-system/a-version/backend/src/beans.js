const localVersion = require('./bean/local.version.js');
const versionManager = require('./bean/version.manager.js');
const startupDatabaseInit = require('./bean/startup.databaseInit.js');
const startupDatabaseName = require('./bean/startup.databaseName.js');

module.exports = app => {
  const beans = {
    // local
    'local.version': {
      mode: 'app',
      bean: localVersion,
    },
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // startup
    'startup.databaseInit': {
      mode: 'app',
      bean: startupDatabaseInit,
    },
    'startup.databaseName': {
      mode: 'app',
      bean: startupDatabaseName,
    },
  };
  return beans;
};
