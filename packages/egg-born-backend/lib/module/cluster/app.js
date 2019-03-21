const qs = require('querystring');
const database = require('../version/database.js');
const versionCheck = require('../version/check.js');
const versionReady = require('../version/ready.js');
const constant = require('../../base/constants.js');

module.exports = function(loader, modules) {

  let _firstCheck = false;
  let _versionReady = false;

  // messenger
  loader.app.meta.messenger.addProvider({
    name: 'versionCheck',
    handler: async () => {
      _firstCheck = true;
      await database(loader.app);
      await versionCheck(loader.app);
    },
  });
  loader.app.meta.messenger.addProvider({
    name: 'versionReady',
    handler: async () => {
      await handleVersionReady();
    },
  });

  // egg-ready
  loader.app.messenger.once('egg-ready', () => {
    loader.app.meta.messenger.callAgent({
      name: 'versionReadyAsk',
      data: null,
    }, async info => {
      if (info.data) {
        await handleVersionReady();
      }
    });
  });

  async function handleVersionReady() {
    if (!_versionReady) {
      _versionReady = true;
      if (!_firstCheck) {
        _firstCheck = true;
        // database
        await database(loader.app);
      }
      // version ready
      await versionReady(loader.app);
      // event: appReady
      loader.app.emit(constant.event.appReady);
    }
  }

};
