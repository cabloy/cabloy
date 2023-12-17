const path = require('path');
const fse = require('fs-extra');

module.exports = async function (app) {
  if (!app.meta.isTest) return;
  // clear keys
  await _clearRedisKeys(app.redis.get('limiter'), `b_${app.name}:*`);
  await _clearRedisKeys(app.redis.get('queue'), `bull_${app.name}:*`);
  // broadcast channel has subscribed
  // await _clearRedisKeys(app.redis.get('broadcast'), `broadcast_${app.name}:*`);
  await _clearRedisKeys(app.redis.get('cache'), `cache_${app.name}:*`);
  await _clearRedisKeys(app.redis.get('io'), `io_${app.name}:*`);
  await _clearRedisKeys(app.redis.get('auth'), `auth_${app.name}:*`);
  await _clearRedisKeys(app.redis.get('summer'), `summer_${app.name}:*`);
  // redlock
  for (const clientName of app.config.queue.redlock.clients) {
    await _clearRedisKeys(app.redis.get(clientName), `redlock_${app.name}:*`);
  }
  // src/backend/app/public
  await fse.remove(path.join(app.config.baseDir, 'app/public/1'));
};

async function _clearRedisKeys(redis, pattern) {
  if (!redis) return;
  const keyPrefix = redis.options.keyPrefix;
  const keys = await redis.keys(pattern);
  const keysDel = [];
  for (const fullKey of keys) {
    const key = keyPrefix ? fullKey.substr(keyPrefix.length) : fullKey;
    keysDel.push(key);
  }
  if (keysDel.length > 0) {
    await redis.del(keysDel);
  }
}
