const constant = require('../../base/constants.js');
const util = require('../util.js');

module.exports = function(loader, modules) {

  // ready
  let _ready = false;

  // messenger
  loader.app.meta.messenger.addProvider({
    name: 'versionReadyAsk',
    handler: () => {
      return _ready;
    },
  });

  // egg-ready
  loader.app.messenger.once('egg-ready', async () => {
    // call
    loader.app.meta.messenger.callRandom({
      name: 'versionCheck',
      data: null,
    }, info => {
      if (info.err) throw util.createError(info.err);
      // for agent: event: appReady
      loader.app.emit(constant.event.appReady);
      // version ready
      loader.app.meta.messenger.callAll({ name: 'versionReady' });
      // ready
      _ready = true;
    });
  });

};
