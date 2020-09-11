const versionManager = require('./bean/version.manager.js');
const queueRender = require('./bean/queue.render.js');
const startupRegisterAllWatchers = require('./bean/startup.registerAllWatchers.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // queue
    'queue.render': {
      mode: 'app',
      bean: queueRender,
    },
    // startup
    'startup.registerAllWatchers': {
      mode: 'app',
      bean: startupRegisterAllWatchers,
    },
  };
  return beans;
};
