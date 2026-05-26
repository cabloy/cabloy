import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityAuthProvider } from '../entity/authProvider.ts';

export interface IModelOptionsAuthProvider extends IDecoratorModelOptions<EntityAuthProvider> {}

@Model<IModelOptionsAuthProvider>({ entity: EntityAuthProvider, disableDeleted: true })
export class ModelAuthProvider extends BeanModelBase<EntityAuthProvider> {}
