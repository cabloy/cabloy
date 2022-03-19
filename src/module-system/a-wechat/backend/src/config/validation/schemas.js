const authWechat = require('./schema/authWechat.js');

module.exports = app => {
  const schemas = {};
  // authWechat
  Object.assign(schemas, authWechat(app));
  // ok
  return schemas;
};
