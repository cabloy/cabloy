const statsUser = require('./bean/stats.user.js');
const statsUserAlert = require('./bean/stats.userAlert.js');

module.exports = {
  // stats
  'stats.user': {
    bean: statsUser,
  },
  'stats.userAlert': {
    bean: statsUserAlert,
  },
};
