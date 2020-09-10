const localVersion = require('./bean/local.version.js');
const startupDatabaseInit = require('./bean/startup.databaseInit.js');
const startupDatabaseName = require('./bean/startup.databaseName.js');

module.exports = app => {
  const beans = {
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
  };
  return beans;
};
