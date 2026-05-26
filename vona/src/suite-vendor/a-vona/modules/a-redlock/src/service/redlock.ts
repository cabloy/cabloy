import type { FunctionAsync, PowerPartial } from 'vona';

import { Redlock } from '@sesamecare-oss/redlock';
import { BeanBase, deepExtend, instanceDesp } from 'vona';
import { Service } from 'vona-module-a-bean';
import { getRedisClientKeyPrefix } from 'vona-module-a-redis';

import type {
  IRedlockClientOptions,
  IRedlockLockIsolateOptions,
  IRedlockLockOptions,
} from '../types/redlock.ts';

@Service()
export class ServiceRedlock extends BeanBase {
  private _redlockDefault: Redlock;

  public async lock<RESULT>(
    resource: string,
    fn: FunctionAsync<RESULT>,
    options?: IRedlockLockOptions,
  ): Promise<RESULT> {
    const instanceName =
      options?.instanceName === undefined ? this.ctx?.instanceName : options?.instanceName;
    const redlock = options?.redlock ?? this.redlockDefault;
    const lockTTL = options?.lockTTL ?? this.scope.config.lockTTL;
    // resource
    const _lockResource = `${getRedisClientKeyPrefix('redlock', this.app)}${instanceDesp(instanceName)}:${resource}`;
    // lock
    let _lock = await redlock.acquire([_lockResource], lockTTL);
    // timer
    let _lockTimer = null as any;
    const _lockDone = () => {
      if (_lockTimer) {
        clearInterval(_lockTimer);
        _lockTimer = null;
      }
    };
    _lockTimer = setInterval(() => {
      _lock
        .extend(lockTTL)
        .then(lock => {
          _lock = lock;
        })
        .catch(_err => {
          // need not logger error
          // this.$logger.error(err);
          _lockDone();
        });
    }, lockTTL / 2);
    try {
      return await fn();
    } finally {
      _lockDone();
      // not await, and throw error
      _lock.release().catch(_err => {
        // do nothing
      });
    }
  }

  public async lockIsolate<RESULT>(
    resource: string,
    fn: FunctionAsync<RESULT>,
    options?: IRedlockLockIsolateOptions,
  ): Promise<RESULT> {
    return await this.lock(
      resource,
      async () => {
        if (!this.bean.database.current) return await fn();
        return await this.bean.database.switchDbIsolate(fn, options);
      },
      options,
    );
  }

  private get redlockDefault() {
    if (!this._redlockDefault) {
      this._redlockDefault = this._create(this.scope.config.base);
    }
    return this._redlockDefault;
  }

  public create(options?: PowerPartial<IRedlockClientOptions>): Redlock {
    const options2: IRedlockClientOptions = options
      ? deepExtend({}, this.scope.config.base, options)
      : this.scope.config.base;
    return this._create(options2);
  }

  private _create(options: IRedlockClientOptions) {
    // clients
    const clients = [] as any;
    for (const clientName of options.clients) {
      const client = this.app.bean.redis.get(clientName);
      clients.push(client);
    }
    // create
    return new Redlock(clients, options.options);
  }
}
