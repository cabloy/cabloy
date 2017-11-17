// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // schedules
  config.schedules = {
    versionCheck: {
      type: 'worker',
      immediate: true,
    },
  };

  return config;
};
