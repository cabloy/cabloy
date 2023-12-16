const filterTabBasic = require('./schema/filterTabBasic.js');
const filterTabGeneral = require('./schema/filterTabGeneral.js');
const layout = require('./schema/layout.js');

const schemas = {};
// filterTabBasic
Object.assign(schemas, filterTabBasic);
// filterTabGeneral
Object.assign(schemas, filterTabGeneral);
// layout
Object.assign(schemas, layout);
// ok
module.exports = schemas;
