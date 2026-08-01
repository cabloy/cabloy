import { BeanBase, deepExtend } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IPayProviderExecute } from '../types/payment.ts';
import type {
  IPayProviderClientOptions,
  IPayProviderRecord,
  TypePayProviderClientNameByName,
  TypePayProviderClientOptionsByName,
  TypePayProviderExecuteByName,
  TypePayProviderOptionsByName,
} from '../types/payProvider.ts';

@Bean()
export class BeanPayProvider extends BeanBase {
  get<N extends keyof IPayProviderRecord>(providerName: N): TypePayProviderExecuteByName<N> {
    const onionSlice = this._getOnionSlice(providerName);
    return this.app.bean._getBean<TypePayProviderExecuteByName<N>>(
      onionSlice.beanOptions.beanFullName as never,
    );
  }

  getOptions<N extends keyof IPayProviderRecord>(
    providerName: N,
    clientName: TypePayProviderClientNameByName<N>,
  ) {
    const onionSlice = this._getOnionSlice(providerName);
    const options = onionSlice.beanOptions.options as TypePayProviderOptionsByName<N>;
    const clientOptions = options.clients?.[clientName as keyof typeof options.clients];
    if (!clientOptions) {
      this.app.throw(
        404,
        `payment provider client not found: ${String(providerName)}:${clientName}`,
      );
    }
    const resolvedOptions = deepExtend(
      {},
      options.base,
      clientOptions,
    ) as TypePayProviderClientOptionsByName<N>;
    if (resolvedOptions.environment !== 'sandbox' && resolvedOptions.environment !== 'live') {
      this.app.throw(
        500,
        `payment provider client has an invalid environment: ${String(providerName)}:${clientName}`,
      );
    }
    return resolvedOptions;
  }

  resolve<N extends keyof IPayProviderRecord>(
    providerName: N,
    clientName: TypePayProviderClientNameByName<N>,
  ) {
    return {
      provider: this.get(providerName),
      clientOptions: this.getOptions(providerName, clientName),
    };
  }

  resolveByName(providerName: string, clientName: string) {
    return this.resolve(
      providerName as keyof IPayProviderRecord,
      clientName as TypePayProviderClientNameByName<keyof IPayProviderRecord>,
    ) as {
      provider: IPayProviderExecute<IPayProviderClientOptions>;
      clientOptions: IPayProviderClientOptions;
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
