// request.body
//   validate: module(optional), validator, schema(optional)
//   data:
module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async execute(options, next) {
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
    }
  }
  return Middleware;
};
