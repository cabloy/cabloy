import type { RedisOptions } from 'ioredis';

import { Redis } from 'ioredis';
import { assertTestClaimRedisClient, BeanBase, cast, deepExtend, resolveTestRunId } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { ConfigRedisCluster, IRedisClientRecord } from '../types/redis.ts';

import { prepareRedisClientKeyPrefix } from '../lib/redis.ts';

@Service()
export class ServiceRedisClient extends BeanBase {
  private _redisInstance: Redis;

  get instance(): Redis {
    return this._redisInstance;
  }

  protected __init__(clientName: keyof IRedisClientRecord) {
    // instance
    this._redisInstance = this._createClient(clientName);
  }

  protected async __dispose__() {
    await this._redisInstance?.disconnect();
  }

  private _createClient(clientName: keyof IRedisClientRecord): Redis {
    const configRedis = this.app.config.redis;
    const configClient = configRedis.clients[clientName];
    if (!configClient) throw new Error(`redis client not found: ${clientName}`);
    const isolated = resolveTestRunId(
      this.app.meta.env.META_MODE,
      this.app.meta.env.VONA_TEST_RUN_ID,
    );
    if (
      isolated &&
      (cast<RedisOptions>(configClient).sentinels || cast<ConfigRedisCluster>(configClient).nodes)
    ) {
      throw new Error(`Isolated test cannot use a Redis sentinel or cluster client: ${clientName}`);
    }
    if (isolated) {
      prepareRedisClientKeyPrefix(configClient.keyPrefix, clientName, this.app);
      if (configRedis.base.keyPrefix !== undefined) {
        throw new Error('Isolated test cannot inherit a Redis base keyPrefix');
      }
    }
    if (cast<RedisOptions>(configClient).sentinels) {
      // sentinels
      return new Redis(configClient as RedisOptions);
    } else if (cast<ConfigRedisCluster>(configClient).nodes) {
      return new Redis.Cluster(
        cast<ConfigRedisCluster>(configClient).nodes,
        cast<ConfigRedisCluster>(configClient),
      ) as unknown as Redis;
    } else {
      const keyPrefix = prepareRedisClientKeyPrefix(configClient.keyPrefix, clientName, this.app);
      const configNode = deepExtend({}, configRedis.base, configClient, { keyPrefix });
      assertTestClaimRedisClient(this.app, clientName, configNode);
      return new Redis(configNode);
    }
  }
}
