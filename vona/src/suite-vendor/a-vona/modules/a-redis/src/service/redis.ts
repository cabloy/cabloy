import type { Redis } from 'ioredis';

import { BeanBase, resolveTestRunId } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IRedisClientRecord } from '../types/redis.ts';

import { getRedisClientKeyPrefix, prepareRedisClientKeyPrefix } from '../lib/redis.ts';

@Service()
export class ServiceRedis extends BeanBase {
  async clearAllData() {
    const app = this.app;
    // clear keys
    await this._clearRedisKeys(
      app.bean.redis.get('queue'),
      getRedisClientKeyPrefix('bull', app),
      true,
    );
    // broadcast channel has subscribed
    // await _clearRedisKeys(app.redis.get('broadcast'), `${getRedisClientKeyPrefix('broadcast', app)}*`);
    for (const _clientName in app.config.redis.clients) {
      const clientName = _clientName as keyof IRedisClientRecord;
      if (['queue', 'broadcast'].includes(clientName)) continue;
      if (clientName.startsWith('redlock')) {
        await this._clearRedisKeys(
          app.bean.redis.get(clientName),
          getRedisClientKeyPrefix('redlock', app),
          true,
        );
      } else {
        const client = app.config.redis.clients[clientName];
        const keyPrefix = prepareRedisClientKeyPrefix(client.keyPrefix, clientName, this.app);
        await this._clearRedisKeys(app.bean.redis.get(clientName), keyPrefix!);
      }
    }
  }

  private async _clearRedisKeys(redis: Redis, expectedPrefix: string, unprefixedClient = false) {
    if (!redis) return;
    const isolated = resolveTestRunId(
      this.app.meta.env.META_MODE,
      this.app.meta.env.VONA_TEST_RUN_ID,
    );
    const keyPrefix = redis.options.keyPrefix;
    if (isolated) {
      if (!expectedPrefix.includes(this.app.name) || !expectedPrefix.endsWith(':')) {
        throw new Error('Isolated test Redis cleanup prefix does not belong to this run');
      }
      if (unprefixedClient ? Boolean(keyPrefix) : keyPrefix !== expectedPrefix) {
        throw new Error('Isolated test Redis cleanup uses an unexpected client prefix');
      }
    }
    const keys = await redis.keys(`${expectedPrefix}*`);
    const keysDel: string[] = [];
    for (const fullKey of keys) {
      if (isolated && !fullKey.startsWith(expectedPrefix)) {
        throw new Error('Isolated test Redis lookup returned a key outside the owned prefix');
      }
      const key = keyPrefix ? fullKey.substring(keyPrefix.length) : fullKey;
      keysDel.push(key);
    }
    if (keysDel.length > 0) {
      await redis.del(keysDel);
    }
  }
}
