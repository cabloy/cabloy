import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

export interface IDtoOptionsImageUploadTokenRequest extends IDecoratorDtoOptions {}
export interface IDtoOptionsImageUploadTokenResponse extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageUploadTokenRequest>()
export class DtoImageUploadTokenRequest {
  @Api.field(z.string().min(1))
  imageScene: string;

  @Api.field(z.number().int().positive())
  size: number;

  @Api.field(z.string().min(1))
  mimeType: string;
}

@Dto<IDtoOptionsImageUploadTokenResponse>()
export class DtoImageUploadTokenResponse {
  @Api.field(z.string().min(1))
  token: string;

  @Api.field(z.number().int().positive())
  expiresIn: number;
}
