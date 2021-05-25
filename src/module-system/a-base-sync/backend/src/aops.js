const category = require('./aop/category.js');
const local = require('./aop/local.js');

module.exports = app => {
  const aops = {};
  Object.assign(aops, {
    category: {
      match: 'category',
      mode: 'ctx',
      bean: category,
    },
    local: {
      match: 'local',
      mode: 'ctx',
      bean: local,
    },
  });
  return aops;
};
