const fields_base = require('./bean.fields/bean.fields_base.js');
const fields_parseSchema = require('./bean.fields/bean.fields_parseSchema.js');
const fields_fieldsRight = require('./bean.fields/bean.fields_fieldsRight.js');

module.exports = module.meta.util.mixinClasses(fields_base, [
  fields_parseSchema,
  fields_fieldsRight, //
]);
