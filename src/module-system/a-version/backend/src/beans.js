const versionManager = require('./bean/version.manager.js');
const localVersion = require('./bean/local.version.js');
const startupWorkerAlive = require('./bean/startup.workerAlive.js');
const startupDatabaseInit = require('./bean/startup.databaseInit.js');
const startupDatabaseName = require('./bean/startup.databaseName.js');
const startupInstanceInit = require('./bean/startup.instanceInit.js');
const broadcastColumnsClear = require('./bean/broadcast.columnsClear.js');
const beanWorker = require('./bean/bean.worker.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // local
    'local.version': {
      bean: localVersion,
    },
    // startup
    'startup.workerAlive': {
      mode: 'app',
      bean: startupWorkerAlive,
    },
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
    // broadcast
    'broadcast.columnsClear': {
      mode: 'app',
      bean: broadcastColumnsClear,
    },
    // global
    worker: {
      mode: 'app',
      bean: beanWorker,
      global: true,
    },
  };
  return beans;
};
