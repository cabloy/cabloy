import type { Query } from '@tanstack/vue-query';

import type { QueryMetaPersisterCookieType } from '../../types/index.js';

import { BeanModelLocal } from './bean.model.local.js';

export class BeanModelCookie extends BeanModelLocal {
  $serializeCookie(obj?: Query) {
    return String(obj?.state?.data ?? '');
  }

  $deserializeCookie(value?: any) {
    return {
      state: {
        data: value,
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

  protected _cookieCoerce(value?: string, cookieType?: QueryMetaPersisterCookieType) {
    if (value === undefined || value === '') return undefined; // string of '' means should delete the cookie
    if (!cookieType || cookieType === 'auto') {
      return value === 'true' ? true : value === 'false' ? false : value;
    } else if (cookieType === 'boolean') {
      return value === 'true' ? true : value === 'false' ? false : Boolean(Number(value));
    } else if (cookieType === 'number') {
      return Number(value);
    } else if (cookieType === 'date') {
      return new Date(value);
    } else if (cookieType === 'string') {
      return value;
    }
    return value;
  }
}
