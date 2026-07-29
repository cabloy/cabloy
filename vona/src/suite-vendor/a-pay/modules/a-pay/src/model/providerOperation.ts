import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityProviderOperation } from '../entity/providerOperation.tsx';

export interface IModelOptionsProviderOperation extends IDecoratorModelOptions<EntityProviderOperation> {}

@Model<IModelOptionsProviderOperation>({ entity: EntityProviderOperation })
export class ModelProviderOperation extends BeanModelBase<EntityProviderOperation> {}
