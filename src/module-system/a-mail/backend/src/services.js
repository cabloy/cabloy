const mail = require('./service/mail.js');

module.exports = app => {
  const services = {
    mail,
  };
  return services;
};
