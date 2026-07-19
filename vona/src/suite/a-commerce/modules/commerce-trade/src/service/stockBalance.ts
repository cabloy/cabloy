import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoStockAdjust } from '../dto/stockAdjust.tsx';
import type { DtoStockBalanceSelectRes } from '../dto/stockBalanceSelectRes.tsx';
import type { DtoStockBalanceView } from '../dto/stockBalanceView.tsx';
import type { EntityStockBalance } from '../entity/stockBalance.tsx';
import type { ModelStockBalance } from '../model/stockBalance.ts';

@Service()
export class ServiceStockBalance extends BeanBase {
  async select(params?: IQueryParams<ModelStockBalance>): Promise<DtoStockBalanceSelectRes> {
    return await this.scope.model.stockBalance.selectAndCount(params);
  }

  async view(id: TableIdentity): Promise<DtoStockBalanceView | undefined> {
    return await this.scope.model.stockBalance.getById(id);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  async adjustStock(stockAdjust: DtoStockAdjust): Promise<EntityStockBalance> {
    const sku = await this.$scope.commerceCatalog.model.sku.getById(stockAdjust.skuId);
    if (!sku) {
      this.app.throw(404, 'SKU not found');
    }

    let stockBalance = await this.scope.model.stockBalance
      .builderSelect()
      .where('skuId', stockAdjust.skuId)
      .forUpdate()
      .first();
    if (!stockBalance) {
      if (stockAdjust.delta < 0) {
        throw new Error('stock adjustment would make balance negative');
      }
      stockBalance = await this.scope.model.stockBalance.insert({
        skuId: stockAdjust.skuId,
        onHand: stockAdjust.delta,
        reserved: 0,
        available: stockAdjust.delta,
      });
    } else {
      const onHand = stockBalance.onHand + stockAdjust.delta;
      const reserved = stockBalance.reserved;
      const available = onHand - reserved;
      if (onHand < 0 || reserved < 0 || available < 0) {
        throw new Error('stock adjustment would make balance negative');
      }
      await this.scope.model.stockBalance.updateById(stockBalance.id, {
        onHand,
        reserved,
        available,
      });
      stockBalance = {
        ...stockBalance,
        onHand,
        reserved,
        available,
      };
    }

    await this.scope.model.stockAudit.insert({
      stockBalanceId: stockBalance.id,
      skuId: stockBalance.skuId,
      delta: stockAdjust.delta,
      reason: stockAdjust.reason,
      correlationId: stockAdjust.correlationId,
      onHand: stockBalance.onHand,
      reserved: stockBalance.reserved,
      available: stockBalance.available,
    });
    return stockBalance;
  }
}
