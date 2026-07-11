import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Dto } from 'vona-module-a-web';

import { DtoFileUploadResponse } from './fileUploadResponse.ts';

export interface IDtoOptionsFileDirectUploadFinalizeResponse extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsFileDirectUploadFinalizeResponse>()
export class DtoFileDirectUploadFinalizeResponse extends DtoFileUploadResponse {}
