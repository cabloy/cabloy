// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    overtime: {
      bean: 'overtime',
    },
  };

  return config;
};
