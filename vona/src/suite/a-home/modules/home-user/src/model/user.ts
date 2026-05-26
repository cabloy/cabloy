import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityUser } from '../entity/user.ts';
import { ModelRole } from './role.ts';
import { ModelRoleUser } from './roleUser.ts';

export interface IModelOptionsUser extends IDecoratorModelOptions<EntityUser> {}

@Model<IModelOptionsUser>({
  entity: EntityUser,
  relations: {
    roles: $relation.belongsToMany(
      () => ModelRoleUser,
      () => ModelRole,
      'userId',
      'roleId',
    ),
  },
})
export class ModelUser extends BeanModelBase<EntityUser> {
  getByEmailEqI(email: string) {
    return this.get({ email: { _eqI_: email } });
  }
}
