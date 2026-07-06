import { BeanBase, deepExtend } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { EntityImageProvider } from '../entity/imageProvider.ts';
import type {
  IImageProviderRecord,
  TypeImageProviderClientOptionsByName,
  TypeImageProviderOptionsByName,
  TypeImageProviderPick,
} from '../types/imageProvider.ts';

@Bean()
export class BeanImageProvider extends BeanBase {
  async get(data: TypeImageProviderPick) {
    if (!data.id && !data.clientName) data = { ...data, clientName: 'default' };
    const res = await this.scope.model.imageProvider.get(data);
    if (res) return res;
    if (data.id) throw new Error(`not found image provider: ${data.id}`);
    if (!data.providerName) throw new Error('Invalid image provider');
    return await this.scope.redlock.lockIsolate('imageProvider.register', async () => {
      return await this._registerImageProviderLock(data);
    });
  }

  private async _registerImageProviderLock(data: TypeImageProviderPick) {
    const res = await this.scope.model.imageProvider.get(data, { cache: { force: true } });
    if (res) return res;
    const dataNew: Partial<EntityImageProvider> = {
      disabled: false,
      providerName: data.providerName,
      clientName: data.clientName,
      clientOptions: undefined,
    };
    return await this.scope.model.imageProvider.insert(dataNew);
  }

  async getClientOptions<N extends keyof IImageProviderRecord>(
    data: TypeImageProviderPick & { providerName: N },
    clientOptionsCustom?: TypeImageProviderClientOptionsByName<N>,
    clientOptionsDefault?: TypeImageProviderClientOptionsByName<N>,
  ) {
    const entityImageProvider = await this.bean.imageProvider.get(data);
    if (!entityImageProvider) return { entityImageProvider: undefined };
    const disabled = entityImageProvider.disabled;
    const imageProviderName = entityImageProvider.providerName as N;
    const clientName = entityImageProvider.clientName ?? 'default';
    const onionSlice = this.bean.onion.imageProvider.getOnionSliceEnabled(true, imageProviderName);
    if (!onionSlice) throw new Error(`Image provider not found: ${imageProviderName}`);
    const beanFullName = onionSlice.beanOptions.beanFullName as N;
    const onionOptions =
      (onionSlice.beanOptions.options as TypeImageProviderOptionsByName<N> | undefined) ??
      ({} as TypeImageProviderOptionsByName<N>);
    const clientOptions = deepExtend(
      (clientOptionsDefault ?? {}) as TypeImageProviderClientOptionsByName<N>,
      onionOptions.base,
      onionOptions.clients?.[clientName as keyof typeof onionOptions.clients],
      entityImageProvider.clientOptions as TypeImageProviderClientOptionsByName<N> | undefined,
      clientOptionsCustom,
    ) as TypeImageProviderClientOptionsByName<N>;
    return { entityImageProvider, disabled, beanFullName, onionOptions, clientOptions };
  }
}
