import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityLayoutprofile } from '../entity/layoutprofile.ts';

export interface IModelOptionsLayoutprofile extends IDecoratorModelOptions<EntityLayoutprofile> {}

@Model<IModelOptionsLayoutprofile>({ entity: EntityLayoutprofile, disableDeleted: true })
export class ModelLayoutprofile extends BeanModelBase<EntityLayoutprofile> {}
