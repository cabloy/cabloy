// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};
  // userOnline
  config.userOnline = {
    expired: 10 * 60 * 1000, // 10 minutes
  };
  return config;
};
