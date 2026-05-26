import { BeanBase } from 'vona';

import type { IBroadcastEmitOptions, IBroadcastJobContext } from '../types/broadcast.ts';

export class BeanBroadcastBase<DATA = unknown> extends BeanBase {
  emit(data?: DATA, options?: IBroadcastEmitOptions) {
    return this.$scope.broadcast.service.broadcast.emit(this._prepareInfo(data, options));
  }

  private _prepareInfo(data?: DATA, options?: IBroadcastEmitOptions): IBroadcastJobContext<DATA> {
    options = this.$scope.executor.service.executor.prepareGeneralInfo(options);
    return {
      broadcastName: this.$onionName as never,
      data,
      options,
    };
  }
}
