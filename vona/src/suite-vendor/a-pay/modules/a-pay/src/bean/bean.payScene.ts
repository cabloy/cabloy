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
    return onionSlice.beanOptions.options as unknown as IDecoratorPaySceneOptions;
  }

  async getAvailableProviderCandidates<N extends keyof IPaySceneRecord>(
    paySceneName: N,
    input: {
      userId: TableIdentity;
      businessReference: string;
      amountMinor: number;
      currency: string;
      providerCandidateKey?: string;
    },
  ) {
    const options = this.getOptions(paySceneName);
    return await this._getAvailableProviderCandidates(options, {
      payScene: paySceneName,
      ...input,
      providers: this._getProviderCandidates(options),
    });
  }

  async resolveProvider<N extends keyof IPaySceneRecord>(
    paySceneName: N,
    input: {
      userId: TableIdentity;
      businessReference: string;
      amountMinor: number;
      currency: string;
      providerCandidateKey?: string;
    },
  ) {
    const options = this.getOptions(paySceneName);
    const allProviders = this._getProviderCandidates(options);
    if (
      input.providerCandidateKey &&
      !allProviders.some(item => item.key === input.providerCandidateKey)
    ) {
      this.app.throw(422, 'payment provider candidate is unavailable');
    }
    const providers = await this._getAvailableProviderCandidates(options, {
      payScene: paySceneName,
      ...input,
      providers: allProviders,
    });
    if (
      input.providerCandidateKey &&
      !providers.some(item => item.key === input.providerCandidateKey)
    ) {
      this.app.throw(422, 'payment provider candidate is unavailable');
    }
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
      capabilities: providerOptions.capabilities,
    };
  }

  private async _getAvailableProviderCandidates(
    options: IDecoratorPaySceneOptions,
    input: Omit<
      Parameters<NonNullable<IDecoratorPaySceneOptions['isProviderAvailable']>>[1],
      'candidate'
    >,
  ) {
    const providers = input.providers;
    const available = await Promise.all(
      providers.map(async candidate => ({
        candidate,
        available: options.isProviderAvailable
          ? await options.isProviderAvailable(this.ctx, { ...input, candidate })
          : true,
      })),
    );
    const result = available.filter(item => item.available).map(item => item.candidate);
    if (!result.length) this.app.throw(409, 'payment scene has no available provider candidates');
    return result;
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
      providerCandidateKey?: string;
    },
  ) {
    if (input.providerCandidateKey) {
      if (!providers.some(item => item.key === input.providerCandidateKey)) {
        this.app.throw(422, 'payment provider candidate is unavailable');
      }
      return input.providerCandidateKey;
    }
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
