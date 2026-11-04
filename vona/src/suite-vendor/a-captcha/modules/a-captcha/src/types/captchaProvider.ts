import type { OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';

export interface ICaptchaProviderRecord {}

export interface ICaptchaProviderExecute<TOKEN = string, PAYLOAD = unknown, INPUT = unknown> {
  create(
    options: IDecoratorCaptchaProviderOptions,
    payload?: unknown,
    previousToken?: TOKEN,
  ): Promise<ICaptchaProviderData<TOKEN, PAYLOAD>>;
  /** A true result means verification and one-time consumption have atomically committed. */
  verify(
    token: TOKEN,
    tokenInput: INPUT,
    options: IDecoratorCaptchaProviderOptions,
    payload?: unknown,
  ): Promise<boolean>;
  verifyImmediate?(
    token: TOKEN,
    tokenInput: INPUT,
    options: IDecoratorCaptchaProviderOptions,
  ): Promise<false | string>;
  updateToken?(
    token: TOKEN,
    tokenInput: INPUT,
    options: IDecoratorCaptchaProviderOptions,
  ): Promise<ICaptchaProviderData<TOKEN, PAYLOAD>>;
}

export interface ICaptchaProviderData<TOKEN = string, PAYLOAD = unknown> {
  /** Opaque reference to provider-owned verification state, never a public answer. */
  token?: TOKEN;
  payload: PAYLOAD;
  status?: 'accepted' | 'rejected' | 'unknown' | 'limited';
  /** Debug output, distinct from the private verification reference. */
  tokenPublic?: unknown;
  serverNow?: number;
  expiresAt?: number;
  /** Internal routing retention, which may outlive the primary proof for secondary verification. */
  routingExpiresAt?: number;
  resendAt?: number;
  retryAt?: number;
}

export interface IDecoratorCaptchaProviderOptions extends TypeOnionOptionsEnableSimple {
  ttl?: number;
  ttlSecondary?: number;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    captchaProvider: ServiceOnion<ICaptchaProviderRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    captchaProvider: OmitNever<ICaptchaProviderRecord>;
  }

  export interface IBeanSceneRecord {
    captchaProvider: never;
  }
}
