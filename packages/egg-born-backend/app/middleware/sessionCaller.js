module.exports = (options, app) => {
  return async function (ctx, next) {
    // session
    if (ctx.ctxCaller && ctx.ctxCaller.session) {
      delegateSession(ctx, ctx.ctxCaller);
    }
    // next
    await next();
    // session
    if (ctx.ctxCaller && ctx.ctxCaller.session) {
      delegateSession(ctx.ctxCaller, ctx);
    }
  };
};

function delegateSession(ctxTo, ctxFrom) {
  Object.keys(ctxFrom.session).forEach(key => {
    if (key === 'isNew') return;
    if (key[0] === '_') return;
    ctxTo.session[key] = ctxFrom.session[key];
  });
}
