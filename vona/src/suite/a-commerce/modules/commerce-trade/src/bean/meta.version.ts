import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version !== 1) return;

    const entityStockBalance = this.scope.entity.stockBalance;
    await this.bean.model.createTable(entityStockBalance.$table, table => {
      table.comment(entityStockBalance.$comment.$table);
      table.basicFields();
      table.tableIdentity(entityStockBalance.skuId).comment(entityStockBalance.$comment.skuId);
      table.int0(entityStockBalance.onHand).comment(entityStockBalance.$comment.onHand);
      table.int0(entityStockBalance.reserved).comment(entityStockBalance.$comment.reserved);
      table.int0(entityStockBalance.available).comment(entityStockBalance.$comment.available);
    });

    const entityStockAudit = this.scope.entity.stockAudit;
    await this.bean.model.createTable(entityStockAudit.$table, table => {
      table.comment(entityStockAudit.$comment.$table);
      table.basicFields();
      table
        .tableIdentity(entityStockAudit.stockBalanceId)
        .comment(entityStockAudit.$comment.stockBalanceId);
      table.tableIdentity(entityStockAudit.skuId).comment(entityStockAudit.$comment.skuId);
      table.integer(entityStockAudit.delta).comment(entityStockAudit.$comment.delta);
      table.string(entityStockAudit.reason, 255).comment(entityStockAudit.$comment.reason);
      table
        .string(entityStockAudit.correlationId, 100)
        .comment(entityStockAudit.$comment.correlationId);
      table.int0(entityStockAudit.onHand).comment(entityStockAudit.$comment.onHand);
      table.int0(entityStockAudit.reserved).comment(entityStockAudit.$comment.reserved);
      table.int0(entityStockAudit.available).comment(entityStockAudit.$comment.available);
    });
  }
}
