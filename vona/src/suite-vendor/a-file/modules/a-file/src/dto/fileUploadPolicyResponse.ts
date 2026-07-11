import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IFileSceneRecord } from '../types/fileScene.ts';

export interface IDtoOptionsFileUploadPolicyResponse extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsFileUploadPolicyResponse>()
export class DtoFileUploadPolicyResponse {
  @Api.field(z.string())
  fileScene: keyof IFileSceneRecord;

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

  @Api.field(z.boolean())
  directUpload: boolean;
}
