import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoCategoryPublic } from './categoryPublic.tsx';

export interface IDtoOptionsCategoryPublicSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCategoryPublicSelectRes>()
export class DtoCategoryPublicSelectRes extends $Dto.listAndCount(DtoCategoryPublic) {}
