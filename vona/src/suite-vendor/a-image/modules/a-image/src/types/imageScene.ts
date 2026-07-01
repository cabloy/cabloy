import type { OmitNever, VonaContext } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';

import type { IImageProviderRecord } from './imageProvider.ts';

export interface IImageSceneRecord {}

export interface IImageSceneOptionsUpload {
  maxSize?: number;
  mimeTypes?: string[];
  extensions?: string[];
  multiple?: boolean;
}

export type TypeImageSceneOptionsResolver = (
  ctx: VonaContext,
) => Promise<keyof IImageProviderRecord>;

export type TypeImageSceneOptionsMetaResolver = (
  ctx: VonaContext,
) => Promise<Record<string, any> | undefined> | Record<string, any> | undefined;

export interface IDecoratorImageSceneOptions {
  providerName?: keyof IImageProviderRecord;
  resolver?: TypeImageSceneOptionsResolver;
  clientName?: string;
  upload?: IImageSceneOptionsUpload;
  meta?: Record<string, any> | TypeImageSceneOptionsMetaResolver;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    imageScene: ServiceOnion<IImageSceneRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    imageScene: OmitNever<IImageSceneRecord>;
  }

  export interface IBeanSceneRecord {
    imageScene: never;
  }
}
