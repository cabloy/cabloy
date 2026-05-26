import type { ClusterOptions, RedisOptions } from 'ioredis';

export interface IRedisClientRecord {
  default: never;
  redlock: never;
  queue: never;
  broadcast: never;
  cache: never;
  io: never;
  summer: never;
  model: never;
  worker: never;
}

export interface IRedisClientOptions extends Omit<RedisOptions, 'keyPrefix'> {
  keyPrefix?: string | true;
}

export interface ConfigRedisCluster extends ClusterOptions {
  nodes: RedisOptions[];
}

export interface ConfigRedis {
  base: RedisOptions;
  clients: Record<keyof IRedisClientRecord, IRedisClientOptions | ConfigRedisCluster>;
}

declare module 'vona' {
  export interface VonaConfig {
    redis: ConfigRedis;
  }

  export interface VonaConfigEnv {
    REDIS_DEFAULT_HOST: string | undefined;
    REDIS_DEFAULT_PORT: string | undefined;
    REDIS_DEFAULT_PASSWORD: string | undefined;
    REDIS_DEFAULT_DB: string | undefined;
  }
}
