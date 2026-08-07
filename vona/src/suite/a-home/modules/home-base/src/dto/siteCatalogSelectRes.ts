import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoSiteCatalogSelectResItem } from './siteCatalogSelectResItem.ts';

export interface IDtoOptionsSiteCatalogSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSiteCatalogSelectRes>()
export class DtoSiteCatalogSelectRes extends $Dto.listAndCount(DtoSiteCatalogSelectResItem) {}
