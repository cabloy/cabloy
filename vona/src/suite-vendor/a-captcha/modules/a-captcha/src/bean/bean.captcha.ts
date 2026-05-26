import type { VonaContext } from 'vona';

import { getRandomInt } from '@cabloy/utils';
import { BeanBase, beanFullNameFromOnionName, deepExtend, uuidv4 } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { ICaptchaData, ICaptchaDataCache } from '../types/captcha.ts';
import type { ICaptchaProviderExecute, ICaptchaProviderRecord } from '../types/captchaProvider.ts';
import type {
  ICaptchaSceneOptionsProviders,
  ICaptchaSceneOptionsResolverResult,
  ICaptchaSceneRecord,
} from '../types/captchaScene.ts';

import { SymbolCacheSceneProviders } from '../lib/const.ts';

@Bean()
export class BeanCaptcha extends BeanBase {
  async create(sceneName: keyof ICaptchaSceneRecord): Promise<ICaptchaData> {
    // resolve provider
    const provider = await this._resolveProvider(sceneName);
    if (!provider) throw new Error(`not found captcha provider for scene: ${sceneName}`);
    // create
    const beanInstance = this._getProviderInstance(provider.name);
    const captcha = await beanInstance.create(provider.options);
    // data
    const id = uuidv4();
    const captchaData: ICaptchaDataCache = {
      scene: sceneName,
      provider: provider.name,
      token: captcha.token,
    };
    // cache
    await this.scope.cacheRedis.captcha.set(captchaData, id, {
      ttl: provider.options.ttl ?? this.scope.config.captchaProvider.ttl,
    });
    this.$loggerChild('captcha').debug(
      () =>
        `captcha.create: id:${id}, sceneName:${sceneName}, provider:${provider.name}, token:${captcha.token}`,
    );
    // result
    const result: ICaptchaData = { id, provider: provider.name, payload: captcha.payload };
    if (this.scope.config.captcha.showToken) {
      result.token = captcha.token;
    }
    return result;
  }

  async refresh(id: string, sceneName: keyof ICaptchaSceneRecord) {
    let captchaData = await this.getCaptchaData(id);
    if (!captchaData) {
      // create
      return await this.create(sceneName);
    }
    // scene
    if (captchaData.scene !== sceneName) this.app.throw(403);
    // create
    const beanInstance = this._getProviderInstance(captchaData.provider);
    const providerOptions = this._getProviderOptions(captchaData.scene, captchaData.provider)!;
    const captcha = await beanInstance.create(providerOptions);
    // data
    captchaData = { scene: sceneName, provider: captchaData.provider, token: captcha.token };
    // cache
    await this.scope.cacheRedis.captcha.set(captchaData, id, {
      ttl: providerOptions.ttl ?? this.scope.config.captchaProvider.ttl,
    });
    this.$loggerChild('captcha').debug(
      () =>
        `captcha.refresh: id:${id}, sceneName:${sceneName}, provider:${captchaData.provider}, token:${captcha.token}`,
    );
    // result
    const result: ICaptchaData = { id, provider: captchaData.provider, payload: captcha.payload };
    if (this.scope.config.captcha.showToken) {
      result.token = captcha.token;
    }
    return result;
  }

  async verify(id: string, token: unknown, sceneName: keyof ICaptchaSceneRecord): Promise<boolean> {
    const captchaData = await this.getCaptchaData(id);
    const verified = await this._verifyInner(captchaData, id, token, sceneName);
    this.$loggerChild('captcha').debug(
      () =>
        `captcha.verify: id:${id}, sceneName:${sceneName}, provider:${captchaData?.provider}, token:${token}, tokenWanted:${captchaData?.token}`,
    );
    return verified;
  }

  private async _verifyInner(
    captchaData: ICaptchaDataCache | undefined,
    id: string,
    token: unknown,
    sceneName: keyof ICaptchaSceneRecord,
  ): Promise<boolean> {
    if (!captchaData) return false;
    // scene
    if (captchaData.scene !== sceneName) return false;
    // tokenSecondary
    const tokenSecondary = captchaData.token2;
    if (tokenSecondary) {
      // delete cache
      await this.scope.cacheRedis.captcha.del(id);
      return tokenSecondary === token;
    }
    // provider
    const beanInstance = this._getProviderInstance(captchaData.provider);
    const providerOptions = this._getProviderOptions(captchaData.scene, captchaData.provider)!;
    // verify
    if (!captchaData.token) return false;
    const verified = await beanInstance.verify(captchaData.token, token, providerOptions);
    if (!verified) {
      // update token. not delete cache for refresh
      captchaData = { ...captchaData, token: undefined };
      await this.scope.cacheRedis.captcha.set(captchaData, id, {
        ttl: providerOptions.ttl ?? this.scope.config.captchaProvider.ttl,
      });
      return false;
    }
    // delete cache
    await this.scope.cacheRedis.captcha.del(id);
    // ok
    return true;
  }

  async verifyImmediate(id: string, token: unknown): Promise<false | string> {
    let captchaData = await this.getCaptchaData(id);
    if (!captchaData) return false;
    if (!captchaData.token) return false;
    // provider
    const beanInstance = this._getProviderInstance(captchaData.provider);
    const providerOptions = this._getProviderOptions(captchaData.scene, captchaData.provider)!;
    // verify
    const verified = await beanInstance.verify(captchaData.token, token, providerOptions);
    if (!verified) {
      // update token. not delete cache for refresh
      captchaData = { ...captchaData, token: undefined };
      await this.scope.cacheRedis.captcha.set(captchaData, id, {
        ttl: providerOptions.ttl ?? this.scope.config.captchaProvider.ttl,
      });
      return false;
    }
    // tokenSecondary
    const tokenSecondary = uuidv4();
    captchaData = { ...captchaData, token: undefined, token2: tokenSecondary };
    // update cache
    await this.scope.cacheRedis.captcha.set(captchaData, id, {
      ttl: providerOptions.ttlSecondary ?? this.scope.config.captchaProvider.ttlSecondary,
    });
    // ok
    return tokenSecondary;
  }

  async getCaptchaData(id: string) {
    return await this.scope.cacheRedis.captcha.get(id);
  }

  async updateCaptchaToken(id: string, token: unknown) {
    let captchaData = await this.getCaptchaData(id);
    if (!captchaData) return this.app.throw(403);
    // provider
    const providerOptions = this._getProviderOptions(captchaData.scene, captchaData.provider)!;
    // update cache
    captchaData = { ...captchaData, token };
    await this.scope.cacheRedis.captcha.set(captchaData, id, {
      ttl: providerOptions.ttl ?? this.scope.config.captchaProvider.ttl,
    });
  }

  private _getProviderInstance(providerName: keyof ICaptchaProviderRecord) {
    const beanFullName = beanFullNameFromOnionName(providerName, 'captchaProvider');
    return this.bean._getBean(beanFullName) as unknown as ICaptchaProviderExecute;
  }

  private _getProviderOptions(
    sceneName: keyof ICaptchaSceneRecord,
    providerName: keyof ICaptchaProviderRecord,
  ) {
    // providers
    const providers = this._getProviders(sceneName);
    return providers[providerName];
  }

  private async _resolveProvider(
    sceneName: keyof ICaptchaSceneRecord,
  ): Promise<ICaptchaSceneOptionsResolverResult | undefined> {
    // providers
    const providers = this._getProviders(sceneName);
    if (Object.keys(providers).length === 0) return;
    // resolver
    const onionSlice = this.bean.onion.captchaScene.getOnionSlice(sceneName);
    const onionOptions = onionSlice.beanOptions.options;
    const resolver = onionOptions?.resolver ?? resolverDefault;
    const providerName = await resolver(this.ctx, providers);
    if (!providerName) return;
    return { name: providerName, options: providers[providerName] };
  }

  private _getProviders(sceneName: keyof ICaptchaSceneRecord) {
    if (!this.app.meta[SymbolCacheSceneProviders]) this.app.meta[SymbolCacheSceneProviders] = {};
    if (!this.app.meta[SymbolCacheSceneProviders][sceneName]) {
      const onionSlice = this.bean.onion.captchaScene.getOnionSlice(sceneName);
      if (!onionSlice) throw new Error(`not found captcha scene: ${sceneName}`);
      const onionOptions = onionSlice.beanOptions.options;
      this.app.meta[SymbolCacheSceneProviders][sceneName] = this._prepareProviders(
        onionOptions?.providers,
      );
    }
    return this.app.meta[SymbolCacheSceneProviders][sceneName];
  }

  private _prepareProviders(providers?: ICaptchaSceneOptionsProviders): ICaptchaProviderRecord {
    if (!providers) return {} as any;
    const providersNew: ICaptchaProviderRecord = {} as any;
    for (const _key in providers) {
      const key: keyof ICaptchaProviderRecord = _key as any;
      const providerOptions = providers[key];
      if (providerOptions === false) continue;
      const onionSlice = this.bean.onion.captchaProvider.getOnionSliceEnabled(true, key);
      if (!onionSlice) continue;
      providersNew[key] = deepExtend({}, onionSlice.beanOptions.options, providerOptions);
    }
    return providersNew;
  }
}

async function resolverDefault(
  _ctx: VonaContext,
  providers: ICaptchaProviderRecord,
): Promise<keyof ICaptchaProviderRecord> {
  const keys = Object.keys(providers);
  const index = getRandomInt(keys.length, 0);
  return keys[index] as keyof ICaptchaProviderRecord;
}
