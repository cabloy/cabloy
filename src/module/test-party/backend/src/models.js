const party = require('./model/party.js');
const partyType = require('./model/partyType.js');
const partyPublic = require('./model/partyPublic.js');

module.exports = app => {
  const models = {
  };
  if (app.meta.isTest || app.meta.isLocal) {
    Object.assign(models, {
      party,
      partyType,
      partyPublic,
    });
  }
  return models;
};
