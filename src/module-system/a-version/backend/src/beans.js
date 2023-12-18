const versionManager = require('./bean/version.manager.js');
const localVersion = require('./bean/local.version.js');
const startupWorkerAlive = require('./bean/startup.workerAlive.js');
const startupDatabaseInit = require('./bean/startup.databaseInit.js');
const startupDatabaseName = require('./bean/startup.databaseName.js');
const startupInstanceInit = require('./bean/startup.instanceInit.js');
const broadcastColumnsClear = require('./bean/broadcast.columnsClear.js');
const beanWorker = require('./bean/bean.worker.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // local
  'local.version': {
    bean: localVersion,
  },
  // startup
  'startup.workerAlive': {
    bean: startupWorkerAlive,
  },
  'startup.databaseInit': {
    bean: startupDatabaseInit,
  },
  'startup.databaseName': {
    bean: startupDatabaseName,
  },
  'startup.instanceInit': {
    bean: startupInstanceInit,
  },
  // broadcast
  'broadcast.columnsClear': {
    bean: broadcastColumnsClear,
  },
  // global
  worker: {
    bean: beanWorker,
    global: true,
  },
};
