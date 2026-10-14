import type { Redis } from 'ioredis';

import { assertTestAppIdentity, BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IRedisClientRecord } from '../types/redis.ts';

import { getRedisClientKeyPrefix, prepareRedisClientKeyPrefix } from '../lib/redis.ts';

interface RedisCleanupTarget {
  redis: Redis;
  expectedPrefix: string;
  keyPrefix: string | undefined;
}

@Service()
export class ServiceRedis extends BeanBase {
  async clearAllData() {
    const app = this.app;
    const isolated = assertTestAppIdentity(
      app.meta.env.META_MODE,
      app.meta.env.VONA_TEST_RUN_ID,
      app.name,
    );
    if (isolated && app.config.redis.base.keyPrefix !== undefined) {
      throw new Error('Isolated test cannot inherit a Redis base keyPrefix');
    }

    // Prepare every target before looking up keys or deleting anything.
    const targets = [this._prepareCleanupTarget('queue', Boolean(isolated))];
    for (const _clientName of Object.keys(app.config.redis.clients)) {
      const clientName = _clientName as keyof IRedisClientRecord;
      // Broadcast carries subscriptions, not cleanup keys.
      if (['queue', 'broadcast'].includes(clientName)) continue;
      targets.push(this._prepareCleanupTarget(clientName, Boolean(isolated)));
    }

    // KEYS returns full keys even for prefixed clients. Validate the complete
    // lookup result for every target before issuing the first DEL.
    const deletions: { redis: Redis; keys: string[] }[] = [];
    for (const { redis, expectedPrefix, keyPrefix } of targets) {
      const fullKeys = await redis.keys(`${expectedPrefix}*`);
      if (
        !Array.isArray(fullKeys) ||
        fullKeys.some(key => typeof key !== 'string' || !key.startsWith(expectedPrefix))
      ) {
        throw new Error('Redis cleanup lookup returned a key outside the owned prefix');
      }
      deletions.push({
        redis,
        keys: fullKeys.map(key => (keyPrefix ? key.substring(keyPrefix.length) : key)),
      });
    }
    for (const { redis, keys } of deletions) {
      if (keys.length > 0) await redis.del(keys);
    }
  }

  private _prepareCleanupTarget(
    clientName: keyof IRedisClientRecord,
    isolated: boolean,
  ): RedisCleanupTarget {
    const app = this.app;
    const configClient = app.config.redis.clients[clientName];
    if (!configClient) throw new Error(`Redis cleanup client is not configured: ${clientName}`);
    if (isolated && ('sentinels' in configClient || 'nodes' in configClient)) {
      throw new Error(`Isolated test cannot use a Redis sentinel or cluster client: ${clientName}`);
    }
    const unprefixedClient = clientName === 'queue' || clientName.startsWith('redlock');
    const frameworkPrefix = getRedisClientKeyPrefix(
      clientName === 'queue' ? 'bull' : unprefixedClient ? 'redlock' : clientName,
      app,
    );
    const configuredPrefix = prepareRedisClientKeyPrefix(configClient.keyPrefix, clientName, app);
    const expectedPrefix = unprefixedClient ? frameworkPrefix : configuredPrefix;
    if (
      !app.name ||
      typeof expectedPrefix !== 'string' ||
      !expectedPrefix.startsWith(frameworkPrefix) ||
      !expectedPrefix.endsWith(':') ||
      /[*?[\]\\]/.test(expectedPrefix) ||
      Array.from(expectedPrefix).some(
        char => char.charCodeAt(0) <= 32 || char.charCodeAt(0) === 127,
      )
    ) {
      throw new Error(`Redis cleanup prefix does not belong to this app: ${clientName}`);
    }
    // Custom prefixes may narrow the framework namespace, never widen it.
    if (unprefixedClient && configuredPrefix !== undefined && configuredPrefix !== '') {
      throw new Error(`Redis cleanup requires an unprefixed client: ${clientName}`);
    }
    const redis = app.bean.redis.get(clientName);
    if (!redis?.options) throw new Error(`Redis cleanup client is unavailable: ${clientName}`);
    const keyPrefix = redis.options.keyPrefix;
    if (
      unprefixedClient ? keyPrefix !== undefined && keyPrefix !== '' : keyPrefix !== expectedPrefix
    ) {
      throw new Error(`Redis cleanup uses an unexpected client prefix: ${clientName}`);
    }
    return { redis, expectedPrefix, keyPrefix };
  }
}
