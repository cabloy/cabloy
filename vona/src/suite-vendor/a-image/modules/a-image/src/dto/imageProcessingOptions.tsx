import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IImageSceneOptionsProcessing } from '../types/imageScene.ts';

import { DtoImageResizeOptions } from './imageResizeOptions.tsx';

export interface IDtoOptionsImageProcessingOptions extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageProcessingOptions>()
export class DtoImageProcessingOptions implements IImageSceneOptionsProcessing {
  @Api.field(v.optional(), z.boolean())
  enableCrop?: boolean;

  @Api.field(v.optional(), z.number())
  cropAspectRatio?: number;

  @Api.field(v.optional(), z.enum(['rect', 'round']))
  cropShape?: IImageSceneOptionsProcessing['cropShape'];

  @Api.field(v.optional(), v.object(DtoImageResizeOptions))
  resize?: DtoImageResizeOptions;
}
