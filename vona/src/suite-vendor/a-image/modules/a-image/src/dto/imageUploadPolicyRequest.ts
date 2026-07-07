import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IImageSceneRecord } from '../types/imageScene.ts';

export interface IDtoOptionsImageUploadPolicyRequest extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageUploadPolicyRequest>()
export class DtoImageUploadPolicyRequest {
  @Api.field(z.string())
  imageScene: keyof IImageSceneRecord;
}
