const database = require('../version/database.js');
const versionCheck = require('../version/check.js');
const versionReady = require('../version/ready.js');
const constant = require('../../base/constants.js');

module.exports = function(loader) {

  async function _databaseInit() {
    await database(loader.app);
    await versionCheck(loader.app);
  }

  async function databaseInit(app) {
    // limiter
    const limiterOptions = {
      maxConcurrent: 1,
      minTime: null,
      reservoir: null,
      id: `${app.name}:databaseInit`,
      clearDatastore: !!app.meta.isTest,
    };
    const limiter = app.meta.limiter.create(limiterOptions);
    const jobOptions = { expiration: 1000 * 60 };
    await limiter.schedule(jobOptions, () => _databaseInit());
    limiter.disconnect();
  }

  // egg-ready
  loader.app.messenger.once('egg-ready', async () => {
    // database init
    await databaseInit(loader.app);
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
