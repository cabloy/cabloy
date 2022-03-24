const authDingtalkadmin = require('./schema/authDingtalkadmin.js');
const authDingtalkSelfBuilt = require('./schema/authDingtalkSelfBuilt.js');
const authDingtalkmini = require('./schema/authDingtalkmini.js');
const settingsInstance = require('./schema/settingsInstance.js');

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, authDingtalkadmin(app));
  Object.assign(schemas, authDingtalkSelfBuilt(app));
  Object.assign(schemas, authDingtalkmini(app));
  Object.assign(schemas, settingsInstance(app));
  return schemas;
};
