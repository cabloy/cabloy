import { BeanBase, deepExtend } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { EntityAuthProvider } from '../entity/authProvider.ts';
import type { IAuthProviderClientOptions, TypeAuthProviderPick } from '../types/authProvider.ts';

@Bean()
export class BeanAuthProvider extends BeanBase {
  async get(data: TypeAuthProviderPick) {
    if (!data.id && !data.clientName) data = { ...data, clientName: 'default' };
    const res = await this.scope.model.authProvider.get(data);
    if (res) return res;
    if (data.id) throw new Error(`not found auth provider: ${data.id}`);
    if (!data.providerName) throw new Error('Invalid auth provider');
    // lock
    return await this.scope.redlock.lockIsolate('authProvider.register', async () => {
      return await this._registerAuthProviderLock(data);
    });
  }

  private async _registerAuthProviderLock(data: TypeAuthProviderPick) {
    // get
    const res = await this.scope.model.authProvider.get(data, { cache: { force: true } });
    if (res) return res;
    const dataNew: Partial<EntityAuthProvider> = {
      disabled: false,
      providerName: data.providerName,
      clientName: data.clientName,
      clientOptions: undefined,
    };
    // create
    return await this.scope.model.authProvider.insert(dataNew);
  }

  public async getClientOptions<T extends IAuthProviderClientOptions>(
    data: TypeAuthProviderPick,
    clientOptionsCustom?: T,
    clientOptionsDefault?: T,
  ) {
    // authProvider
    const entityAuthProvider = await this.bean.authProvider.get(data);
    if (!entityAuthProvider) return { entityAuthProvider: undefined };
    const disabled = entityAuthProvider?.disabled;
    const authProviderName = entityAuthProvider.providerName;
    // clientName
    const clientName = entityAuthProvider.clientName ?? 'default';
    // onionSlice
    const onionSlice = this.bean.onion.authProvider.getOnionSliceEnabled(
      true,
      authProviderName as any,
    );
    if (!onionSlice) throw new Error(`Auth provider not found: ${authProviderName}`);
    const beanFullName = onionSlice.beanOptions.beanFullName;
    const onionOptions = onionSlice.beanOptions.options ?? {};
    // clientOptions
    const clientOptions: IAuthProviderClientOptions = deepExtend(
      clientOptionsDefault ?? {},
      onionOptions?.base,
      onionOptions?.clients?.[clientName as any],
      entityAuthProvider.clientOptions,
      clientOptionsCustom,
    );
    return { entityAuthProvider, disabled, beanFullName, onionOptions, clientOptions };
  }
}
