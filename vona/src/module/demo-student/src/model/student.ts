import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityStudent } from '../entity/student.tsx';

export interface IModelOptionsStudent extends IDecoratorModelOptions<EntityStudent> {}

@Model<IModelOptionsStudent>({ entity: EntityStudent })
export class ModelStudent extends BeanModelBase<EntityStudent> {}
