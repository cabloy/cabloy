import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityAddress } from '../entity/address.tsx';

export interface IModelOptionsAddress extends IDecoratorModelOptions<EntityAddress> {}

@Model<IModelOptionsAddress>({ entity: EntityAddress })
export class ModelAddress extends BeanModelBase<EntityAddress> {}
