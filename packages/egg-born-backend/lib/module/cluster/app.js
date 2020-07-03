const versionReady = require('../version/ready.js');

module.exports = function(loader) {
  // egg-ready
  loader.app.messenger.once('egg-ready', async () => {
    // version ready
    await versionReady(loader.app);
  });
  // eb_clear
  loader.app.messenger.once('eb_clear', async data => {
    await loader.app.meta.queue._clearWorkers();
    process.send({ to: 'master', action: 'eb_clear_done', data: { id: data.id } });
  });
};
