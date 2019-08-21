module.exports = () => {
  return async function interception(ctx, next) {

    const { a, b } = ctx.request.body;
    if (a === undefined || b === undefined) return ctx.throw(1002); // 1002: 'Incomplete Parameters'

    // next
    await next();
  };
};
