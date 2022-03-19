const authWechat = require('./schema/authWechat.js');
const authWechatweb = require('./schema/authWechatweb.js');

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, authWechat(app));
  Object.assign(schemas, authWechatweb(app));
  return schemas;
};
