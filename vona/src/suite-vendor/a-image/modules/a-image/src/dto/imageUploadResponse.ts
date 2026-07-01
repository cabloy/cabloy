import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IImageProviderRecord } from '../types/imageProvider.ts';
import type { IImageSceneRecord } from '../types/imageScene.ts';

export interface IDtoOptionsImageUploadResponse extends IDecoratorDtoOptions {}

const ImageTransformOptionsSchema = z.object({
  width: z.number().optional(),
  height: z.number().optional(),
  fit: z.enum(['scale-down', 'contain', 'cover', 'crop', 'pad']).optional(),
  gravity: z.enum(['auto', 'center', 'top', 'bottom', 'left', 'right']).optional(),
  background: z.string().optional(),
  quality: z.number().optional(),
  format: z.enum(['auto', 'avif', 'webp', 'jpeg', 'png']).optional(),
  dpr: z.number().optional(),
  rotate: z.number().optional(),
  sharpen: z.number().optional(),
});

@Dto<IDtoOptionsImageUploadResponse>()
export class DtoImageUploadResponse {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(z.string())
  provider: keyof IImageProviderRecord;

  @Api.field()
  clientName: string;

  @Api.field()
  resourceId: string;

  @Api.field(v.optional())
  filename?: string;

  @Api.field(v.optional())
  contentType?: string;

  @Api.field(v.optional())
  size?: number;

  @Api.field(v.optional())
  width?: number;

  @Api.field(v.optional())
  height?: number;

  @Api.field(v.optional(), z.record(z.string(), ImageTransformOptionsSchema))
  variants?: Record<string, z.infer<typeof ImageTransformOptionsSchema>>;

  @Api.field(v.optional())
  imageScene?: keyof IImageSceneRecord | string;

  @Api.field(v.optional())
  uploadedAt?: Date;

  @Api.field(v.optional())
  url?: string;
}
