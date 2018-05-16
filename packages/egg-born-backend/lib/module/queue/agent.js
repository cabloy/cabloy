const loadQueue = require('./queue.js');

module.exports = function(loader, modules) {

  // all queues
  const ebQueues = loader.app.meta.queues = {};

  // load queues
  loadQueues();

  // loadQueue
  loadQueue(loader.app);

  function loadQueues() {
    Object.keys(modules).forEach(key => {
      const module = modules[key];
      // module queues
      if (module.main.queues) {
        Object.keys(module.main.queues).forEach(queueKey => {
          const fullKey = `${module.info.relativeName}:${queueKey}`;
          const config = loader.app.meta.configs[module.info.relativeName].queues[queueKey];
          ebQueues[fullKey] = { config };
        });
      }
    });
  }

};
