import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityAiModel } from '../entity/aiModel.tsx';

export interface IModelOptionsAiModel extends IDecoratorModelOptions<EntityAiModel> {}

@Model<IModelOptionsAiModel>({ entity: EntityAiModel })
export class ModelAiModel extends BeanModelBase<EntityAiModel> {}
