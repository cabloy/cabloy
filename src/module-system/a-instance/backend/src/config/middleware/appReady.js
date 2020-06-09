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

module.exports = (options, app) => {
  return async function appReady(ctx, next) {
    if (!ctx.innerAccess && !app.meta.appReady) {
      await checkAppReady(app);
    }

    // next
    await next();
  };
};
