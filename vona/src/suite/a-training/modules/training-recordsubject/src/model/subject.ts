import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntitySubject } from '../entity/subject.tsx';

export interface IModelOptionsSubject extends IDecoratorModelOptions<EntitySubject> {}

@Model<IModelOptionsSubject>({ entity: EntitySubject })
export class ModelSubject extends BeanModelBase<EntitySubject> {}
