import type { Ref } from 'vue';
import type { BeanBase, BeanContainer, IMonkeyAppInitialize, IMonkeyBeanInit } from 'zova';

import { ref, watch } from 'vue';
import { BeanSimple } from 'zova';

import type { ModelSdk } from './model/sdk.ts';

export class Monkey extends BeanSimple implements IMonkeyBeanInit, IMonkeyAppInitialize {
  private _modelSdk: Ref<ModelSdk | undefined> = ref();
  private _sdkGeneration = 0;

  async beanInit(bean: BeanContainer, beanInstance: BeanBase) {
    const self = this;
    // $sdk
    bean.defineProperty(beanInstance, '$sdk', {
      enumerable: false,
      configurable: true,
      get() {
        return self._modelSdk;
      },
    });
  }

  async appInitialize() {
    await this._loadSdk();
    this.ctx.util.instanceScope(() => {
      watch(
        () => {
          return this.app.meta.locale.current;
        },
        async () => {
          await this._loadSdk();
        },
      );
    });
  }

  private async _loadSdk() {
    const generation = ++this._sdkGeneration;
    const locale = this.app.meta.locale.current;
    const sdk = await this.app.bean._getBeanSelector('a-openapi.model.sdk', true, locale);
    if (generation === this._sdkGeneration && locale === this.app.meta.locale.current) {
      this._modelSdk.value = sdk;
    }
  }
}
