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

    const entityStockReservation = this.scope.entity.stockReservation;
    await this.bean.model.createTable(entityStockReservation.$table, table => {
      table.comment(entityStockReservation.$comment.$table);
      table.basicFields();
      table
        .tableIdentity(entityStockReservation.stockBalanceId)
        .comment(entityStockReservation.$comment.stockBalanceId);
      table
        .tableIdentity(entityStockReservation.skuId)
        .comment(entityStockReservation.$comment.skuId);
      table
        .integer(entityStockReservation.quantity)
        .comment(entityStockReservation.$comment.quantity);
      table.string(entityStockReservation.state, 20).comment(entityStockReservation.$comment.state);
      table
        .string(entityStockReservation.correlationId, 100)
        .comment(entityStockReservation.$comment.correlationId);
    });

    const entityStockAudit = this.scope.entity.stockAudit;
    await this.bean.model.createTable(entityStockAudit.$table, table => {
      table.comment(entityStockAudit.$comment.$table);
      table.basicFields();
      table
        .tableIdentity(entityStockAudit.stockBalanceId)
        .comment(entityStockAudit.$comment.stockBalanceId);
      table.tableIdentity(entityStockAudit.skuId).comment(entityStockAudit.$comment.skuId);
      table
        .tableIdentity(entityStockAudit.stockReservationId)
        .nullable()
        .comment(entityStockAudit.$comment.stockReservationId);
      table.userId(entityStockAudit.actorId).nullable().comment(entityStockAudit.$comment.actorId);
      table.string(entityStockAudit.operation, 20).comment(entityStockAudit.$comment.operation);
      table.integer(entityStockAudit.delta).comment(entityStockAudit.$comment.delta);
      table.string(entityStockAudit.reason, 255).comment(entityStockAudit.$comment.reason);
      table
        .string(entityStockAudit.correlationId, 100)
        .comment(entityStockAudit.$comment.correlationId);
      table.int0(entityStockAudit.priorOnHand).comment(entityStockAudit.$comment.priorOnHand);
      table.int0(entityStockAudit.priorReserved).comment(entityStockAudit.$comment.priorReserved);
      table.int0(entityStockAudit.priorAvailable).comment(entityStockAudit.$comment.priorAvailable);
      table.int0(entityStockAudit.onHand).comment(entityStockAudit.$comment.onHand);
      table.int0(entityStockAudit.reserved).comment(entityStockAudit.$comment.reserved);
      table.int0(entityStockAudit.available).comment(entityStockAudit.$comment.available);
    });

    const entityCart = this.scope.entity.cart;
    await this.bean.model.createTable(entityCart.$table, table => {
      table.comment(entityCart.$comment.$table);
      table.basicFields();
      table.userId(entityCart.userId).comment(entityCart.$comment.userId);
    });

    const entityCartItem = this.scope.entity.cartItem;
    await this.bean.model.createTable(entityCartItem.$table, table => {
      table.comment(entityCartItem.$comment.$table);
      table.basicFields();
      table.tableIdentity(entityCartItem.cartId).comment(entityCartItem.$comment.cartId);
      table.tableIdentity(entityCartItem.skuId).comment(entityCartItem.$comment.skuId);
      table.integer(entityCartItem.quantity).comment(entityCartItem.$comment.quantity);
    });
  }
}
