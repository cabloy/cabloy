const party = require('./model/party.js');
const partyType = require('./model/partyType.js');

module.exports = app => {
  const models = {
  };
  if (app.meta.isTest || app.meta.isLocal) {
    Object.assign(models, {
      party,
      partyType,
    });
  }
  return models;
};
