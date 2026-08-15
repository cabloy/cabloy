import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoSkuCreate } from '../dto/skuCreate.tsx';
import type { DtoSkuSelectRes } from '../dto/skuSelectRes.tsx';
import type { DtoSkuUpdate } from '../dto/skuUpdate.tsx';
import type { DtoSkuView } from '../dto/skuView.tsx';
import type { EntitySku } from '../entity/sku.tsx';
import type { ModelSku } from '../model/sku.ts';

const allowedLifecycleTransitions: Record<EntitySku['lifecycle'], EntitySku['lifecycle'][]> = {
  draft: ['active', 'archived'],
  active: ['inactive', 'archived'],
  inactive: ['active', 'archived'],
  archived: [],
};

@Service()
export class ServiceSku extends BeanBase {
  async create(sku: DtoSkuCreate): Promise<EntitySku> {
    await this._ensureProductExists(sku.productId);
    await this._ensureCodeAvailable(sku.code);
    return await this.scope.model.sku.insert(sku);
  }

  async select(params?: IQueryParams<ModelSku>): Promise<DtoSkuSelectRes> {
    return await this.scope.model.sku.selectAndCount({
      ...params,
      include: {
        ...params?.include,
        product: { columns: ['id', 'title'] },
      },
    });
  }

  async view(id: TableIdentity): Promise<DtoSkuView | undefined> {
    return await this.scope.model.sku.getById(id, {
      include: {
        product: { columns: ['id', 'title'] },
      },
    });
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  async update(id: TableIdentity, sku: DtoSkuUpdate) {
    if (sku.lifecycle !== undefined) {
      const currentSku = await this.scope.model.sku.getByIdForUpdate(id);
      if (!currentSku) {
        this.app.throw(404, 'SKU not found');
      }
      if (
        sku.lifecycle !== currentSku.lifecycle &&
        !allowedLifecycleTransitions[currentSku.lifecycle].includes(sku.lifecycle)
      ) {
        this.app.throw(
          409,
          `cannot transition SKU lifecycle from ${currentSku.lifecycle} to ${sku.lifecycle}`,
        );
      }
    }
    if (sku.productId !== undefined) await this._ensureProductExists(sku.productId);
    if (sku.code) await this._ensureCodeAvailable(sku.code, id);
    return await this.scope.model.sku.updateById(id, sku);
  }

  async delete(id: TableIdentity) {
    return await this.scope.model.sku.deleteById(id);
  }

  private async _ensureProductExists(productId: TableIdentity) {
    if (!(await this.scope.model.product.getById(productId))) {
      this.app.throw(404, 'SKU product not found');
    }
  }

  private async _ensureCodeAvailable(code: string, excludedId?: TableIdentity) {
    const sku = await this.scope.model.sku.get({ code });
    if (sku && String(sku.id) !== String(excludedId)) {
      this.app.throw(409, `SKU code already exists: ${code}`);
    }
  }
}
