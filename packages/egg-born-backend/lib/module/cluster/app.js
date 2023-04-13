const VersionReadyFn = require('../version/ready.js');

module.exports = function (loader) {
  const app = loader.app;
  const versionReady = VersionReadyFn(app);
  // initialize
  versionReady.initialize();
  // egg-ready
  app.messenger.once('egg-ready', async () => {
    // version ready
    await versionReady.execute();
  });
  // eb_clear
  app.messenger.once('eb_clear', async data => {
    await app.meta.queue._clearWorkers();
    process.send({ to: 'master', action: 'eb_clear_done', data: { id: data.id } });
  });
};

// maybe cause some resources initialized more times
// async function __versionReady(app) {
//   try {
//     await versionReady(app);
//   } catch (err) {
//     console.error(err);
//     setTimeout(async () => {
//       await __versionReady(app);
//     }, app.config.versionReady.retry.timeout);
//   }
// }
