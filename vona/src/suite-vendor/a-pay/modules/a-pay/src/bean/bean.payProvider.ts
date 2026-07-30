import { BeanBase, deepExtend } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IPayProviderExecute } from '../types/payment.ts';
import type { IPayProviderRecord } from '../types/payProvider.ts';

@Bean()
export class BeanPayProvider extends BeanBase {
  get<N extends keyof IPayProviderRecord>(providerName: N): IPayProviderExecute {
    const onionSlice = this.bean.onion.payProvider.getOnionSliceEnabled(true, providerName);
    if (!onionSlice) this.app.throw(404, `payment provider not found: ${String(providerName)}`);
    return this.app.bean._getBean<IPayProviderExecute>(
      onionSlice.beanOptions.beanFullName as never,
    );
  }

  getOptions<N extends keyof IPayProviderRecord>(providerName: N, clientName = 'default') {
    const onionSlice = this.bean.onion.payProvider.getOnionSliceEnabled(true, providerName);
    if (!onionSlice) this.app.throw(404, `payment provider not found: ${String(providerName)}`);
    const options = onionSlice.beanOptions.options as {
      base?: Record<string, unknown>;
      clients?: Record<string, Record<string, unknown>>;
    };
    return deepExtend({}, options.base, options.clients?.[clientName]);
  }
}
