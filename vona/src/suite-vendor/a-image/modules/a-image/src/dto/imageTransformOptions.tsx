import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import type { IImageTransformOptions } from '../types/image.ts';

export interface IDtoOptionsImageTransformOptions extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageTransformOptions>()
export class DtoImageTransformOptions implements IImageTransformOptions {
  @Api.field(v.optional())
  width?: number;

  @Api.field(v.optional())
  height?: number;

  @Api.field(v.optional(), z.enum(['scale-down', 'contain', 'cover', 'crop', 'pad']))
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';

  @Api.field(v.optional(), z.enum(['auto', 'center', 'top', 'bottom', 'left', 'right']))
  gravity?: 'auto' | 'center' | 'top' | 'bottom' | 'left' | 'right';

  @Api.field(v.optional())
  background?: string;

  @Api.field(v.optional())
  quality?: number;

  @Api.field(v.optional(), z.enum(['auto', 'avif', 'webp', 'jpeg', 'png']))
  format?: 'auto' | 'avif' | 'webp' | 'jpeg' | 'png';

  @Api.field(v.optional())
  dpr?: number;

  @Api.field(v.optional())
  rotate?: number;

  @Api.field(v.optional())
  sharpen?: number;
}
