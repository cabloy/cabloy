import type { VonaContext } from 'vona';

import { getRandomInt } from '@cabloy/utils';
import { BeanBase, beanFullNameFromOnionName, uuidv4 } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { ICaptchaData, ICaptchaDataCache } from '../types/captcha.ts';
import type {
  ICaptchaAuthorization,
  ICaptchaProviderData,
  ICaptchaProviderExecute,
  ICaptchaProviderRecord,
} from '../types/captchaProvider.ts';
import type {
  ICaptchaSceneOptionsProviders,
  ICaptchaSceneOptionsResolverResult,
  ICaptchaSceneRecord,
} from '../types/captchaScene.ts';
import type { ICaptchaSnapshot } from './cacheRedis.captcha.ts';

@Bean()
export class BeanCaptcha extends BeanBase {
  async create(sceneName: keyof ICaptchaSceneRecord, context?: unknown): Promise<ICaptchaData> {
    const provider = await this._resolveProvider(sceneName);
    if (!provider) throw new Error(`not found captcha provider for scene: ${sceneName}`);
    const beanInstance = this._getProviderInstance(provider.name);
    if (beanInstance.bound === true)
      return await this._createBound(sceneName, provider, beanInstance, context);
    const captcha = await beanInstance.create(provider.options);
    const id = uuidv4();
    const data: ICaptchaDataCache = {
      scene: sceneName,
      provider: provider.name,
      token: captcha.token,
      revision: uuidv4(),
    };
    const created = await this.scope.cacheRedis.captcha.createImage(
      id,
      data,
      provider.options.ttl ?? this.scope.config.captchaProvider.ttl,
    );
    if (!created) throw new Error('captcha identity collision');
    const result: ICaptchaData = { id, provider: provider.name, payload: captcha.payload };
    if (this.scope.config.captcha.showToken) result.token = captcha.token;
    return result;
  }

  private async _createBound(
    sceneName: keyof ICaptchaSceneRecord,
    provider: ICaptchaSceneOptionsResolverResult,
    beanInstance: ICaptchaProviderExecute,
    context: unknown,
  ): Promise<ICaptchaData> {
    const authorization = await this._authorize(beanInstance, context, 'issue', sceneName);
    if (!authorization) return this.app.throw(403);
    const cache = this.scope.cacheRedis.captcha;
    const id = `${cache.boundPrefix()}${uuidv4()}`;
    const pending: ICaptchaDataCache = {
      scene: sceneName,
      provider: provider.name,
      bound: {
        binding: authorization.binding,
        scope: authorization.scope,
        state: 'pending',
        expiresAt: 0,
        resendAt: 0,
        attemptsRemaining: authorization.maxAttempts,
        version: 0,
      },
    };
    const reservation = await cache.reserveBound(id, pending, authorization);
    if (!reservation.reserved) {
      return {
        id: '',
        provider: provider.name,
        payload: undefined,
        status: 'limited',
        resendAt: reservation.resendAt || undefined,
        retryAt: reservation.retryAt,
      };
    }
    const snapshot = reservation.snapshot;
    const timing = {
      expiresAt: snapshot.data.bound!.expiresAt,
      resendAt: snapshot.data.bound!.resendAt,
    };
    let captcha: ICaptchaProviderData;
    try {
      // A reservation authorizes exactly one external attempt. Never retry sends.
      captcha = await beanInstance.create(provider.options, context);
    } catch {
      await cache.finalizeBound(id, snapshot);
      return { id: '', provider: provider.name, payload: undefined, status: 'unknown', ...timing };
    }
    const outcome = captcha.outcome ?? 'accepted';
    if (outcome !== 'accepted' || captcha.token === undefined || captcha.token === null) {
      await cache.finalizeBound(id, snapshot);
      return {
        id: '',
        provider: provider.name,
        payload: undefined,
        status: outcome === 'rejected' ? 'rejected' : 'unknown',
        ...timing,
      };
    }
    const active: ICaptchaDataCache = {
      ...snapshot.data,
      token: captcha.token,
      bound: { ...snapshot.data.bound!, state: 'active', version: 1 },
    };
    const finalized = await cache.finalizeBound(id, snapshot, active);
    if (!finalized)
      return { id: '', provider: provider.name, payload: undefined, status: 'unknown', ...timing };
    const result: ICaptchaData = {
      id,
      provider: provider.name,
      payload: captcha.payload,
      status: 'accepted',
      ...timing,
    };
    // Generic showToken never grants disclosure for a bound provider.
    if (captcha.exposeToken === true) result.token = captcha.token;
    return result;
  }

  async refresh(id: string, sceneName: keyof ICaptchaSceneRecord) {
    const cache = this.scope.cacheRedis.captcha;
    const snapshot = await cache.snapshot(id);
    if (!snapshot) return await this.create(sceneName);
    const data = snapshot.data;
    if (data.scene !== sceneName) return this.app.throw(403);
    const beanInstance = this._getProviderInstance(data.provider);
    if (data.bound || beanInstance.bound === true) return this.app.throw(403);
    const options = this._getProviderOptions(data.scene, data.provider);
    if (!options) return this.app.throw(403);
    const captcha = await beanInstance.create(options);
    const next = {
      scene: sceneName,
      provider: data.provider,
      token: captcha.token,
      revision: uuidv4(),
    };
    if (
      !(await cache.compareAndSet(
        id,
        snapshot,
        next,
        options.ttl ?? this.scope.config.captchaProvider.ttl,
      ))
    ) {
      return this.app.throw(403);
    }
    const result: ICaptchaData = { id, provider: data.provider, payload: captcha.payload };
    if (this.scope.config.captcha.showToken) result.token = captcha.token;
    return result;
  }

  async verify(
    id: string,
    token: unknown,
    sceneName: keyof ICaptchaSceneRecord,
    context?: unknown,
  ): Promise<boolean> {
    const cache = this.scope.cacheRedis.captcha;
    const snapshot = await cache.snapshot(id);
    if (!snapshot || snapshot.data.scene !== sceneName) return false;
    const data = snapshot.data;
    const beanInstance = this._getProviderInstance(data.provider);
    if (data.bound || beanInstance.bound === true) {
      if (!data.bound || beanInstance.bound !== true) return false;
      const authorization = await this._authorize(beanInstance, context, 'consume', sceneName);
      if (!authorization) return false;
      return await this._verifyBound(id, token, sceneName, beanInstance, authorization, snapshot);
    }
    if (data.token2) {
      const consumed = await cache.compareAndSet(id, snapshot);
      return consumed && data.token2 === token;
    }
    const options = this._getProviderOptions(data.scene, data.provider);
    if (!options || !data.token) return false;
    const verified = await beanInstance.verify(data.token, token, options);
    const changed = await cache.compareAndSet(
      id,
      snapshot,
      verified ? undefined : { ...data, token: undefined, revision: uuidv4() },
    );
    return verified && changed;
  }

  private async _verifyBound(
    id: string,
    token: unknown,
    sceneName: keyof ICaptchaSceneRecord,
    beanInstance: ICaptchaProviderExecute,
    authorization: ICaptchaAuthorization,
    original: ICaptchaSnapshot,
  ): Promise<boolean> {
    const cache = this.scope.cacheRedis.captcha;
    let snapshot: ICaptchaSnapshot | undefined = original;
    // At most five competing wrong writes exist for this generation. A stale
    // wrong verdict is retried against the new snapshot, never a new generation.
    for (let retry = 0; retry < 5 && snapshot; retry++) {
      const data = snapshot.data;
      const bound = data.bound;
      if (
        !bound ||
        bound.state !== 'active' ||
        bound.attemptsRemaining <= 0 ||
        data.scene !== sceneName ||
        data.provider !== original.data.provider ||
        bound.scope !== authorization.scope ||
        !this._bindingMatches(bound.binding, authorization.binding)
      ) {
        return false;
      }
      const options = this._getProviderOptions(sceneName, data.provider);
      if (!options || data.token === undefined) return false;
      const verified = await beanInstance.verify(data.token, token, options);
      const committed = await cache.consumeBound(id, snapshot, verified);
      if (committed !== -1 || verified) return verified && committed === 1;
      snapshot = await cache.snapshot(id);
    }
    return false;
  }

  async verifyImmediate(id: string, token: unknown): Promise<false | string> {
    const cache = this.scope.cacheRedis.captcha;
    const snapshot = await cache.snapshot(id);
    if (!snapshot) return false;
    const data = snapshot.data;
    const beanInstance = this._getProviderInstance(data.provider);
    if (data.bound || beanInstance.bound === true || !data.token) return false;
    const options = this._getProviderOptions(data.scene, data.provider);
    if (!options) return false;
    const verified = await beanInstance.verify(data.token, token, options);
    if (!verified) {
      await cache.compareAndSet(id, snapshot, { ...data, token: undefined, revision: uuidv4() });
      return false;
    }
    const tokenSecondary = uuidv4();
    const next = { ...data, token: undefined, token2: tokenSecondary, revision: uuidv4() };
    const changed = await cache.compareAndSet(
      id,
      snapshot,
      next,
      options.ttlSecondary ?? this.scope.config.captchaProvider.ttlSecondary,
    );
    return changed ? tokenSecondary : false;
  }

  async getCaptchaData(id: string) {
    return await this.scope.cacheRedis.captcha.get(id, { updateAgeOnGet: false });
  }

  async updateCaptchaToken(id: string, token: unknown) {
    const cache = this.scope.cacheRedis.captcha;
    const snapshot = await cache.snapshot(id);
    if (!snapshot) return this.app.throw(403);
    const data = snapshot.data;
    const beanInstance = this._getProviderInstance(data.provider);
    if (data.bound || beanInstance.bound === true) return this.app.throw(403);
    const options = this._getProviderOptions(data.scene, data.provider);
    if (!options) return this.app.throw(403);
    if (
      !(await cache.compareAndSet(
        id,
        snapshot,
        { ...data, token, revision: uuidv4() },
        options.ttl ?? this.scope.config.captchaProvider.ttl,
      ))
    ) {
      return this.app.throw(403);
    }
  }

  private async _authorize(
    provider: ICaptchaProviderExecute,
    context: unknown,
    operation: 'issue' | 'consume',
    sceneName: keyof ICaptchaSceneRecord,
  ): Promise<ICaptchaAuthorization | undefined> {
    const authorization = await provider.authorize?.(context, operation, sceneName);
    if (!authorization) return;
    this.scope.cacheRedis.captcha.validateAuthorization(authorization);
    // Snapshot only the server-authorized contract; later provider work cannot
    // mutate the binding/policy already used for this issuance or consumption.
    return {
      ...authorization,
      binding: {
        recipient: authorization.binding.recipient,
        purpose: authorization.binding.purpose,
        ...(authorization.binding.subject === undefined
          ? {}
          : { subject: authorization.binding.subject }),
      },
      recipientLimits: authorization.recipientLimits.map(limit => ({ ...limit })),
      ipLimits: authorization.ipLimits.map(limit => ({ ...limit })),
    };
  }

  private _bindingMatches(
    a: ICaptchaAuthorization['binding'],
    b: ICaptchaAuthorization['binding'],
  ) {
    return a.recipient === b.recipient && a.purpose === b.purpose && a.subject === b.subject;
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
