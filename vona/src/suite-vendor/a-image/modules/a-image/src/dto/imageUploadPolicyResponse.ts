import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IImageSceneRecord } from '../types/imageScene.ts';

export interface IDtoOptionsImageUploadPolicyResponse extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageUploadPolicyResponse>()
export class DtoImageUploadPolicyResponse {
  @Api.field(z.string())
  imageScene: keyof IImageSceneRecord;

  @Api.field(v.optional(), z.number().int().positive())
  maxSize?: number;

  @Api.field(v.optional(), z.array(z.string()))
  mimeTypes?: string[];

  @Api.field(v.optional(), z.array(z.string()))
  extensions?: string[];

  @Api.field(v.optional(), z.boolean())
  multiple?: boolean;

  @Api.field(v.optional(), z.boolean())
  public?: boolean;
}
