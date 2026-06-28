import type { OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';

import type { EntityImage } from '../entity/image.ts';
import type { EntityImageProvider } from '../entity/imageProvider.ts';
import type { IImageDownloadResult, IImageProviderResource, IImageUploadInput } from './image.ts';

export type TypeImageProviderPick = Partial<
  Pick<EntityImageProvider, 'id' | 'providerName' | 'clientName'>
>;

export interface IImageProviderRecord {}

export interface IImageProviderClientRecord {
  default: never;
}

export interface IImageProviderClientOptions {
  deliveryBaseUrl?: string;
  variants?: Record<string, string>;
  requireSignedURLs?: boolean;
}

export type TypeImageProviderClientOptions<T> =
  T extends IDecoratorImageProviderOptions<any, infer O> ? O : never;

export type TypeImageProviderClientName<T> =
  T extends IDecoratorImageProviderOptions<infer R, any> ? keyof R : never;

export interface IDecoratorImageProviderOptions<
  R extends IImageProviderClientRecord = IImageProviderClientRecord,
  T extends IImageProviderClientOptions = IImageProviderClientOptions,
> extends TypeOnionOptionsEnableSimple {
  base?: T;
  clients?: { [K in keyof R]?: T };
}

export interface IImageProviderExecute<
  T extends IImageProviderClientOptions = IImageProviderClientOptions,
  O extends IDecoratorImageProviderOptions = IDecoratorImageProviderOptions,
> {
  upload(input: IImageUploadInput, clientOptions: T, options: O): Promise<IImageProviderResource>;
  get(
    image: EntityImage,
    clientOptions: T,
    options: O,
  ): Promise<IImageProviderResource | undefined>;
  delete(image: EntityImage, clientOptions: T, options: O): Promise<void>;
  getVariantUrl(image: EntityImage, variant: string, clientOptions: T, options: O): Promise<string>;
  download?(image: EntityImage, clientOptions: T, options: O): Promise<IImageDownloadResult>;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    imageProvider: ServiceOnion<IImageProviderRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    imageProvider: OmitNever<IImageProviderRecord>;
  }

  export interface IBeanSceneRecord {
    imageProvider: never;
  }
}
