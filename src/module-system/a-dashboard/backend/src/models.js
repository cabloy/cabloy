const profile = require('./model/profile.js');

module.exports = app => {
  const models = {
    profile,
  };
  return models;
};
