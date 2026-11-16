import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IImageSceneOptionsResize } from '../types/imageScene.ts';

export interface IDtoOptionsImageResizeOptions extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageResizeOptions>()
export class DtoImageResizeOptions implements IImageSceneOptionsResize {
  @Api.field(v.optional(), z.number())
  width?: number;

  @Api.field(v.optional(), z.number())
  height?: number;

  @Api.field(v.optional(), z.enum(['scale-down', 'contain', 'cover', 'crop', 'pad']))
  fit?: IImageSceneOptionsResize['fit'];

  @Api.field(v.optional(), z.string())
  background?: string;

  @Api.field(v.optional(), z.enum(['auto', 'avif', 'webp', 'jpeg', 'png']))
  format?: IImageSceneOptionsResize['format'];

  @Api.field(v.optional(), z.number())
  quality?: number;
}
