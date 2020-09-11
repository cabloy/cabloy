const party = require('./service/party.js');
const partyPublic = require('./service/partyPublic.js');

module.exports = app => {
  const services = {
  };
  if (app.meta.isTest || app.meta.isLocal) {
    Object.assign(services, {
      party,
      partyPublic,
    });
  }
  return services;
};
