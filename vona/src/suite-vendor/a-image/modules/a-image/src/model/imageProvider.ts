import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityImageProvider } from '../entity/imageProvider.ts';

export interface IModelOptionsImageProvider extends IDecoratorModelOptions<EntityImageProvider> {}

@Model<IModelOptionsImageProvider>({ entity: EntityImageProvider, disableDeleted: true })
export class ModelImageProvider extends BeanModelBase<EntityImageProvider> {}
