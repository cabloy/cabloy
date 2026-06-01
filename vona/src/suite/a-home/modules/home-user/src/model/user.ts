import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityUser } from '../entity/user.ts';

export interface IModelOptionsUser extends IDecoratorModelOptions<EntityUser> {}

@Model<IModelOptionsUser>({
  entity: EntityUser,
  relations: {
    roles: $relation.belongsToMany('home-user:roleUser', 'home-user:role', 'userId', 'roleId'),
  },
})
export class ModelUser extends BeanModelBase<EntityUser> {
  getByEmailEqI(email: string) {
    return this.get({ email: { _eqI_: email } });
  }
}
