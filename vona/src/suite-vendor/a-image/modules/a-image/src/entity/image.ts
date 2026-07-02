import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $schema, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import z from 'zod';

import type { IImageNamedVariants } from '../types/image.ts';
import type { IImageProviderRecord } from '../types/imageProvider.ts';
import type { IImageSceneRecord } from '../types/imageScene.ts';

import { DtoImageTransformOptions } from '../dto/imageTransformOptions.tsx';

export interface IEntityOptionsImage extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsImage>('aImage')
export class EntityImage extends EntityBase {
  @Api.field(z.string())
  providerName: keyof IImageProviderRecord;

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

  @Api.field(v.optional())
  meta?: Record<string, any>;

  @Api.field(v.optional())
  storagePath?: string;

  @Api.field(v.optional())
  deliveryBaseUrl?: string;

  @Api.field(v.optional(), z.string())
  imageScene?: keyof IImageSceneRecord;
}
