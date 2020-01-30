const BroadcastClientFn = require('./broadcastClient.js');

module.exports = function(loader, modules) {

  // broadcast
  loader.app.meta.broadcast = new (BroadcastClientFn(loader.app))();

  // all broadcasts
  const ebBroadcasts = loader.app.meta.broadcasts = {};

  // load broadcasts
  loadBroadcasts();

  function loadBroadcasts() {
    Object.keys(modules).forEach(key => {
      const module = modules[key];
      const config = loader.app.meta.configs[module.info.relativeName];
      // module broadcasts
      if (config.broadcasts) {
        Object.keys(config.broadcasts).forEach(broadcastKey => {
          const fullKey = `${module.info.relativeName}:${broadcastKey}`;
          ebBroadcasts[fullKey] = { config: config.broadcasts[broadcastKey] };
        });
      }
    });
  }

};
