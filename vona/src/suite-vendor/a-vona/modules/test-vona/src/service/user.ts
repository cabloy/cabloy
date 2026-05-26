import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { $relationDynamic } from 'vona-module-a-orm';

import { ModelRole } from '../model/role.ts';
import { ModelRoleUser } from '../model/roleUser.ts';

@Service()
export class ServiceUser extends BeanBase {
  async userStats() {
    const userStats = await this.scope.model.user.aggregate({
      aggrs: {
        count: '*',
        sum: 'scores',
        max: 'age',
        min: 'age',
      },
      where: {
        scores: { _gt_: 30 },
      },
    });
    return userStats;
  }

  async findUsers() {
    const users = await this.scope.model.user.select({
      where: {
        age: { _gt_: 18 },
      },
    });
    return users;
  }

  async relationBelongsToMany() {
    // insert: roles
    const roles = await this.scope.model.role.insertBulk([
      { name: 'role-family' },
      { name: 'role-friend' },
    ]);
    const roleIdFamily = roles[0].id;
    const roleIdFriend = roles[1].id;
    // insert: user
    const userCreate = await this.scope.model.user.insert(
      {
        name: 'Tom',
        roles: [
          {
            id: roleIdFamily,
          },
        ],
      },
      {
        with: {
          roles: $relationDynamic.belongsToMany(
            () => ModelRoleUser,
            () => ModelRole,
            'userId',
            'roleId',
          ),
        },
      },
    );
    // get: user
    await this.scope.model.user.get(
      {
        id: userCreate.id,
      },
      {
        with: {
          roles: $relationDynamic.belongsToMany(
            () => ModelRoleUser,
            () => ModelRole,
            'userId',
            'roleId',
            {
              columns: ['id', 'name'],
            },
          ),
        },
      },
    );
    // update: user
    await this.scope.model.user.update(
      {
        id: userCreate.id,
        roles: [
          // delete
          { id: roleIdFamily, deleted: true },
          // insert
          { id: roleIdFriend },
        ],
      },
      {
        with: {
          roles: $relationDynamic.belongsToMany(
            () => ModelRoleUser,
            () => ModelRole,
            'userId',
            'roleId',
            {
              columns: ['id', 'name'],
            },
          ),
        },
      },
    );
    // delete: user
    await this.scope.model.user.delete(
      {
        id: userCreate.id,
      },
      {
        with: {
          roles: $relationDynamic.belongsToMany(
            () => ModelRoleUser,
            () => ModelRole,
            'userId',
            'roleId',
          ),
        },
      },
    );
  }
}
