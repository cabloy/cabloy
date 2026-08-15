import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoStockAuditSelectRes } from '../dto/stockAuditSelectRes.tsx';
import type { DtoStockAuditView } from '../dto/stockAuditView.tsx';
import type { DtoStockSkuRef } from '../dto/stockSkuRef.tsx';
import type { ModelStockAudit } from '../model/stockAudit.ts';

@Service()
export class ServiceStockAudit extends BeanBase {
  async select(params?: IQueryParams<ModelStockAudit>): Promise<DtoStockAuditSelectRes> {
    const result = await this.scope.model.stockAudit.selectAndCount({
      ...params,
      columns: ['id', 'skuId', 'operation', 'delta', 'createdAt'],
    });
    const skuRefs = await this._getSkuRefs(result.list.map(item => item.skuId));
    return {
      ...result,
      list: result.list.map(item => ({
        ...item,
        sku: skuRefs.get(String(item.skuId)),
      })),
    };
  }

  async view(id: TableIdentity): Promise<DtoStockAuditView | undefined> {
    const stockAudit = await this.scope.model.stockAudit.getById(id, {
      columns: [
        'id',
        'stockBalanceId',
        'skuId',
        'stockReservationId',
        'actorId',
        'operation',
        'delta',
        'reason',
        'correlationId',
        'priorOnHand',
        'priorReserved',
        'priorAvailable',
        'onHand',
        'reserved',
        'available',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!stockAudit) return;
    const sku = await this._getSkuRef(stockAudit.skuId);
    return { ...stockAudit, sku };
  }

  private async _getSkuRefs(skuIds: TableIdentity[]): Promise<Map<string, DtoStockSkuRef>> {
    const uniqueSkuIds = [...new Map(skuIds.map(skuId => [String(skuId), skuId])).values()];
    if (!uniqueSkuIds.length) return new Map();
    const skus = await this.$scope.commerceCatalog.model.sku.select({
      where: { id: uniqueSkuIds },
      columns: ['id', 'code'],
    });
    return new Map(skus.map(sku => [String(sku.id), { id: sku.id, code: sku.code }]));
  }

  private async _getSkuRef(skuId: TableIdentity): Promise<DtoStockSkuRef | undefined> {
    const sku = await this.$scope.commerceCatalog.model.sku.getById(skuId, {
      columns: ['id', 'code'],
    });
    return sku && { id: sku.id, code: sku.code };
  }
}
