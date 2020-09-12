const instance = require('./model/instance.js');

module.exports = app => {
  const models = {
    instance,
  };
  return models;
};
