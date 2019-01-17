module.exports = () => {
  return async function hook(ctx, next) {
    // before
    await invokeHooks(ctx, 'before');
    // next
    await next();
    // after
    await invokeHooks(ctx, 'after');
  };
};

async function invokeHooks(ctx, stage) {
  if (!ctx.route) return;
  const path = `/${ctx.route.pid}/${ctx.route.module}/${ctx.route.controller}/${ctx.route.action}`;
  const hooks = ctx.app.meta.geto('hooks').geto(stage).geta(path);
  for (const hook of hooks) {
    await ctx.performAction({
      method: 'post',
      url: hook.route,
    });
  }
}
