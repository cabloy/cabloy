import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoStockAuditSelectResItem } from './stockAuditSelectResItem.tsx';

export interface IDtoOptionsStockAuditSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStockAuditSelectRes>()
export class DtoStockAuditSelectRes extends $Dto.listAndCount(DtoStockAuditSelectResItem) {}
