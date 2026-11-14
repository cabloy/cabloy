import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityAuthorization } from '../entity/authorization.tsx';

export interface IModelOptionsAuthorization extends IDecoratorModelOptions<EntityAuthorization> {}

@Model<IModelOptionsAuthorization>({
  entity: EntityAuthorization,
  relations: {
    client: $relation.belongsTo('mcp-auth:authorization', 'mcp-auth:client', 'clientId', {
      columns: ['id', 'oauthClientId', 'name', 'issuer'],
    }),
  },
  cache: { entity: false, query: false },
})
export class ModelAuthorization extends BeanModelBase<EntityAuthorization> {}
