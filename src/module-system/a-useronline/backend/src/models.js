const userOnline = require('./model/userOnline.js');
const userOnlineHistory = require('./model/userOnlineHistory.js');

module.exports = app => {
  const models = {
    userOnline,
    userOnlineHistory,
  };
  return models;
};
