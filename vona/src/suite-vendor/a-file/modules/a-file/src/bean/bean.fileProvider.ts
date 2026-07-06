import { BeanBase, deepExtend } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { EntityFileProvider } from '../entity/fileProvider.ts';
import type {
  IFileProviderRecord,
  TypeFileProviderClientOptionsByName,
  TypeFileProviderOptionsByName,
  TypeFileProviderPick,
} from '../types/fileProvider.ts';

@Bean()
export class BeanFileProvider extends BeanBase {
  async get(data: TypeFileProviderPick) {
    if (!data.id && !data.clientName) data = { ...data, clientName: 'default' };
    const res = await this.scope.model.fileProvider.get(data);
    if (res) return res;
    if (data.id) throw new Error(`not found file provider: ${data.id}`);
    if (!data.providerName) throw new Error('Invalid file provider');
    return await this.scope.redlock.lockIsolate('fileProvider.register', async () => {
      return await this._registerFileProviderLock(data);
    });
  }

  private async _registerFileProviderLock(data: TypeFileProviderPick) {
    const res = await this.scope.model.fileProvider.get(data, { cache: { force: true } });
    if (res) return res;
    const dataNew: Partial<EntityFileProvider> = {
      disabled: false,
      providerName: data.providerName,
      clientName: data.clientName,
      clientOptions: undefined,
    };
    return await this.scope.model.fileProvider.insert(dataNew);
  }

  async getClientOptions<N extends keyof IFileProviderRecord>(
    data: TypeFileProviderPick & { providerName: N },
    clientOptionsCustom?: TypeFileProviderClientOptionsByName<N>,
    clientOptionsDefault?: TypeFileProviderClientOptionsByName<N>,
  ) {
    const entityFileProvider = await this.bean.fileProvider.get(data);
    if (!entityFileProvider) return { entityFileProvider: undefined };
    const disabled = entityFileProvider.disabled;
    const fileProviderName = entityFileProvider.providerName as N;
    const clientName = entityFileProvider.clientName ?? 'default';
    const onionSlice = this.bean.onion.fileProvider.getOnionSliceEnabled(true, fileProviderName);
    if (!onionSlice) throw new Error(`File provider not found: ${fileProviderName}`);
    const beanFullName = onionSlice.beanOptions.beanFullName as N;
    const onionOptions =
      (onionSlice.beanOptions.options as TypeFileProviderOptionsByName<N> | undefined) ??
      ({} as TypeFileProviderOptionsByName<N>);
    const clientOptions = deepExtend(
      (clientOptionsDefault ?? {}) as TypeFileProviderClientOptionsByName<N>,
      onionOptions.base,
      onionOptions.clients?.[clientName as keyof typeof onionOptions.clients],
      entityFileProvider.clientOptions as TypeFileProviderClientOptionsByName<N> | undefined,
      clientOptionsCustom,
    ) as TypeFileProviderClientOptionsByName<N>;
    return { entityFileProvider, disabled, beanFullName, onionOptions, clientOptions };
  }
}
