module.exports = async function(app) {
  // clear keys
  if (app.meta.isTest) {
    await _clearRedisKeys(app.redis.get('limiter'), `b_${app.name}:*`);
    await _clearRedisKeys(app.redis.get('queue'), `bull_${app.name}:*`);
    await _clearRedisKeys(app.redis.get('cache'), `cache_${app.name}:*`);
  }
  // run startups
  for (const key in app.meta.startups) {
    const startup = app.meta.startups[key];
    if (!startup.startup.disable) {
      await app.meta.runStartup(key);
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
  const keys = await redis.keys(pattern);
  for (const key of keys) {
    await redis.del(key);
  }
}
