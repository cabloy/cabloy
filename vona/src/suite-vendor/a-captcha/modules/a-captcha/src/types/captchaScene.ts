import type { OmitNever, PowerPartial, VonaContext } from 'vona';
import type { ServiceOnion, TypeUseOnionOmitOptionsEnable } from 'vona-module-a-onion';

import type { ICaptchaProviderRecord } from './captchaProvider.ts';

export interface ICaptchaSceneRecord {}

export type ICaptchaSceneOptionsProviders = {
  [K in keyof ICaptchaProviderRecord]?:
    | PowerPartial<TypeUseOnionOmitOptionsEnable<ICaptchaProviderRecord[K]>>
    | boolean;
};

export interface ICaptchaSceneOptionsResolverResult<
  T extends keyof ICaptchaProviderRecord = keyof ICaptchaProviderRecord,
> {
  name: T;
  options: ICaptchaProviderRecord[T];
}

export type TypeCaptchaSceneOptionsResolver = (
  ctx: VonaContext,
  providers: ICaptchaProviderRecord,
) => Promise<keyof ICaptchaProviderRecord>;

export interface IDecoratorCaptchaSceneOptions {
  resolver?: TypeCaptchaSceneOptionsResolver;
  providers: ICaptchaSceneOptionsProviders;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    captchaScene: ServiceOnion<ICaptchaSceneRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    captchaScene: OmitNever<ICaptchaSceneRecord>;
  }

  export interface IBeanSceneRecord {
    captchaScene: never;
  }
}
