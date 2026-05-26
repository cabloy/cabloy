import type { TableIdentity } from 'table-identity';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoCategoryTree } from '../dto/categoryTree.ts';
import { DtoUserCreate } from '../dto/userCreate.ts';
import { DtoUserLazy } from '../dto/userLazy.ts';
import { DtoUserUpdate } from '../dto/userUpdate.ts';

export interface IControllerOptionsDtoTest extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsDtoTest>('dtoTest', { meta: { mode: ['test', 'dev'] } })
export class ControllerDtoTest extends BeanBase {
  @Web.get('getUserLazy')
  getUserLazy(): DtoUserLazy {
    return {} as any;
  }

  @Web.get('getUserDynamic')
  @Api.body($Dto.get('test-vona:post'))
  getPostDynamic() {}

  @Web.get('getUserStats')
  @Api.body($Dto.get('test-vona:userStats'))
  getUserStats() {}

  @Web.get('getUserStatsGroup')
  @Api.body($Dto.get('test-vona:userStatsGroup'))
  getUserStatsGroup() {}

  @Web.post('createUser')
  createUser(@Arg.body(v.object(DtoUserCreate)) user: DtoUserCreate) {
    return this.scope.model.user.insert(user);
  }

  @Web.patch('updateUser/:id')
  updateUser(
    @Arg.param('id') id: TableIdentity,
    @Arg.body(v.object(DtoUserUpdate)) user: DtoUserUpdate,
  ) {
    return this.scope.model.user.update(user, { where: { id } });
  }

  @Web.get('getCategoryTree')
  @Api.body(v.array($Dto.get('test-vona:category', { columns: ['id', 'name'] })))
  async getCategoryTree() {
    const items = await this.scope.model.category.select({ columns: ['id', 'name'] });
    return items;
  }

  @Web.get('getCategoryTree2')
  @Api.body(v.array(DtoCategoryTree))
  async getCategoryTree2() {
    const items = await this.scope.model.category.select({ columns: ['id', 'name'] });
    return items;
  }
}
