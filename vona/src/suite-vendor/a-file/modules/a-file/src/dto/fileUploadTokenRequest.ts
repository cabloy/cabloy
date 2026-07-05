import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IFileSceneRecord } from '../types/fileScene.ts';

export interface IDtoOptionsFileUploadTokenRequest extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsFileUploadTokenRequest>()
export class DtoFileUploadTokenRequest {
  @Api.field(z.string())
  fileScene: keyof IFileSceneRecord;

  @Api.field(z.number().int().positive())
  size: number;

  @Api.field(z.string())
  mimeType: string;

  @Api.field(v.optional(), z.number().int().positive())
  expiresIn?: number;
}
