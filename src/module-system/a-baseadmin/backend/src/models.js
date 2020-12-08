const authProvider = require('./model/authProvider.js');

module.exports = app => {
  const models = {
    authProvider,
  };
  return models;
};
