import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityImage } from '../entity/image.ts';

export interface IModelOptionsImage extends IDecoratorModelOptions<EntityImage> {}

@Model<IModelOptionsImage>({ entity: EntityImage, disableDeleted: true })
export class ModelImage extends BeanModelBase<EntityImage> {}
