const queueRender = require('./bean/queue.render.js');
const startupRegisterAllWatchers = require('./bean/startup.registerAllWatchers.js');

module.exports = app => {
  const beans = {
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
