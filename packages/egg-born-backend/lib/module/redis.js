const Bottleneck = require('bottleneck');
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

  // limiter
  loader.app.meta.limiter = limiter;

};
