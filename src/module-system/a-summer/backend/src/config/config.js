// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // broadcasts
  config.broadcasts = {
    memDel: {
      bean: 'memDel',
    },
    // memClear: {
    //   bean: 'memClear',
    // },
  };

  return config;
};
