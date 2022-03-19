const authWechat = require('./schema/authWechat.js');
const authWechatweb = require('./schema/authWechatweb.js');
const authWechatmini = require('./schema/authWechatmini.js');

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, authWechat(app));
  Object.assign(schemas, authWechatweb(app));
  Object.assign(schemas, authWechatmini(app));
  return schemas;
};
