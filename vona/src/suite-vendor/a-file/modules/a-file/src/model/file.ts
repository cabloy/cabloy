import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityFile } from '../entity/file.ts';

export interface IModelOptionsFile extends IDecoratorModelOptions<EntityFile> {}

@Model<IModelOptionsFile>({ entity: EntityFile, disableDeleted: true })
export class ModelFile extends BeanModelBase<EntityFile> {}
