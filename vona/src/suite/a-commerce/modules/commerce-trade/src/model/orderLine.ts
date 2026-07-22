import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityOrderLine } from '../entity/orderLine.tsx';

export interface IModelOptionsOrderLine extends IDecoratorModelOptions<EntityOrderLine> {}

@Model<IModelOptionsOrderLine>({ entity: EntityOrderLine })
export class ModelOrderLine extends BeanModelBase<EntityOrderLine> {}
