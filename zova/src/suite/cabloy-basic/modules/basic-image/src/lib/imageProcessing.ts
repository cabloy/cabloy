import type { ApiApiImagegetUploadPolicyResponseBody } from '../api/image.ts';
import type { IImageCropDialogLabels, IPrepareImageFileOptions } from './imageTransform.tsx';

export interface IImageProcessingOverrides {
  crop?: false | IPrepareImageFileOptions['crop'];
  resize?: IPrepareImageFileOptions['resize'];
}

export function resolveImageProcessing(
  processing: ApiApiImagegetUploadPolicyResponseBody['processing'],
  overrides: IImageProcessingOverrides,
  labels: IImageCropDialogLabels,
): Pick<IPrepareImageFileOptions, 'crop' | 'resize'> {
  const crop = overrides.crop;
  const enableCrop = crop === false ? false : crop ? true : processing?.enableCrop === true;
  const { fit, format, ...sceneResize } = processing?.resize ?? {};
  const resize =
    processing?.resize || overrides.resize
      ? {
          ...sceneResize,
          ...(fit != null ? { fit } : {}),
          ...(format != null ? { format } : {}),
          ...Object.fromEntries(
            Object.entries(overrides.resize ?? {}).filter(([, value]) => value !== undefined),
          ),
        }
      : undefined;
  return {
    crop: enableCrop
      ? {
          labels: crop ? crop.labels : labels,
          aspectRatio: (crop ? crop.aspectRatio : undefined) ?? processing?.cropAspectRatio,
          shape: (crop ? crop.shape : undefined) ?? processing?.cropShape ?? undefined,
        }
      : undefined,
    resize,
  };
}
