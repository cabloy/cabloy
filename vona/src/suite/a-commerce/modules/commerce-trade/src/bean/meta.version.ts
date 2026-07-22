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
        .tableIdentity(entityStockReservation.orderLineId)
        .nullable()
        .comment(entityStockReservation.$comment.orderLineId);
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

    const entityOrder = this.scope.entity.order;
    await this.bean.model.createTable(entityOrder.$table, table => {
      table.comment(entityOrder.$comment.$table);
      table.basicFields();
      table.userId(entityOrder.userId).comment(entityOrder.$comment.userId);
      table.tableIdentity(entityOrder.addressId).comment(entityOrder.$comment.addressId);
      table.string(entityOrder.correlationId, 80).comment(entityOrder.$comment.correlationId);
      table.json(entityOrder.addressSnapshot).comment(entityOrder.$comment.addressSnapshot);
      table
        .json(entityOrder.couponSnapshot)
        .nullable()
        .comment(entityOrder.$comment.couponSnapshot);
      table.string(entityOrder.state, 30).comment(entityOrder.$comment.state);
      table.string(entityOrder.currency, 3).comment(entityOrder.$comment.currency);
      table
        .integer(entityOrder.eligibleSubtotalCents)
        .comment(entityOrder.$comment.eligibleSubtotalCents);
      table.integer(entityOrder.discountCents).comment(entityOrder.$comment.discountCents);
      table.integer(entityOrder.payableTotalCents).comment(entityOrder.$comment.payableTotalCents);
      table
        .dateTime(entityOrder.reservationExpiresAt)
        .comment(entityOrder.$comment.reservationExpiresAt);
    });

    const entityOrderLine = this.scope.entity.orderLine;
    await this.bean.model.createTable(entityOrderLine.$table, table => {
      table.comment(entityOrderLine.$comment.$table);
      table.basicFields();
      table.tableIdentity(entityOrderLine.orderId).comment(entityOrderLine.$comment.orderId);
      table.tableIdentity(entityOrderLine.skuId).comment(entityOrderLine.$comment.skuId);
      table.tableIdentity(entityOrderLine.productId).comment(entityOrderLine.$comment.productId);
      table
        .string(entityOrderLine.skuCodeSnapshot, 100)
        .comment(entityOrderLine.$comment.skuCodeSnapshot);
      table
        .string(entityOrderLine.titleSnapshot, 100)
        .comment(entityOrderLine.$comment.titleSnapshot);
      table
        .json(entityOrderLine.skuAttributesSnapshot)
        .comment(entityOrderLine.$comment.skuAttributesSnapshot);
      table
        .integer(entityOrderLine.unitPriceCents)
        .comment(entityOrderLine.$comment.unitPriceCents);
      table.integer(entityOrderLine.quantity).comment(entityOrderLine.$comment.quantity);
      table
        .integer(entityOrderLine.eligibleSubtotalCents)
        .comment(entityOrderLine.$comment.eligibleSubtotalCents);
      table
        .integer(entityOrderLine.lineTotalCents)
        .comment(entityOrderLine.$comment.lineTotalCents);
    });
  }
}
