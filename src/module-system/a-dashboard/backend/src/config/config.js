// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // dashboard
  config.dashboard = {
    default: 'a-dashboard:dashboardDefault',
    home: 'a-dashboard:dashboardHome',
  };

  return config;
};
