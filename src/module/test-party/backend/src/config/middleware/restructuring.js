module.exports = () => {
  return async function restructuring(ctx, next) {

    const { a, b } = ctx.request.body;
    ctx.request.body.a = parseInt(a);
    ctx.request.body.b = parseInt(b);

    // next
    await next();
  };
};
