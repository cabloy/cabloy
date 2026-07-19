import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityStockReservation } from '../entity/stockReservation.tsx';

export interface IModelOptionsStockReservation extends IDecoratorModelOptions<EntityStockReservation> {}

@Model<IModelOptionsStockReservation>({ entity: EntityStockReservation })
export class ModelStockReservation extends BeanModelBase<EntityStockReservation> {}
