module.exports = async function(app) {
  // clear keys
  if (app.meta.isTest) {
    await _clearRedisKeys(app.redis.get('limiter'), `b_${app.name}:*`);
    await _clearRedisKeys(app.redis.get('queue'), `bull_${app.name}:*`);
    // broadcast channel has subscribed
    // await _clearRedisKeys(app.redis.get('broadcast'), `broadcast_${app.name}:*`);
    await _clearRedisKeys(app.redis.get('cache'), `cache_${app.name}:*`);
    await _clearRedisKeys(app.redis.get('io'), `io_${app.name}:*`);
  }

  // run startups
  for (const startup of app.meta.startupsArray) {
    if (!startup.startup.disable) {
      await app.meta.runStartup(startup.key);
    }
  }
  // version test
  if (app.meta.isTest) {
    // ctx
    const ctx = app.createAnonymousContext({
      method: 'post',
      url: '/api/a/version',
    });
    await ctx.performAction({
      subdomain: '',
      method: 'post',
      url: '/a/version/version/check',
      body: {
        scene: 'test',
      },
    });
  }
  // queue workers
  if (!app.meta.isTest) {
    app.meta._loadQueueWorkers();
  }
};

async function _clearRedisKeys(redis, pattern) {
  if (!redis) return;
  const keyPrefix = redis.options.keyPrefix;
  const keys = await redis.keys(pattern);
  for (const fullKey of keys) {
    const key = keyPrefix ? fullKey.substr(keyPrefix.length) : fullKey;
    await redis.del(key);
  }
}
