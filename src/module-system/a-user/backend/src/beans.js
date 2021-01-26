const statsUser = require('./bean/stats.user.js');
module.exports = app => {
  const beans = {
    // stats
    'stats.user': {
      mode: 'ctx',
      bean: statsUser,
    },
  };
  return beans;
};
