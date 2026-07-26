import type { Redis } from 'ioredis';

import { isNil } from '@cabloy/utils';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { getRedisClientKeyPrefix } from 'vona-module-a-redis';

import type { IBroadcastExecute, IBroadcastJobContext } from '../types/broadcast.ts';

@Service()
export class ServiceBroadcast extends BeanBase {
  private __callerId: string;
  private __channelName: string;
  private __sub: Redis;
  private __pub: Redis;

  protected __init__() {
    const app = this.app;
    this.__callerId = app.bean.worker.id;
    this.__channelName = getRedisClientKeyPrefix('broadcast', this.app);
    this.__pub = app.bean.redis.get('broadcast').duplicate();
    this.__sub = app.bean.redis.get('broadcast').duplicate();
    this.__sub.subscribe(this.__channelName, () => {});
    this.__sub.on('message', (_channel, info) => {
      this._performTask(JSON.parse(info))
        .then(() => {
          // do nothing
        })
        .catch((err: Error) => {
          this.app.handleError(err);
        });
    });
  }

  public async disposePub() {
    await this.__pub?.disconnect();
  }

  public async disposeSub() {
    await this.__sub?.disconnect();
  }

  emit<DATA>(info: IBroadcastJobContext<DATA>) {
    const telemetry = this.$scope.telemetry.service.telemetry;
    let infoWithCaller = {
      ...info,
      callerId: this.__callerId,
    };
    const span = telemetry.enabled
      ? telemetry.startSpan(`broadcast publish ${String(info.broadcastName)}`, {
          kind: 3,
          attributes: {
            'messaging.operation.name': 'publish',
            'messaging.destination.name': String(info.broadcastName),
          },
        })
      : undefined;
    if (span) {
      infoWithCaller = {
        ...infoWithCaller,
        options: {
          ...info.options,
          telemetry: telemetry.injectCarrier(telemetry.createContext(span)),
        },
      };
    }
    this.__pub
      .publish(this.__channelName, JSON.stringify(infoWithCaller))
      .catch(err => {
        if (span) telemetry.recordException(span, err);
        this.app.handleError(err);
      })
      .finally(() => span?.end());
  }

  async _performTask<DATA>(info: IBroadcastJobContext<DATA>) {
    const telemetry = this.$scope.telemetry.service.telemetry;
    const parent = telemetry.extractCarrier(info.options?.telemetry);
    const span = telemetry.enabled
      ? telemetry.startSpan(
          `broadcast receive ${String(info.broadcastName)}`,
          {
            kind: 4,
            attributes: {
              'messaging.operation.name': 'process',
              'messaging.destination.name': String(info.broadcastName),
            },
          },
          parent,
        )
      : undefined;
    // isEmitter
    const isEmitter = info.callerId === this.__callerId;
    // broadcast config
    const broadcastItem = this.bean.onion.broadcast.getOnionSlice(info.broadcastName);
    const broadcastConfig = this.bean.onion.broadcast.getOnionOptions(info.broadcastName);
    // instance
    const instanceName = info.options?.instanceName;
    const instance = broadcastConfig?.instance !== false;
    try {
      // check
      if ((!isNil(instanceName) || instance) && !this.app.meta.appReady) {
        // ignore
        return;
      }
      const execute = () =>
        this.bean.executor.newCtx(
          async () => {
            const beanFullName = broadcastItem.beanOptions.beanFullName;
            const beanInstance = <IBroadcastExecute<DATA>>(
              this.app.bean._getBean(beanFullName as any)
            );
            return await beanInstance.execute(info.data, isEmitter);
          },
          {
            dbInfo: info.options?.dbInfo,
            locale: info.options?.locale,
            tz: info.options?.tz,
            instanceName,
            extraData: {
              ...info.options?.extraData,
              state: {
                ...info.options?.extraData?.state,
                telemetry: span
                  ? { context: telemetry.createContext(span, parent), span }
                  : undefined,
              },
            },
            transaction: broadcastConfig?.transaction,
            instance,
          },
        );
      return await (span ? telemetry.withSpan(span, execute) : execute());
    } catch (err) {
      if (span) telemetry.recordException(span, err);
      throw err;
    } finally {
      span?.end();
    }
  }
}
