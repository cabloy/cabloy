module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async execute(options, next) {
      // instance
      const instance = await ctx.bean.instance.get({ subdomain: ctx.subdomain });

      // check if disabled
      if (!ctx.innerAccess && instance.disabled) {
        // locked
        return ctx.throw(423);
      }

      // try to save host/protocol to config
      if (ctxHostValid(ctx)) {
        if (!instance.config['a-base']) instance.config['a-base'] = {};
        const aBase = instance.config['a-base'];
        if (aBase.host !== ctx.host || aBase.protocol !== ctx.protocol) {
          aBase.host = ctx.host;
          aBase.protocol = ctx.protocol;
          // update
          await ctx.db.update('aInstance', {
            id: instance.id,
            config: JSON.stringify(instance.config) });
          // broadcast
          ctx.app.meta.broadcast.emit({
            subdomain: ctx.subdomain,
            module: 'a-instance',
            broadcastName: 'resetCache',
            data: null,
          });
        }
      }

      // ok
      ctx.instance = instance;

      // next
      await next();
    }
  }
  return Middleware;
};

function ctxHostValid(ctx) {
  return !ctx.innerAccess && ctx.host && ctx.protocol && ctx.host !== '127.0.0.1' && ctx.host !== 'localhost';
}
