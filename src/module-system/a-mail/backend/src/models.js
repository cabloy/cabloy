const mail = require('./model/mail.js');

module.exports = app => {
  const models = {
    mail,
  };
  return models;
};
