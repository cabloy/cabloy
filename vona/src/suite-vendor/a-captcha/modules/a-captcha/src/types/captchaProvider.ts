import type { OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';

export interface ICaptchaProviderRecord {}

export interface ICaptchaProviderExecute<TOKEN = unknown, PAYLOAD = unknown> {
  create(options: IDecoratorCaptchaProviderOptions): Promise<ICaptchaProviderData<TOKEN, PAYLOAD>>;
  verify(
    token: TOKEN,
    tokenInput: TOKEN,
    options: IDecoratorCaptchaProviderOptions,
  ): Promise<boolean>;
}

export interface ICaptchaProviderData<TOKEN = unknown, PAYLOAD = unknown> {
  token: TOKEN;
  payload: PAYLOAD;
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
