// MaxListenersExceededWarning
// const eventAppReady = 'eb:event:appReady';

// function checkAppReady(app) {
//   return new Promise(resolve => {
//     app.once(eventAppReady, () => {
//       resolve();
//     });
//   });
// }

module.exports = ctx => {
  class Middleware {
    async execute(options, next) {
      // check appReady
      if (!ctx.innerAccess) {
        await ctx.bean.instance.checkAppReady();
      }
      // next
      await next();
    }
  }
  return Middleware;
};
