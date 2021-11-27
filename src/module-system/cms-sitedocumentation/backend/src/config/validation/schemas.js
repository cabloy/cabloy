const document = require('./schema/document.js');

module.exports = app => {
  const schemas = {};
  // document
  Object.assign(schemas, document(app));
  // ok
  return schemas;
};
