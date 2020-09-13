// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // startups
  config.startups = {
    databaseInit: {
      bean: 'databaseInit',
      debounce: true,
      queue: 'databaseInit',
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

  // queues
  config.queues = {
    databaseInit: {
      bean: {
        module: 'a-base',
        name: 'startup',
      },
    },
  };

  return config;
};
