module.exports = (options, app) => {
  return async function (ctx, next) {
    // init instance
    await ctx.bean.instance.initInstance();
    // next
    await next();
  };
};
