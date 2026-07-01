import type { OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';

import type { EntityImage } from '../entity/image.ts';
import type { EntityImageProvider } from '../entity/imageProvider.ts';
import type {
  IImageDownloadResult,
  IImageNamedVariants,
  IImageProviderResource,
  IImageTransformOptions,
  IImageUploadInput,
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

export interface IImageProviderClientOptionsBase {
  deliveryBaseUrl?: string;
  variants?: IImageNamedVariants;
  requireSignedURLs?: boolean;
}

export interface IImageProviderClientOptions extends IImageProviderClientOptionsBase {}

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
  ): Promise<string>;
  download?(
    image: EntityImage,
    request: IImageVariantRequest,
    clientOptions: T,
    options: O,
  ): Promise<IImageDownloadResult>;
}

export function resolveImageVariantRequest(
  request: IImageVariantRequest,
  defaultVariant: TypeImageVariantName,
): IImageVariantRequest {
  if (request.variantName && request.transformOptions) {
    throw new Error('variantName and transformOptions are mutually exclusive');
  }
  if (request.variantName || request.transformOptions) return request;
  return { variantName: defaultVariant };
}

export function resolveImageVariantByName(
  variants: IImageNamedVariants | undefined,
  variantName: TypeImageVariantName,
): IImageProviderResolvedVariant {
  if (variantName === 'original') {
    return { variantName, transformOptions: {} };
  }
  const transformOptions = variants?.[variantName];
  if (!transformOptions) {
    throw new Error(`Image variant not found: ${variantName}`);
  }
  return { variantName, transformOptions };
}

export function resolveImageVariantRequestToTransform(
  request: IImageVariantRequest,
  defaultVariant: TypeImageVariantName,
  variants: IImageNamedVariants | undefined,
): IImageProviderResolvedVariant {
  const requestResolved = resolveImageVariantRequest(request, defaultVariant);
  if (requestResolved.variantName) {
    return resolveImageVariantByName(variants, requestResolved.variantName);
  }
  return {
    variantName: 'custom',
    transformOptions: requestResolved.transformOptions ?? {},
  };
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
