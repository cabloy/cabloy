import type { OmitNever, VonaContext } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';

import type { IImageTransformOptions } from './image.ts';
import type { IImageProviderRecord } from './imageProvider.ts';

export interface IImageSceneRecord {}

export interface IImageSceneOptionsUpload {
  maxSize?: number;
  mimeTypes?: string[];
  extensions?: string[];
  multiple?: boolean;
}

export interface IImageSceneOptionsResize extends Pick<
  IImageTransformOptions,
  'width' | 'height' | 'fit' | 'background' | 'format' | 'quality'
> {}

export interface IImageSceneOptionsProcessing {
  enableCrop?: boolean;
  cropAspectRatio?: number;
  cropShape?: 'rect' | 'round';
  resize?: IImageSceneOptionsResize;
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
  // Advisory client-side preparation defaults; uploads are not normalized by the backend.
  processing?: IImageSceneOptionsProcessing;
  public?: boolean;
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
