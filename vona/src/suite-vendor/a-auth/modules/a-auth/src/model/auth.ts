import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityAuth } from '../entity/auth.ts';

export interface IModelOptionsAuth extends IDecoratorModelOptions<EntityAuth> {}

@Model<IModelOptionsAuth>({
  entity: EntityAuth,
  disableDeleted: true,
  relations: {
    authProvider: $relation.belongsTo('a-auth:auth', 'a-auth:authProvider', 'authProviderId', {
      columns: ['id', 'providerName', 'clientName'],
    }),
  },
})
export class ModelAuth extends BeanModelBase<EntityAuth> {}
