const QueueClientFn = require('./queueClient.js');

module.exports = function(loader, modules) {

  // queue
  loader.app.meta.queue = new (QueueClientFn(loader.app))();

  // all queues
  const ebQueues = loader.app.meta.queues = {};

  // load queues
  loadQueues();

  function loadQueues() {
    Object.keys(modules).forEach(key => {
      const module = modules[key];
      const config = loader.app.meta.configs[module.info.relativeName];
      // module queues
      if (config.queues) {
        Object.keys(config.queues).forEach(queueName => {
          const fullKey = `${module.info.relativeName}:${queueName}`;
          ebQueues[fullKey] = {
            module: module.info.relativeName,
            name: queueName,
            config: config.queues[queueName],
          };
        });
      }
    });
  }

  loader.app.meta._loadQueueWorkers = () => {
    for (const fullKey in ebQueues) {
      const queue = ebQueues[fullKey];
      const info = {
        module: queue.module,
        queueName: queue.name,
      };
      loader.app.meta.queue._ensureWorker(info);
    }
  };

};
