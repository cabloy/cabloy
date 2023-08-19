const fields_parseSchema = require('./bean.fields/bean.fields_parseSchema.js');
const fields_fieldsRight = require('./bean.fields/bean.fields_fieldsRight.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(
    fields_parseSchema,
    [
      fields_fieldsRight, //
    ],
    ctx
  );
};
