// MaxListenersExceededWarning
// const eventAppReady = 'eb:event:appReady';

// function checkAppReady(app) {
//   return new Promise(resolve => {
//     app.once(eventAppReady, () => {
//       resolve();
//     });
//   });
// }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkAppReady(app) {
  while (!app.meta.appReady) {
    await sleep(300);
  }
}

module.exports = ctx => {
  class Middleware {
    async execute(options, next) {
      if (!ctx.innerAccess && !ctx.app.meta.appReady) {
        await checkAppReady(ctx.app);
      }
      // next
      await next();
    }
  }
  return Middleware;
};
