// const authWechat = require('./schema/authWechat.js');
// const authWechatweb = require('./schema/authWechatweb.js');
// const authWechatmini = require('./schema/authWechatmini.js');
const settingsInstance = require('./schema/settingsInstance.js');

module.exports = app => {
  const schemas = {};
  // Object.assign(schemas, authWechat(app));
  // Object.assign(schemas, authWechatweb(app));
  // Object.assign(schemas, authWechatmini(app));
  Object.assign(schemas, settingsInstance(app));
  return schemas;
};
