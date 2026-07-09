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

export interface IDecoratorImageSceneOptionsProvider {
  providerName?: keyof IImageProviderRecord;
  clientName?: string;
}

export type TypeDecoratorImageSceneOptionsProvider =
  | TypeImageSceneOptionsResolver
  | IDecoratorImageSceneOptionsProvider;

export type TypeImageSceneOptionsResolver = (
  ctx: VonaContext,
) => Promise<IDecoratorImageSceneOptionsProvider>;

export type TypeImageSceneOptionsMetaResolver = (
  ctx: VonaContext,
) => Promise<Record<string, any> | undefined> | Record<string, any> | undefined;

export interface IDecoratorImageSceneOptions {
  provider?: TypeDecoratorImageSceneOptionsProvider;
  upload?: IImageSceneOptionsUpload;
  requireSignedURLs?: boolean;
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
