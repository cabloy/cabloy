const auth = require('./schema/auth.js');
const aliyun = require('./schema/aliyun.js');

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, auth(app), aliyun(app));
  return schemas;
};
