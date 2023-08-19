const fields_parseSchema = require('./bean.fields/bean.fields_parseSchema.js');
// const fields_parseSchema = require('./bean.fields/bean.fields_parseSchema.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(
    fields_parseSchema,
    [
      // atomAction_flow, //
    ],
    ctx
  );
};
