// request.body
//   validate: module(optional), validator, schema(optional)
//   data:
const moduleInfo = module.info;
module.exports = class Middleware {
  async execute(options, next) {
    // must exists
    const validator = options.validator;
    if (!validator) this.ctx.throw.module(moduleInfo.relativeName, 1001);
    // params
    const module = options.module || this.ctx.module.info.relativeName;
    const schema = options.schema || (this.ctx.meta._validator && this.ctx.meta._validator.schema);
    const data = this.ctx.request.body[options.data || 'data'];
    // if error throw 422
    await this.ctx.bean.validation.validate({
      module,
      validator,
      schema,
      data,
      filterOptions: true,
    });
    // next
    await next();
  }
};
