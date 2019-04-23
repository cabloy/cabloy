const progress = require('./model/progress.js');

module.exports = app => {
  const models = {
    progress,
  };
  return models;
};
