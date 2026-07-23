import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityOrderAudit } from '../entity/orderAudit.tsx';

export interface IModelOptionsOrderAudit extends IDecoratorModelOptions<EntityOrderAudit> {}

@Model<IModelOptionsOrderAudit>({ entity: EntityOrderAudit })
export class ModelOrderAudit extends BeanModelBase<EntityOrderAudit> {}
