module.exports = () => {
  class Middleware {
    async execute(options, next) {
      await next();
    }
  }
  return Middleware;
};
