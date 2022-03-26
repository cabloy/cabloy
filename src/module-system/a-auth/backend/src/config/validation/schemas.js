const oauth2 = require('./schema/oauth2.js');

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, oauth2(app));
  return schemas;
};
