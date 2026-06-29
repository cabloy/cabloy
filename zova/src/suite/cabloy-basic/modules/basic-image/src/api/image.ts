import type { TableIdentity } from 'table-identity';
import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

export interface IImageTransformOptions {
  width?: number;
  height?: number;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  gravity?: 'auto' | 'center' | 'top' | 'bottom' | 'left' | 'right';
  background?: string;
  quality?: number;
  format?: 'auto' | 'avif' | 'webp' | 'jpeg' | 'png';
  dpr?: number;
  rotate?: number;
  sharpen?: number;
}

export interface ApiImageUploadResponseBody {
  id: TableIdentity;
  provider: string;
  clientName: string;
  resourceId: string;
  filename?: string;
  contentType?: string;
  size?: number;
  width?: number;
  height?: number;
  variants?: Record<string, IImageTransformOptions>;
  uploadedAt?: string;
  url?: string;
}

@Api()
export class ApiImage extends BeanApiBase {
  upload(body: { image: Blob | File }, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiImageUploadResponseBody>(
      '/image/upload',
      this.$formData(body),
      this.$configPrepare(undefined, options, false),
    );
  }
}
