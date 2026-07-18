import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoCategoryCreate } from '../dto/categoryCreate.tsx';
import type { DtoCategorySelectRes } from '../dto/categorySelectRes.tsx';
import type { DtoCategoryUpdate } from '../dto/categoryUpdate.tsx';
import type { DtoCategoryView } from '../dto/categoryView.tsx';
import type { EntityCategory } from '../entity/category.tsx';
import type { ModelCategory } from '../model/category.ts';

@Service()
export class ServiceCategory extends BeanBase {
  async create(category: DtoCategoryCreate): Promise<EntityCategory> {
    await this._ensureParentExists(category.parentId);
    return await this.scope.model.category.insert(category);
  }

  async select(params?: IQueryParams<ModelCategory>): Promise<DtoCategorySelectRes> {
    return await this.scope.model.category.selectAndCount(params);
  }

  async view(id: TableIdentity): Promise<DtoCategoryView | undefined> {
    return await this.scope.model.category.getById(id);
  }

  async update(id: TableIdentity, category: DtoCategoryUpdate) {
    if (category.parentId !== undefined) {
      if (String(category.parentId) === String(id))
        this.app.throw(400, 'A category cannot be its own parent');
      await this._ensureParentExists(category.parentId);
    }
    return await this.scope.model.category.updateById(id, category);
  }

  async delete(id: TableIdentity) {
    return await this.scope.model.category.deleteById(id);
  }

  private async _ensureParentExists(parentId?: TableIdentity) {
    if (parentId && !(await this.scope.model.category.getById(parentId))) {
      this.app.throw(404, 'Parent category not found');
    }
  }
}
