import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityFileProvider } from '../entity/fileProvider.ts';

export interface IModelOptionsFileProvider extends IDecoratorModelOptions<EntityFileProvider> {}

@Model<IModelOptionsFileProvider>({ entity: EntityFileProvider, disableDeleted: true })
export class ModelFileProvider extends BeanModelBase<EntityFileProvider> {}
