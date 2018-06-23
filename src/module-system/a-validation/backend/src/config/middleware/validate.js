// request.body
//   validate: module(optional), validator, schema(optional)
//   data:
module.exports = (options, app) => {
  return async function validate(ctx, next) {
    // ignore
    const validator = options.validator || (ctx.request.body.validate && ctx.request.body.validate.validator);
    if (!validator) return await next();
    // params
    const module = options.module || (ctx.request.body.validate && ctx.request.body.validate.module) || ctx.module.info.relativeName;
    const schema = options.schema || (ctx.request.body.validate && ctx.request.body.validate.schema);
    const data = ctx.request.body[options.data || 'data'];
    // if error throw 422
    await ctx.meta.validation.validate({
      module,
      validator,
      schema,
      data,
    });
    // next
    await next();
  };
};
