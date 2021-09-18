const filterTabBasic = require('./schema/filterTabBasic.js');
const filterTabGeneral = require('./schema/filterTabGeneral.js');

module.exports = app => {
  const schemas = {};
  // filterTabBasic
  Object.assign(schemas, filterTabBasic(app));
  // filterTabGeneral
  Object.assign(schemas, filterTabGeneral(app));
  // ok
  return schemas;
};
