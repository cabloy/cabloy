import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $schema, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IImageNamedVariants, TypeImageStatus } from '../types/image.ts';
import type { IImageProviderRecord } from '../types/imageProvider.ts';
import type { IImageSceneRecord } from '../types/imageScene.ts';

import { DtoImageTransformOptions } from './imageTransformOptions.tsx';

export interface IDtoOptionsImageUploadResponse extends IDecoratorDtoOptions {}

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

  @Api.field(v.optional())
  requireSignedURLs?: boolean;

  @Api.field(v.optional(), z.record(z.string(), $schema(DtoImageTransformOptions)))
  variants?: IImageNamedVariants;

  @Api.field(v.optional(), z.string())
  imageScene?: keyof IImageSceneRecord;

  @Api.field(v.optional(), z.string())
  status?: TypeImageStatus;

  @Api.field(v.optional())
  draftExpiresAt?: Date;

  @Api.field(v.optional())
  finalizedAt?: Date;

  @Api.field(v.optional())
  uploadedAt?: Date;

  @Api.field(v.optional())
  url?: string;

  @Api.field(v.optional())
  signed?: boolean;
}
