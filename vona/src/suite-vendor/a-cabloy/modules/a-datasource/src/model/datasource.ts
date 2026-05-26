import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityDatasource } from '../entity/datasource.ts';

export interface IModelOptionsDatasource extends IDecoratorModelOptions<EntityDatasource> {}

@Model<IModelOptionsDatasource>({ entity: EntityDatasource })
export class ModelDatasource extends BeanModelBase<EntityDatasource> {}
