import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IImageSceneRecord } from '../types/imageScene.ts';

import {
  imageUploadBase64MaxLength,
  imageUploadBase64MimeTypes,
} from '../lib/imageUploadBase64.ts';

export interface IDtoOptionsImageUploadBase64Request extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageUploadBase64Request>()
export class DtoImageUploadBase64Request {
  @Api.field(z.string().min(1).max(128))
  imageScene: keyof IImageSceneRecord;

  @Api.field(z.string().min(1).max(255))
  filename: string;

  @Api.field(z.enum(imageUploadBase64MimeTypes))
  mimeType: (typeof imageUploadBase64MimeTypes)[number];

  @Api.field(z.string().min(4).max(imageUploadBase64MaxLength))
  base64: string;
}
