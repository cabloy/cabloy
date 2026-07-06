import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Dto } from 'vona-module-a-web';

import { DtoImageUploadResponse } from './imageUploadResponse.ts';

export interface IDtoOptionsImageDirectUploadFinalizeResponse extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageDirectUploadFinalizeResponse>()
export class DtoImageDirectUploadFinalizeResponse extends DtoImageUploadResponse {}
