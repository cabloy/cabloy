import type { Query } from '@tanstack/vue-query';

import { BeanModelPersister } from './bean.model.persister.js';

export class BeanModelLocal extends BeanModelPersister {
  $serializeLocal(obj?: Query) {
    return JSON.stringify(obj?.state?.data);
  }

  $deserializeLocal(value?: string) {
    return {
      state: {
        data: value ? JSON.parse(value) : undefined,
        dataUpdateCount: 0,
        dataUpdatedAt: Date.now(),
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        isInvalidated: false,
        status: 'success',
        fetchStatus: 'idle',
      },
      queryKey: undefined,
      queryHash: undefined,
      buster: this._getPersisterBuster(),
    };
  }
}
