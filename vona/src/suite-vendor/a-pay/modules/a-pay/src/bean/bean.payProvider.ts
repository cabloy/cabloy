import { BeanBase, deepExtend } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IPayProviderExecute } from '../types/payment.ts';
import type { IPayProviderRecord } from '../types/payProvider.ts';

@Bean()
export class BeanPayProvider extends BeanBase {
  get<N extends keyof IPayProviderRecord>(providerName: N): IPayProviderExecute {
    const onionSlice = this._getOnionSlice(providerName);
    return this.app.bean._getBean<IPayProviderExecute>(
      onionSlice.beanOptions.beanFullName as never,
    );
  }

  getOptions<N extends keyof IPayProviderRecord>(providerName: N, clientName = 'default') {
    const onionSlice = this._getOnionSlice(providerName);
    const options = onionSlice.beanOptions.options as {
      base?: Record<string, unknown>;
      clients?: Record<string, Record<string, unknown>>;
    };
    const clientOptions = options.clients?.[clientName];
    if (!clientOptions) {
      this.app.throw(
        404,
        `payment provider client not found: ${String(providerName)}:${clientName}`,
      );
    }
    const resolvedOptions = deepExtend({}, options.base, clientOptions) as Record<string, unknown>;
    if (resolvedOptions.environment !== 'sandbox' && resolvedOptions.environment !== 'live') {
      this.app.throw(
        500,
        `payment provider client has an invalid environment: ${String(providerName)}:${clientName}`,
      );
    }
    return resolvedOptions as typeof resolvedOptions & {
      environment: 'sandbox' | 'live';
    };
  }

  private _getOnionSlice<N extends keyof IPayProviderRecord>(providerName: N) {
    const onionSlice = this.bean.onion.payProvider.getOnionSliceEnabled(true, providerName);
    if (onionSlice) return onionSlice;
    const legacyProviderName = `${String(providerName).replace(':', ':payProvider')}` as N;
    const legacyOnionSlice = this.bean.onion.payProvider.getOnionSliceEnabled(
      true,
      legacyProviderName,
    );
    if (!legacyOnionSlice)
      this.app.throw(404, `payment provider not found: ${String(providerName)}`);
    return legacyOnionSlice;
  }
}
