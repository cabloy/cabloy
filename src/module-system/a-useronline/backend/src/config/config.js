// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};
  // userOnline
  config.userOnline = {
    expired: 5 * 60 * 1000, // 5 minutes
  };
  return config;
};
