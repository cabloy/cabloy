const constant = require('../../base/constants.js');

module.exports = function(loader) {

  // ready
  let _ready = false;
  const pids = {};

  // messenger
  loader.app.meta.messenger.addProvider({
    name: 'appReady',
    handler: data => {
      pids[data.pid] = true;
      if (!_ready) {
        _ready = true;
        // for agent: event: appReady
        loader.app.emit(constant.event.appReady);
      }
    },
  });

};
