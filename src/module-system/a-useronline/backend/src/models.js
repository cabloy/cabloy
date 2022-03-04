const userOnline = require('./model/userOnline.js');

module.exports = app => {
  const models = {
    userOnline,
  };
  return models;
};
