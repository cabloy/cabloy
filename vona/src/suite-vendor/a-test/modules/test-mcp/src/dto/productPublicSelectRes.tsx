import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoProductPublic } from './productPublic.tsx';

export interface IDtoOptionsProductPublicSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsProductPublicSelectRes>()
export class DtoProductPublicSelectRes extends $Dto.listAndCount(DtoProductPublic) {}
