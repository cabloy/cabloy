import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IImageSceneRecord } from '../types/imageScene.ts';

export interface IDtoOptionsImageDirectUploadRequest extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageDirectUploadRequest>()
export class DtoImageDirectUploadRequest {
  @Api.field(z.string())
  imageScene: keyof IImageSceneRecord;

  @Api.field(v.optional())
  filename?: string;

  @Api.field(z.number().int().positive())
  size: number;

  @Api.field(z.string())
  mimeType: string;

  @Api.field(v.optional())
  contentType?: string;

  @Api.field(v.optional())
  requireSignedURLs?: boolean;

  @Api.field(v.optional())
  expiry?: string;

  @Api.field(v.optional())
  customId?: string;
}
