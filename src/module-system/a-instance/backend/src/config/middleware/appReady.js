const eventAppReady = 'eb:event:appReady';

function checkAppReady(app) {
  return new Promise(resolve => {
    app.once(eventAppReady, () => {
      resolve();
    });
  });
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
