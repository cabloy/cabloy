import type { VonaContext } from 'vona';

import { getRandomInt } from '@cabloy/utils';
import { BeanBase, beanFullNameFromOnionName, uuidv4 } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { ICaptchaData } from '../types/captcha.ts';
import type {
  ICaptchaProviderData,
  ICaptchaProviderExecute,
  ICaptchaProviderRecord,
} from '../types/captchaProvider.ts';
import type {
  ICaptchaSceneOptionsProviders,
  ICaptchaSceneOptionsResolverResult,
  ICaptchaSceneRecord,
} from '../types/captchaScene.ts';

@Bean()
export class BeanCaptcha extends BeanBase {
  async create(sceneName: keyof ICaptchaSceneRecord, payload?: unknown): Promise<ICaptchaData> {
    const provider = await this._resolveProvider(sceneName);
    if (!provider) throw new Error(`not found captcha provider for scene: ${sceneName}`);
    const captcha = await this._getProviderInstance(provider.name).create(
      provider.options,
      payload,
    );
    return this._create(sceneName, provider, captcha);
  }

  private async _create(
    sceneName: keyof ICaptchaSceneRecord,
    provider: ICaptchaSceneOptionsResolverResult,
    captcha: ICaptchaProviderData,
    id = uuidv4(),
  ): Promise<ICaptchaData> {
    const result: ICaptchaData = { id: '', provider: provider.name, payload: captcha.payload };
    if (captcha.status !== undefined) result.status = captcha.status;
    for (const key of ['serverNow', 'expiresAt', 'resendAt', 'retryAt'] as const) {
      if (captcha[key] !== undefined) result[key] = captcha[key];
    }
    if (captcha.status !== undefined && captcha.status !== 'accepted') return result;
    if (typeof captcha.token !== 'string' || !captcha.token)
      throw new Error('missing captcha reference');
    if (captcha.expiresAt === undefined) throw new Error('missing captcha expiry');
    const published = await this.scope.cacheRedis.captcha.publish(
      id,
      { scene: sceneName, provider: provider.name, token: captcha.token },
      captcha.routingExpiresAt ?? captcha.expiresAt,
    );
    result.serverNow = published.serverNow;
    if (!published.published) return { ...result, status: 'unknown' };
    result.id = id;
    if (this.scope.config.captcha.showToken) result.token = captcha.tokenPublic;
    return result;
  }

  async refresh(
    id: string | undefined,
    sceneName: keyof ICaptchaSceneRecord,
    payload?: unknown,
  ): Promise<ICaptchaData> {
    const data = id ? await this.getCaptchaData(id) : undefined;
    if (!data) return this.create(sceneName, payload);
    if (data.scene !== sceneName) return this.app.throw(403);
    const options = this._getProviderOptions(data.scene, data.provider);
    if (!options) return this.app.throw(403);
    const captcha = await this._getProviderInstance(data.provider).create(
      options,
      payload,
      data.token,
    );
    return this._create(
      sceneName,
      { name: data.provider, options },
      captcha,
      captcha.token === data.token ? id : undefined,
    );
  }

  async verify(
    id: string,
    token: unknown,
    sceneName: keyof ICaptchaSceneRecord,
    payload?: unknown,
  ): Promise<boolean> {
    const data = await this.getCaptchaData(id);
    if (!data || data.scene !== sceneName) return false;
    const options = this._getProviderOptions(data.scene, data.provider);
    if (!options) return false;
    return this._getProviderInstance(data.provider).verify(data.token, token, options, payload);
  }

  async verifyImmediate(id: string, token: unknown): Promise<false | string> {
    const data = await this.getCaptchaData(id);
    if (!data) return false;
    const options = this._getProviderOptions(data.scene, data.provider);
    if (!options) return false;
    const provider = this._getProviderInstance(data.provider);
    return provider.verifyImmediate ? provider.verifyImmediate(data.token, token, options) : false;
  }

  async getCaptchaData(id: string) {
    return this.scope.cacheRedis.captcha.get(id, { updateAgeOnGet: false });
  }

  async updateCaptchaToken(id: string, token: unknown) {
    const data = await this.getCaptchaData(id);
    if (!data) return this.app.throw(403);
    const options = this._getProviderOptions(data.scene, data.provider);
    const provider = this._getProviderInstance(data.provider);
    if (!options || !provider.updateToken) return this.app.throw(403);
    const captcha = await provider.updateToken(data.token, token, options);
    if (captcha.token !== data.token) throw new Error('captcha update changed reference');
    const result = await this._create(data.scene, { name: data.provider, options }, captcha, id);
    if (!result.id) return this.app.throw(403);
  }

  private _getProviderInstance(providerName: keyof ICaptchaProviderRecord) {
    const beanFullName = beanFullNameFromOnionName(providerName, 'captchaProvider');
    return this.bean._getBean(beanFullName) as unknown as ICaptchaProviderExecute;
  }

  private _getProviderOptions(
    sceneName: keyof ICaptchaSceneRecord,
    providerName: keyof ICaptchaProviderRecord,
  ) {
    return this._getProviders(sceneName)[providerName];
  }

  private async _resolveProvider(
    sceneName: keyof ICaptchaSceneRecord,
  ): Promise<ICaptchaSceneOptionsResolverResult | undefined> {
    const providers = this._getProviders(sceneName);
    if (Object.keys(providers).length === 0) return;
    const onionOptions = this.bean.onion.captchaScene.getOnionOptionsDynamic(sceneName);
    const resolver = onionOptions?.resolver ?? resolverDefault;
    const providerName = await resolver(this.ctx, providers);
    if (!providerName || !providers[providerName]) return;
    return { name: providerName, options: providers[providerName] };
  }

  private _getProviders(sceneName: keyof ICaptchaSceneRecord) {
    const scene = this.bean.onion.captchaScene.getOnionSlice(sceneName);
    if (!scene) throw new Error(`not found captcha scene: ${sceneName}`);
    const options = this.bean.onion.captchaScene.getOnionOptionsDynamic(sceneName);
    return this._prepareProviders(options?.providers);
  }

  private _prepareProviders(providers?: ICaptchaSceneOptionsProviders): ICaptchaProviderRecord {
    const result: ICaptchaProviderRecord = {} as any;
    if (!providers) return result;
    for (const _key of Object.keys(providers)) {
      const key = _key as keyof ICaptchaProviderRecord;
      const providerOptions = providers[key];
      if (providerOptions === false) continue;
      const onion = this.bean.onion.captchaProvider;
      const slice = onion.getOnionSlice(key);
      if (!slice) continue;
      const options = onion.getOnionOptionsDynamic(
        key,
        typeof providerOptions === 'object' ? providerOptions : undefined,
      );
      if (!this.bean.onion.checkOnionOptionsEnabled(options)) continue;
      Object.assign(result, { [key]: options });
    }
    return result;
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
