import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type {
  IDecoratorPaySceneOptions,
  IPaySceneProviderCandidate,
  IPaySceneRecord,
  TypePaySceneExecuteByName,
} from '../types/payScene.ts';

@Bean()
export class BeanPayScene extends BeanBase {
  get<N extends keyof IPaySceneRecord>(paySceneName: N): TypePaySceneExecuteByName<N> {
    const onionSlice = this._getOnionSlice(paySceneName);
    return this.app.bean._getBean<TypePaySceneExecuteByName<N>>(
      onionSlice.beanOptions.beanFullName as never,
    );
  }

  getOptions<N extends keyof IPaySceneRecord>(paySceneName: N): IDecoratorPaySceneOptions {
    const onionSlice = this._getOnionSlice(paySceneName);
    return onionSlice.beanOptions.options as IDecoratorPaySceneOptions;
  }

  async resolveProvider<N extends keyof IPaySceneRecord>(
    paySceneName: N,
    input: {
      userId: TableIdentity;
      businessReference: string;
      amountMinor: number;
      currency: string;
    },
  ) {
    const options = this.getOptions(paySceneName);
    const providers = this._getProviderCandidates(options);
    const candidateKey = await this._resolveProviderCandidateKey(
      paySceneName,
      options,
      providers,
      input,
    );
    const candidate = providers.find(item => item.key === candidateKey);
    if (!candidate) {
      this.app.throw(
        500,
        `payment scene selected an unavailable provider candidate: ${candidateKey}`,
      );
    }
    const { clientOptions: providerOptions } = this.bean.payProvider.resolveByName(
      candidate.providerName,
      candidate.clientName,
    );
    return {
      ...candidate,
      environment: providerOptions.environment,
    };
  }

  private _getProviderCandidates(options: IDecoratorPaySceneOptions) {
    const providers = options.providers;
    if (!providers?.length) this.app.throw(500, 'payment scene has no provider candidates');
    const keys = new Set<string>();
    for (const provider of providers) {
      if (!provider.key || !provider.providerName || !provider.clientName) {
        this.app.throw(500, 'payment scene has an invalid provider candidate');
      }
      if (keys.has(provider.key)) {
        this.app.throw(500, `payment scene has a duplicate provider candidate: ${provider.key}`);
      }
      keys.add(provider.key);
    }
    return providers;
  }

  private async _resolveProviderCandidateKey<N extends keyof IPaySceneRecord>(
    paySceneName: N,
    options: IDecoratorPaySceneOptions,
    providers: readonly IPaySceneProviderCandidate[],
    input: {
      userId: TableIdentity;
      businessReference: string;
      amountMinor: number;
      currency: string;
    },
  ) {
    if (providers.length === 1 && !options.resolveProvider) return providers[0]!.key;
    if (!options.resolveProvider) {
      this.app.throw(500, 'payment scene requires a provider resolver for multiple candidates');
    }
    return await options.resolveProvider(this.ctx, {
      payScene: paySceneName,
      providers,
      ...input,
    });
  }

  private _getOnionSlice<N extends keyof IPaySceneRecord>(paySceneName: N) {
    const onionSlice = this.bean.onion.payScene.getOnionSliceEnabled(true, paySceneName);
    if (!onionSlice) this.app.throw(404, `payment scene not found: ${String(paySceneName)}`);
    return onionSlice;
  }
}
