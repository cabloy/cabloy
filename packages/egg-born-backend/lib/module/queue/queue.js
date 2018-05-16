const QueueClientFn = require('./queueClient.js');

module.exports = function(loader, modules) {

  // queue
  loader.app.meta.queue = loader.app.cluster(QueueClientFn(loader.app)).create({});

  // all queues
  const ebQueues = loader.app.meta.queues = {};

  // load queues
  loadQueues();

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
