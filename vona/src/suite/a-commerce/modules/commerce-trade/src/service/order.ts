import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoOrderAddressSnapshot } from '../dto/orderAddressSnapshot.tsx';
import type { DtoOrderLineSkuAttributeSnapshot } from '../dto/orderLineSkuAttributeSnapshot.tsx';
import type { EntityOrder } from '../entity/order.tsx';
import type { EntityOrderLine } from '../entity/orderLine.tsx';

const maxOrderCents = 2_147_483_647;

export interface IOrderSnapshotLineCommand {
  skuId: TableIdentity;
  quantity: number;
}

export interface IOrderSnapshotCreateCommand {
  addressId: TableIdentity;
  correlationId: string;
  lines: IOrderSnapshotLineCommand[];
}

export interface IOrderSnapshotCreateResult {
  order: EntityOrder;
  lines: EntityOrderLine[];
}

@Service()
export class ServiceOrder extends BeanBase {
  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  async createSnapshot(command: IOrderSnapshotCreateCommand): Promise<IOrderSnapshotCreateResult> {
    this._assertCommand(command);

    const existingOrder = await this.scope.model.order.getForUpdate({
      userId: this.bean.passport.currentUser!.id,
      correlationId: command.correlationId,
    });
    if (existingOrder) {
      await this._assertExistingSnapshotMatchesCommand(existingOrder, command);
      return (await this._viewSnapshot(existingOrder))!;
    }

    const address = await this.$scope.commerceMember.model.address.get({
      id: command.addressId,
      userId: this.bean.passport.currentUser!.id,
    });
    if (!address) {
      this.app.throw(404, 'Address not found');
    }

    const preparedLines = await Promise.all(
      command.lines.map((line, index) => this._prepareLine(line, index)),
    );
    const eligibleSubtotalCents = preparedLines.reduce((total, line) => {
      const nextTotal = total + line.eligibleSubtotalCents;
      if (!Number.isSafeInteger(nextTotal) || nextTotal > maxOrderCents) {
        this.app.throw(400, 'order total exceeds the supported range');
      }
      return nextTotal;
    }, 0);
    const order = await this.scope.model.order.insert({
      userId: this.bean.passport.currentUser!.id,
      addressId: address.id,
      correlationId: command.correlationId,
      addressSnapshot: this._toAddressSnapshot(address),
      state: 'awaiting_payment',
      currency: 'USD',
      eligibleSubtotalCents,
      discountCents: 0,
      payableTotalCents: eligibleSubtotalCents,
      reservationExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });
    const lines = await Promise.all(
      preparedLines.map(async line => {
        const orderLine = await this.scope.model.orderLine.insert({
          orderId: order.id,
          skuId: line.skuId,
          productId: line.productId,
          skuCodeSnapshot: line.skuCodeSnapshot,
          titleSnapshot: line.titleSnapshot,
          skuAttributesSnapshot: line.skuAttributesSnapshot,
          unitPriceCents: line.unitPriceCents,
          quantity: line.quantity,
          eligibleSubtotalCents: line.eligibleSubtotalCents,
          lineTotalCents: line.eligibleSubtotalCents,
        });
        await this.scope.service.stockBalance.reserve({
          skuId: orderLine.skuId,
          orderLineId: orderLine.id,
          quantity: orderLine.quantity,
          correlationId: `${command.correlationId}:line:${line.index}`,
          reason: 'order snapshot created',
        });
        return orderLine;
      }),
    );
    return { order, lines };
  }

  async viewSnapshot(id: TableIdentity): Promise<IOrderSnapshotCreateResult | undefined> {
    const order = await this.scope.model.order.get({
      id,
      userId: this.bean.passport.currentUser!.id,
    });
    if (!order) return undefined;
    return await this._viewSnapshot(order);
  }

  private async _viewSnapshot(order: EntityOrder): Promise<IOrderSnapshotCreateResult> {
    const lines = await this.scope.model.orderLine.select({
      where: { orderId: order.id },
      orders: [['id', 'asc']],
    });
    return { order, lines };
  }

  private async _assertExistingSnapshotMatchesCommand(
    order: EntityOrder,
    command: IOrderSnapshotCreateCommand,
  ) {
    const lines = await this.scope.model.orderLine.select({
      where: { orderId: order.id },
      orders: [['id', 'asc']],
    });
    if (
      String(order.addressId) !== String(command.addressId) ||
      lines.length !== command.lines.length ||
      lines.some(
        (line, index) =>
          String(line.skuId) !== String(command.lines[index].skuId) ||
          line.quantity !== command.lines[index].quantity,
      )
    ) {
      this.app.throw(409, 'order snapshot correlation conflicts with an existing order');
    }
  }

  private async _prepareLine(command: IOrderSnapshotLineCommand, index = 0) {
    if (!Number.isInteger(command.quantity) || command.quantity <= 0) {
      this.app.throw(400, 'order line quantity must be a positive integer');
    }
    const sku = await this.$scope.commerceCatalog.model.sku.getById(command.skuId, {
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
    if (!sku || sku.lifecycle !== 'active') {
      this.app.throw(404, 'SKU not found');
    }
    if (!sku.product?.published || !sku.product.category?.published) {
      this.app.throw(409, 'SKU is not sellable');
    }
    const eligibleSubtotalCents = sku.priceCents * command.quantity;
    if (!Number.isSafeInteger(eligibleSubtotalCents) || eligibleSubtotalCents > maxOrderCents) {
      this.app.throw(400, 'order line total exceeds the supported range');
    }
    return {
      index,
      skuId: sku.id,
      productId: sku.product.id,
      skuCodeSnapshot: sku.code,
      titleSnapshot: sku.product.title,
      skuAttributesSnapshot: sku.attributes.map(
        attribute =>
          ({
            name: attribute.name,
            value: attribute.value,
          }) satisfies DtoOrderLineSkuAttributeSnapshot,
      ),
      unitPriceCents: sku.priceCents,
      quantity: command.quantity,
      eligibleSubtotalCents,
    };
  }

  private _toAddressSnapshot(address: {
    recipientName: string;
    phone: string;
    countryCode: string;
    region: string;
    city: string;
    postalCode: string;
    addressLine1: string;
    addressLine2?: string;
  }): DtoOrderAddressSnapshot {
    return {
      recipientName: address.recipientName,
      phone: address.phone,
      countryCode: address.countryCode,
      region: address.region,
      city: address.city,
      postalCode: address.postalCode,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
    };
  }

  private _assertCommand(command: IOrderSnapshotCreateCommand) {
    if (!command.correlationId.trim()) {
      this.app.throw(400, 'order snapshot correlationId is required');
    }
    if (command.correlationId.length > 70) {
      this.app.throw(400, 'order snapshot correlationId is too long');
    }
    if (command.lines.length === 0) {
      this.app.throw(400, 'order snapshot requires at least one line');
    }
    if (new Set(command.lines.map(line => String(line.skuId))).size !== command.lines.length) {
      this.app.throw(400, 'order snapshot cannot contain duplicate SKUs');
    }
  }
}
