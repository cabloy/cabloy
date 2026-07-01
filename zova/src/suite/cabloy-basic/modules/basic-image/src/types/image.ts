import type { components } from '../api/openapi/index.js';

export type IImageTransformOptions = NonNullable<
  NonNullable<components['schemas']['a-image.dto.imageUploadResponse']['variants']>[string]
>;
