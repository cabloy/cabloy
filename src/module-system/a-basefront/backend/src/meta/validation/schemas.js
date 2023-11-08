const atomInfo = require('./schema/atomInfo.js');

module.exports = app => {
  const schemas = {};
  // formTest
  Object.assign(schemas, atomInfo(app));
  return schemas;
};
