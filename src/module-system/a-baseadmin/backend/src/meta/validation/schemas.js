const roleRight = require('./schema/roleRight.js');
const roleResourceRight = require('./schema/roleResourceRight.js');
const roleFieldsRight = require('./schema/roleFieldsRight.js');

const schemas = {};
Object.assign(schemas, roleRight);
Object.assign(schemas, roleResourceRight);
Object.assign(schemas, roleFieldsRight);
module.exports = schemas;
