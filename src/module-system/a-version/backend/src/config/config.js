// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // startups
  config.startups = {
    workerAlive: {
      bean: 'workerAlive',
    },
    databaseInit: {
      bean: 'databaseInit',
      debounce: true,
    },
    databaseName: {
      bean: 'databaseName',
    },
    instanceInit: {
      bean: 'instanceInit',
      instance: true,
      debounce: true,
    },
  };

  // broadcasts
  config.broadcasts = {
    columnsClear: {
      bean: 'columnsClear',
    },
  };

  // worker
  config.worker = {
    alive: {
      timeout: 7000,
    },
  };

  return config;
};
