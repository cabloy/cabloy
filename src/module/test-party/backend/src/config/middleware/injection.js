module.exports = () => {
  return async function injection(ctx, next) {

    ctx.meta.__plus = (a, b) => {
      return a + b;
    };

    // next
    await next();
  };
};
