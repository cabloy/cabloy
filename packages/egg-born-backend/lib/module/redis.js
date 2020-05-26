const Bottleneck = require('bottleneck');
const Redlock = require('redlock');

module.exports = function(loader) {

  const limiter = {
    // https://github.com/SGrondin/bottleneck#clustering
    create(options) {
      options = options || {};
      // datastore
      options.datastore = 'ioredis';
      // connection
      if (options.connection === undefined) {
        options.connection = new Bottleneck.IORedisConnection({
          client: loader.app.redis.get('limiter'),
        });
      }
      return new Bottleneck(options);
    },
  };

  const redlock = {
    // https://github.com/mike-marcacci/node-redlock#configuration
    create(options) {
      // clients
      const clients = [];
      for (const clientName of loader.app.config.queue.redlock.clients) {
        const client = loader.app.redis.get(clientName) || loader.app.redis.get('limiter');
        clients.push(client);
      }
      return new Redlock(clients, options);
    },
  };

  // limiter
  loader.app.meta.limiter = limiter;
  // redlock
  loader.app.meta.redlock = redlock;

};
