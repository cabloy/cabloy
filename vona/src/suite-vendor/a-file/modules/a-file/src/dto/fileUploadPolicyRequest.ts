import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import type { IFileSceneRecord } from '../types/fileScene.ts';

export interface IDtoOptionsFileUploadPolicyRequest extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsFileUploadPolicyRequest>()
export class DtoFileUploadPolicyRequest {
  @Api.field(z.string())
  fileScene: keyof IFileSceneRecord;
}
