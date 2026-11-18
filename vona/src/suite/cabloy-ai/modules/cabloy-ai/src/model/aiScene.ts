import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityAiScene } from '../entity/aiScene.tsx';

export interface IModelOptionsAiScene extends IDecoratorModelOptions<EntityAiScene> {}

@Model<IModelOptionsAiScene>({ entity: EntityAiScene })
export class ModelAiScene extends BeanModelBase<EntityAiScene> {}
