import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IFileSceneRecord } from '../types/fileScene.ts';

export interface IDtoOptionsFileDirectUploadRequest extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsFileDirectUploadRequest>()
export class DtoFileDirectUploadRequest {
  @Api.field(z.string())
  fileScene: keyof IFileSceneRecord;

  @Api.field(v.optional())
  filename?: string;

  @Api.field(z.number().int().positive())
  size: number;

  @Api.field(z.string())
  mimeType: string;

  @Api.field(v.optional())
  contentType?: string;

  @Api.field(v.optional())
  expiry?: string;
}
