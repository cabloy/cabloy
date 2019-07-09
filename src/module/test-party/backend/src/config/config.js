// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  if (appInfo.env === 'unittest') {
    // startups
    config.startups = {
      startupAll: {
        type: 'worker',
        path: 'test/startupAll',
      },
      startupInstance: {
        type: 'worker',
        instance: true,
        path: 'test/startupInstance',
      },
    };
  }

  return config;
};
