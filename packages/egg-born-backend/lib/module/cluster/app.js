const versionReady = require('../version/ready.js');
const constant = require('../../base/constants.js');

module.exports = function(loader) {
  // egg-ready
  loader.app.messenger.once('egg-ready', async () => {
    // database init
    await loader.app.meta.queue.pushAsync({
      module: 'a-version',
      queueName: 'databaseInit',
      data: null,
    });
    // version ready
    await versionReady(loader.app);
    // event: appReady
    loader.app.emit(constant.event.appReady);
    // event to agent
    loader.app.meta.messenger.callAgent({
      name: 'appReady',
      data: { pid: process.pid },
    });
  });

};
