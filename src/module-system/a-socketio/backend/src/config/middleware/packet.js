module.exports = (options, app) => {
  return async (ctx, next) => {
    await next();
  };
};
