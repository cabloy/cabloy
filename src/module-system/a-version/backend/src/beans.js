const versionManager = require('./bean/version.manager.js');
const localVersion = require('./bean/local.version.js');
const startupDatabaseInit = require('./bean/startup.databaseInit.js');
const startupDatabaseName = require('./bean/startup.databaseName.js');
const startupInstanceInit = require('./bean/startup.instanceInit.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // local
    'local.version': {
      mode: 'app',
      bean: localVersion,
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
    'startup.instanceInit': {
      mode: 'app',
      bean: startupInstanceInit,
    },
  };
  return beans;
};
