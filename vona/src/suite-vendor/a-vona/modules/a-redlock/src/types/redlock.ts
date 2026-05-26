import type * as Redlock from '@sesamecare-oss/redlock';
import type { IInstanceRecord } from 'vona';
import type { IDbInfo } from 'vona-module-a-orm';
import type { IRedisClientRecord } from 'vona-module-a-redis';

export interface IRedlockClientOptions {
  clients: (keyof IRedisClientRecord)[];
  options: Redlock.Settings;
}

export interface ConfigRedlock {
  lockTTL: number;
  base: IRedlockClientOptions;
}

export interface IRedlockLockOptions {
  instanceName?: keyof IInstanceRecord | undefined | null;
  redlock?: Redlock.Redlock;
  lockTTL?: number;
}

export interface IRedlockLockIsolateOptions extends IRedlockLockOptions, Partial<IDbInfo> {}

declare module 'vona-module-a-meta' {
  export interface IMetaNameRecord {
    redlock: never;
  }
}
