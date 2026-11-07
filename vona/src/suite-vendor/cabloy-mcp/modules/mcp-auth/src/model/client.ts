import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityClient } from '../entity/client.tsx';

export interface IModelOptionsClient extends IDecoratorModelOptions<EntityClient> {}

@Model<IModelOptionsClient>({
  entity: EntityClient,
  cache: { entity: false, query: false },
})
export class ModelClient extends BeanModelBase<EntityClient> {}
