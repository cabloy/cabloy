import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $schema, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IImageNamedVariants } from '../types/image.ts';
import type { IImageSceneRecord } from '../types/imageScene.ts';

import { DtoImageTransformOptions } from './imageTransformOptions.tsx';

export interface IDtoOptionsImageView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageView>()
export class DtoImageView {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(z.string())
  url: string;

  @Api.field(v.optional())
  filename?: string;

  @Api.field(v.optional())
  width?: number;

  @Api.field(v.optional())
  height?: number;

  @Api.field(z.string())
  provider: string;

  @Api.field(z.string())
  clientName: string;

  @Api.field(v.optional())
  imageScene?: keyof IImageSceneRecord | string;

  @Api.field(v.optional())
  uploadedAt?: Date;

  @Api.field(v.optional(), z.record(z.string(), $schema(DtoImageTransformOptions)))
  variants?: IImageNamedVariants;
}
