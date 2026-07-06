import type { OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';

import type { EntityImage } from '../entity/image.ts';
import type { EntityImageProvider } from '../entity/imageProvider.ts';
import type {
  IImageDeliveryOptions,
  IImageDirectUploadInput,
  IImageDownloadResult,
  IImageNamedVariants,
  IImageProviderDirectUploadResource,
  IImageProviderResource,
  IImageTransformOptions,
  IImageUploadInput,
  IImageUploadUrlInput,
  IImageVariantRequest,
  TypeImageVariantName,
} from './image.ts';

export type TypeImageProviderPick = Partial<
  Pick<EntityImageProvider, 'id' | 'providerName' | 'clientName'>
>;

export interface IImageProviderRecord {}

export interface IImageProviderClientRecord {
  default: never;
}
export interface IImageProviderClientOptions {
  deliveryBaseUrl?: string;
  variants?: IImageNamedVariants;
  requireSignedURLs?: boolean;
  signedDeliveryKind?: 'proxy' | 'provider';
}

export type TypeImageProviderClientOptions<T> =
  T extends IDecoratorImageProviderOptions<any, infer O> ? O : never;

export type TypeImageProviderClientName<T> =
  T extends IDecoratorImageProviderOptions<infer R, any> ? keyof R & string : never;

export interface IDecoratorImageProviderOptions<
  R extends IImageProviderClientRecord = IImageProviderClientRecord,
  T extends IImageProviderClientOptions = IImageProviderClientOptions,
> extends TypeOnionOptionsEnableSimple {
  base?: T;
  clients?: { [K in keyof R]?: R[K] extends undefined ? T : R[K] };
}

export type TypeImageProviderOptionsByName<N extends keyof IImageProviderRecord> =
  IImageProviderRecord[N];

export type TypeImageProviderClientOptionsByName<N extends keyof IImageProviderRecord> =
  TypeImageProviderOptionsByName<N> extends IDecoratorImageProviderOptions<any, any>
    ? TypeImageProviderClientOptions<TypeImageProviderOptionsByName<N>>
    : never;

export type TypeImageProviderClientNameByName<N extends keyof IImageProviderRecord> =
  TypeImageProviderOptionsByName<N> extends IDecoratorImageProviderOptions<any, any>
    ? TypeImageProviderClientName<TypeImageProviderOptionsByName<N>>
    : never;

export type TypeImageProviderExecuteByName<N extends keyof IImageProviderRecord> =
  TypeImageProviderOptionsByName<N> extends IDecoratorImageProviderOptions<any, any>
    ? IImageProviderExecute<
        TypeImageProviderClientOptionsByName<N>,
        TypeImageProviderOptionsByName<N>
      >
    : never;

// Provider-internal resolved variant names include both declaration-merged named variants
// and the internal `custom` sentinel used for ad hoc transform requests.
export type TypeImageProviderResolvedVariantName = TypeImageVariantName | 'custom';

export interface IImageProviderResolvedVariant {
  variantName: TypeImageProviderResolvedVariantName;
  transformOptions: IImageTransformOptions;
}

export interface IImageProviderExecute<
  T extends IImageProviderClientOptions = IImageProviderClientOptions,
  O extends IDecoratorImageProviderOptions = IDecoratorImageProviderOptions,
> {
  upload(input: IImageUploadInput, clientOptions: T, options: O): Promise<IImageProviderResource>;
  uploadUrl?(
    input: IImageUploadUrlInput,
    clientOptions: T,
    options: O,
  ): Promise<IImageProviderResource>;
  createDirectUpload?(
    input: IImageDirectUploadInput,
    clientOptions: T,
    options: O,
  ): Promise<IImageProviderDirectUploadResource>;
  finalizeDirectUpload?(
    image: EntityImage,
    clientOptions: T,
    options: O,
  ): Promise<IImageProviderResource | undefined>;
  get(
    image: EntityImage,
    clientOptions: T,
    options: O,
  ): Promise<IImageProviderResource | undefined>;
  delete(image: EntityImage, clientOptions: T, options: O): Promise<void>;
  getVariantUrl(
    image: EntityImage,
    request: IImageVariantRequest,
    clientOptions: T,
    options: O,
    deliveryOptions?: IImageDeliveryOptions,
  ): Promise<string>;
  download?(
    image: EntityImage,
    request: IImageVariantRequest,
    clientOptions: T,
    options: O,
    deliveryOptions?: IImageDeliveryOptions,
  ): Promise<IImageDownloadResult>;
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
