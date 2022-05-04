const filterTabBasic = require('./schema/filterTabBasic.js');
const filterTabGeneral = require('./schema/filterTabGeneral.js');
const layout = require('./schema/layout.js');

module.exports = app => {
  const schemas = {};
  // filterTabBasic
  Object.assign(schemas, filterTabBasic(app));
  // filterTabGeneral
  Object.assign(schemas, filterTabGeneral(app));
  // layout
  Object.assign(schemas, layout(app));
  // ok
  return schemas;
};
