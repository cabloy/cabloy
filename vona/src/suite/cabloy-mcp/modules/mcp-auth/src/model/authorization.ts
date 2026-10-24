import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityAuthorization } from '../entity/authorization.tsx';

export interface IModelOptionsAuthorization extends IDecoratorModelOptions<EntityAuthorization> {}

@Model<IModelOptionsAuthorization>({
  entity: EntityAuthorization,
  cache: { entity: false, query: false },
})
export class ModelAuthorization extends BeanModelBase<EntityAuthorization> {}
