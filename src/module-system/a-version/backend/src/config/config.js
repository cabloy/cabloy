// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // startups
  config.startups = {
    databaseInit: {
      path: 'version/databaseInitStartup',
    },
  };

  // queues
  config.queues = {
    databaseInit: {
      path: 'version/databaseInitQueue',
    },
  };

  return config;
};
