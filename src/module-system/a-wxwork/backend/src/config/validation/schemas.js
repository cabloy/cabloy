const authWxworkSelfBuilt = require('./schema/authWxworkSelfBuilt.js');
const authWxworkContacts = require('./schema/authWxworkContacts.js');
const authWxworkmini = require('./schema/authWxworkmini.js');
const settingsInstance = require('./schema/settingsInstance.js');

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, authWxworkSelfBuilt(app));
  Object.assign(schemas, authWxworkContacts(app));
  Object.assign(schemas, authWxworkmini(app));
  Object.assign(schemas, settingsInstance(app));
  return schemas;
};
