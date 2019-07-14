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
  if (!ctx.req._parsedUrl) return;
  const path = ctx.req._parsedUrl.pathname.substr(4); // remove /api
  const hooks = ctx.app.meta.geto('hooks').geto(stage).geta(path);
  for (const hook of hooks) {
    await ctx.performAction({
      method: 'post',
      url: hook.route,
    });
  }
}
