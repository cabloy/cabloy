const authOpen = require('./model/authOpen.js');

module.exports = app => {
  const models = {
    authOpen,
  };
  return models;
};
