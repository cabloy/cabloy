import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

export interface IDtoOptionsImageUploadTokenResponse extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageUploadTokenResponse>()
export class DtoImageUploadTokenResponse {
  @Api.field(z.string())
  token: string;

  @Api.field(v.optional(), z.number().int().positive())
  expiresIn?: number;
}
