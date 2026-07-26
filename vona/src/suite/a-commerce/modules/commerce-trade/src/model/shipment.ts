import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityShipment } from '../entity/shipment.tsx';

export interface IModelOptionsShipment extends IDecoratorModelOptions<EntityShipment> {}

@Model<IModelOptionsShipment>({ entity: EntityShipment })
export class ModelShipment extends BeanModelBase<EntityShipment> {}
