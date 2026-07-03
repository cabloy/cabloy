import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IImageSceneRecord } from '../types/imageScene.ts';

export interface IDtoOptionsImageUploadTokenRequest extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageUploadTokenRequest>()
export class DtoImageUploadTokenRequest {
  @Api.field(z.string())
  imageScene: keyof IImageSceneRecord;

  @Api.field(z.number().int().positive())
  size: number;

  @Api.field(z.string())
  mimeType: string;

  @Api.field(v.optional(), z.number().int().positive())
  expiresIn?: number;
}
