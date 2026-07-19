import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityStockAudit } from '../entity/stockAudit.tsx';

export interface IModelOptionsStockAudit extends IDecoratorModelOptions<EntityStockAudit> {}

@Model<IModelOptionsStockAudit>({ entity: EntityStockAudit })
export class ModelStockAudit extends BeanModelBase<EntityStockAudit> {}
