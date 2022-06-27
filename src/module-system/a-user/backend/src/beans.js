const statsUser = require('./bean/stats.user.js');
const statsUserAlert = require('./bean/stats.userAlert.js');

module.exports = app => {
  const beans = {
    // stats
    'stats.user': {
      mode: 'ctx',
      bean: statsUser,
    },
    'stats.userAlert': {
      mode: 'ctx',
      bean: statsUserAlert,
    },
  };
  return beans;
};
