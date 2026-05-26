import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityAuth } from '../entity/auth.ts';
import { ModelAuthProvider } from './authProvider.ts';

export interface IModelOptionsAuth extends IDecoratorModelOptions<EntityAuth> {}

@Model<IModelOptionsAuth>({
  entity: EntityAuth,
  disableDeleted: true,
  relations: {
    authProvider: $relation.belongsTo(
      () => ModelAuth,
      () => ModelAuthProvider,
      'authProviderId',
      {
        columns: ['id', 'providerName', 'clientName'],
      },
    ),
  },
})
export class ModelAuth extends BeanModelBase<EntityAuth> {}
