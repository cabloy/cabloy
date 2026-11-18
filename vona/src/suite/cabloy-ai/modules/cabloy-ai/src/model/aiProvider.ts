import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityAiProvider } from '../entity/aiProvider.tsx';

export interface IModelOptionsAiProvider extends IDecoratorModelOptions<EntityAiProvider> {}

@Model<IModelOptionsAiProvider>({ entity: EntityAiProvider })
export class ModelAiProvider extends BeanModelBase<EntityAiProvider> {}
