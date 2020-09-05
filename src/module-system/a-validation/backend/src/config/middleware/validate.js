// request.body
//   validate: module(optional), validator, schema(optional)
//   data:
module.exports = (options2, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function validate(ctx, next, options) {
    // must exists
    const validator = options.validator;
    if (!validator) ctx.throw.module(moduleInfo.relativeName, 1001);
    // params
    const module = options.module || ctx.module.info.relativeName;
    const schema = options.schema || (ctx.meta._validator && ctx.meta._validator.schema);
    const data = ctx.request.body[options.data || 'data'];
    // if error throw 422
    await ctx.bean.validation.validate({
      module,
      validator,
      schema,
      data,
    });
    // next
    await next();
  };
};
