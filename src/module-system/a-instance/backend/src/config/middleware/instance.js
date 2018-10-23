const require3 = require('require3');
const extend = require3('extend2');

module.exports = () => {
  return async function instance(ctx, next) {

    const timeout = ctx.config.module('a-instance').cache.timeout;
    let instance = timeout > 0 ? ctx.cache.mem.get('instance') : null;
    if (!instance) {
      instance = await ctx.db.get('aInstance', { name: ctx.subdomain });
      if (instance) {
        // config
        instance.config = JSON.parse(instance.config);
        // extend
        if (!ctx.app.meta._configsOriginal) ctx.app.meta._configsOriginal = extend(true, {}, ctx.app.meta.configs);
        ctx.app.meta.configs = extend(true, {}, ctx.app.meta._configsOriginal, instance.config);
        // cache
        if (timeout > 0) {
          ctx.cache.mem.set('instance', instance, timeout);
        }
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
