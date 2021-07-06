const party = require('./service/party.js');

module.exports = app => {
  const services = {};
  Object.assign(services, {
    party,
  });
  return services;
};
