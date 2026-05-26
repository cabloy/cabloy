import type { IOnionSlice } from 'vona-module-a-onion';
import type { IScheduleExecute } from 'vona-module-a-schedule';

import { BeanBase } from 'vona';
import { Schedule } from 'vona-module-a-schedule';

import type { IModelRecord, ISoftDeletionPrune } from '../types/onion/model.ts';
import type { BeanModelCache } from './bean.model/bean.model_cache.ts';

@Schedule({ repeat: { every: 24 * 3600 * 1000 } })
export class ScheduleSoftDeletionPrune extends BeanBase implements IScheduleExecute {
  async execute() {
    const onionSlices = this.bean.onion.model.getOnionsEnabledCached();
    for (const onionSlice of onionSlices) {
      if (onionSlice.beanOptions.options?.disableDeleted) continue;
      let softDeletionPrune =
        onionSlice.beanOptions.options?.softDeletionPrune ??
        this.scope.config.softDeletionPrune.enable;
      if (!softDeletionPrune) continue;
      if (softDeletionPrune === true) softDeletionPrune = {};
      await this._modulePrune(onionSlice, softDeletionPrune);
    }
  }

  private async _modulePrune<MODULE extends BeanModelCache, T extends keyof IModelRecord>(
    onionSlice: IOnionSlice<IModelRecord, T, unknown>,
    softDeletionPrune: ISoftDeletionPrune,
  ) {
    const handler = softDeletionPrune.handler;
    const expired = softDeletionPrune.expired ?? this.scope.config.softDeletionPrune.expired;
    const modelTarget = this.bean._getBean<MODULE>(onionSlice.beanOptions.beanFullName as any);
    if (handler) {
      await handler(this.ctx, modelTarget, { expired });
    } else {
      const expiredTime = new Date(Date.now() - expired);
      await modelTarget.delete(
        {
          deleted: true,
          updatedAt: {
            _lt_: expiredTime,
          },
        } as any,
        { disableDeleted: true },
      );
    }
  }
}
