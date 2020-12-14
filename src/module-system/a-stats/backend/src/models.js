const stats = require('./model/stats.js');

module.exports = app => {
  const models = {
    stats,
  };
  return models;
};
