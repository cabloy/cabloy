import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IRedisClientRecord } from '../types/redis.ts';

import { ServiceRedisClient } from '../service/redisClient_.ts';

@Bean()
export class BeanRedis extends BeanBase {
  getClient(clientName?: keyof IRedisClientRecord) {
    return this.app.bean._getBeanSelector(ServiceRedisClient, clientName ?? 'default');
  }

  get(clientName?: keyof IRedisClientRecord) {
    const client = this.getClient(clientName);
    return client.instance;
  }
}
