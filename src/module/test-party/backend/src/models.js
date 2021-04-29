const party = require('./model/party.js');
const partyType = require('./model/partyType.js');

module.exports = app => {
  const models = {
  };
  Object.assign(models, {
    party,
    partyType,
  });
  return models;
};
