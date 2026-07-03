import type {
  IImageNamedVariants,
  IImageVariantRequest,
  TypeImageVariantName,
} from '../types/image.ts';
import type { IImageProviderResolvedVariant } from '../types/imageProvider.ts';

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
