// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // startups
  config.startups = {
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

  return config;
};
