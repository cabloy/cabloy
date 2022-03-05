// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};
  // userOnline
  config.userOnline = {
    expired: 20 * 60 * 1000, // 20 minutes
  };
  return config;
};
