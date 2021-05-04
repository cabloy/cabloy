const local = require('./aop/local.js');

module.exports = app => {
  const aops = {};
  Object.assign(aops, {
    local: {
      match: 'local',
      mode: 'ctx',
      bean: local,
    },
  });
  return aops;
};
