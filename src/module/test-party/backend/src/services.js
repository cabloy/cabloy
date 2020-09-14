const party = require('./service/party.js');

module.exports = app => {
  const services = {
  };
  if (app.meta.isTest || app.meta.isLocal) {
    Object.assign(services, {
      party,
    });
  }
  return services;
};
