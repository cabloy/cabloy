import type { OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';

import type { ICaptchaSceneRecord } from './captchaScene.ts';

export interface ICaptchaProviderRecord {}

export interface ICaptchaBinding {
  recipient: string;
  purpose: string;
  subject?: string;
}

export interface ICaptchaLimit {
  limit: number;
  windowMs: number;
}

/** Server-authorized policy, never populated from generic captcha request JSON. */
export interface ICaptchaAuthorization {
  binding: ICaptchaBinding;
  scope: string;
  ip: string;
  ttl: number;
  cooldown: number;
  maxAttempts: number;
  recipientLimits: ICaptchaLimit[];
  ipLimits: ICaptchaLimit[];
}

export interface ICaptchaProviderExecute<TOKEN = unknown, PAYLOAD = unknown> {
  readonly bound?: boolean;
  authorize?(
    context: unknown,
    operation: 'issue' | 'consume',
    sceneName: keyof ICaptchaSceneRecord,
  ): ICaptchaAuthorization | undefined | Promise<ICaptchaAuthorization | undefined>;
  create(
    options: IDecoratorCaptchaProviderOptions,
    context?: unknown,
  ): Promise<ICaptchaProviderData<TOKEN, PAYLOAD>>;
  verify(
    token: TOKEN,
    tokenInput: TOKEN,
    options: IDecoratorCaptchaProviderOptions,
  ): Promise<boolean>;
}

export interface ICaptchaProviderData<TOKEN = unknown, PAYLOAD = unknown> {
  token: TOKEN;
  payload: PAYLOAD;
  outcome?: 'accepted' | 'rejected' | 'unknown';
  /** Bound providers alone decide whether their actual transport may expose the token. */
  exposeToken?: boolean;
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
