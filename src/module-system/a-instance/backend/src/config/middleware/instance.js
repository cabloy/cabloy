module.exports = () => {
  return async function instance(ctx, next) {

    const timeout = ctx.config.module('a-instance').cache.timeout;
    let instance = timeout > 0 ? ctx.cache.mem.get('instance') : null;
    if (!instance) {
      instance = await ctx.db.get('aInstance', { name: ctx.subdomain });
      if (instance && timeout > 0) {
        ctx.cache.mem.set('instance', instance, timeout);
      }
    }

    if (!/\/version\/init/.test(ctx.request.url) && (!instance || instance.disabled)) {
      ctx.throw(423); // locked
    }

    ctx.instance = instance;

    // next
    await next();
  };
};
