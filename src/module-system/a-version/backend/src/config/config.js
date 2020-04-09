// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    databaseInit: {
      path: 'version/databaseInitQueue',
    },
  };

  return config;
};
