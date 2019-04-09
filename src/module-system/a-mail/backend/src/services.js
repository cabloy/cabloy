const version = require('./service/version.js');
const mail = require('./service/mail.js');

module.exports = app => {
  const services = {
    version,
    mail,
  };
  return services;
};
