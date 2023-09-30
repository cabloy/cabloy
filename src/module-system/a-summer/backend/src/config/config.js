// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // broadcasts
  config.broadcasts = {
    memDel: {
      bean: 'memDel',
    },
    memMultiDel: {
      bean: 'memMultiDel',
    },
    memClear: {
      bean: 'memClear',
    },
  };

  // summer
  config.summer = {
    enable: true,
  };

  return config;
};
