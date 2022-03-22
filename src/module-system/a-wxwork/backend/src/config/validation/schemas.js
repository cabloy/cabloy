const authWxworkSelfBuilt = require('./schema/authWxworkSelfBuilt.js');
const authWxworkContacts = require('./schema/authWxworkContacts.js');
// const authWechatweb = require('./schema/authWechatweb.js');
// const authWechatmini = require('./schema/authWechatmini.js');
const settingsInstance = require('./schema/settingsInstance.js');

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, authWxworkSelfBuilt(app));
  Object.assign(schemas, authWxworkContacts(app));
  // Object.assign(schemas, authWechatweb(app));
  // Object.assign(schemas, authWechatmini(app));
  Object.assign(schemas, settingsInstance(app));
  return schemas;
};
