const statsUserRed = require('./bean/stats.userRed.js');
const statsUserOrange = require('./bean/stats.userOrange.js');

module.exports = app => {
  const beans = {
    // stats
    'stats.userRed': {
      mode: 'ctx',
      bean: statsUserRed,
    },
    'stats.userOrange': {
      mode: 'ctx',
      bean: statsUserOrange,
    },
  };
  return beans;
};
