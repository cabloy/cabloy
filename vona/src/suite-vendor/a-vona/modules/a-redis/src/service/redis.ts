import type { Redis } from 'ioredis';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IRedisClientRecord } from '../types/redis.ts';

import { getRedisClientKeyPrefix, prepareRedisClientKeyPrefix } from '../lib/redis.ts';

@Service()
export class ServiceRedis extends BeanBase {
  async clearAllData() {
    const app = this.app;
    // clear keys
    // await this._clearRedisKeys(app.bean.redis.get('limiter'), `b_${app.name}:*`);
    await this._clearRedisKeys(
      app.bean.redis.get('queue'),
      `${getRedisClientKeyPrefix('bull', app)}*`,
    );
    // broadcast channel has subscribed
    // await _clearRedisKeys(app.redis.get('broadcast'), `${getRedisClientKeyPrefix('broadcast', app)}*`);
    for (const _clientName in app.config.redis.clients) {
      const clientName = _clientName as keyof IRedisClientRecord;
      if (['limiter', 'queue', 'broadcast'].includes(clientName)) continue;
      if (clientName.startsWith('redlock')) {
        await this._clearRedisKeys(
          app.bean.redis.get(clientName),
          `${getRedisClientKeyPrefix('redlock', app)}*`,
        );
      } else {
        const client = app.config.redis.clients[clientName];
        const keyPrefix = prepareRedisClientKeyPrefix(client.keyPrefix, clientName, this.app);
        await this._clearRedisKeys(app.bean.redis.get(clientName), `${keyPrefix}*`);
      }
    }
  }

  private async _clearRedisKeys(redis: Redis, pattern: string) {
    if (!redis) return;
    const keyPrefix = redis.options.keyPrefix;
    const keys = await redis.keys(pattern);
    const keysDel: string[] = [];
    for (const fullKey of keys) {
      const key = keyPrefix ? fullKey.substring(keyPrefix.length) : fullKey;
      keysDel.push(key);
    }
    if (keysDel.length > 0) {
      await redis.del(keysDel);
    }
  }
}
