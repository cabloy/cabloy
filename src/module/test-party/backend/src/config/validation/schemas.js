const formTest = require('./schema/formTest.js');
const party = require('./schema/party.js');
const settings = require('./schema/settings.js');

module.exports = app => {
  const schemas = {};
  // formTest
  Object.assign(schemas, formTest(app));
  // party
  Object.assign(schemas, party(app));
  // settings
  Object.assign(schemas, settings(app));
  // ok
  return schemas;
};
