import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoSkuCreate } from '../dto/skuCreate.tsx';
import type { DtoSkuPublic } from '../dto/skuPublic.tsx';
import type { DtoSkuSelectRes } from '../dto/skuSelectRes.tsx';
import type { DtoSkuUpdate } from '../dto/skuUpdate.tsx';
import type { DtoSkuView } from '../dto/skuView.tsx';
import type { EntitySku } from '../entity/sku.tsx';
import type { ModelSku } from '../model/sku.ts';

@Service()
export class ServiceSku extends BeanBase {
  async create(sku: DtoSkuCreate): Promise<EntitySku> {
    await this._ensureProductExists(sku.productId);
    await this._ensureCodeAvailable(sku.code);
    return await this.scope.model.sku.insert(sku);
  }

  async select(params?: IQueryParams<ModelSku>): Promise<DtoSkuSelectRes> {
    return await this.scope.model.sku.selectAndCount(params);
  }

  async view(id: TableIdentity): Promise<DtoSkuView | undefined> {
    return await this.scope.model.sku.getById(id);
  }

  async update(id: TableIdentity, sku: DtoSkuUpdate) {
    if (sku.productId !== undefined) await this._ensureProductExists(sku.productId);
    if (sku.code) await this._ensureCodeAvailable(sku.code, id);
    return await this.scope.model.sku.updateById(id, sku);
  }

  async delete(id: TableIdentity) {
    return await this.scope.model.sku.deleteById(id);
  }

  async selectActive(): Promise<DtoSkuPublic[]> {
    const skus = await this.scope.model.sku.select({
      columns: ['id', 'code', 'productId', 'priceCents'],
      where: { lifecycle: 'active' },
    });
    return skus;
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
