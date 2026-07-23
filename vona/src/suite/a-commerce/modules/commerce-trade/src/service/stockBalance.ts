import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoStockAdjust } from '../dto/stockAdjust.tsx';
import type { DtoStockBalanceSelectRes } from '../dto/stockBalanceSelectRes.tsx';
import type { DtoStockBalanceView } from '../dto/stockBalanceView.tsx';
import type { EntityStockBalance } from '../entity/stockBalance.tsx';
import type {
  EntityStockReservation,
  TypeStockReservationState,
} from '../entity/stockReservation.tsx';
import type { ModelStockBalance } from '../model/stockBalance.ts';

export interface IStockReservationCommand {
  skuId: TableIdentity;
  orderLineId?: TableIdentity;
  quantity: number;
  correlationId: string;
  reason: string;
}

export interface IStockReservationTransition {
  reservationId: TableIdentity;
  reason: string;
}

const serializationRetryOptions = {
  retries: 1,
  factor: 1,
  minTimeout: 0,
  maxTimeout: 0,
  randomize: false,
  errorCodes: ['40001', 'ER_LOCK_DEADLOCK', 'ER_LOCK_WAIT_TIMEOUT'],
  ownerOnly: true,
};

@Service()
export class ServiceStockBalance extends BeanBase {
  async select(params?: IQueryParams<ModelStockBalance>): Promise<DtoStockBalanceSelectRes> {
    return await this.scope.model.stockBalance.selectAndCount(params);
  }

  async view(id: TableIdentity): Promise<DtoStockBalanceView | undefined> {
    return await this.scope.model.stockBalance.getById(id);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async adjustStock(stockAdjust: DtoStockAdjust): Promise<EntityStockBalance> {
    const sku = await this.$scope.commerceCatalog.model.sku.getById(stockAdjust.skuId);
    if (!sku) {
      this.app.throw(404, 'SKU not found');
    }

    let stockBalance = await this.scope.model.stockBalance.getForUpdate({
      skuId: stockAdjust.skuId,
    });
    const priorBalance = stockBalance ?? {
      onHand: 0,
      reserved: 0,
      available: 0,
    };
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

    await this._appendAudit({
      stockBalance,
      priorBalance,
      delta: stockAdjust.delta,
      operation: 'adjust',
      reason: stockAdjust.reason,
      correlationId: stockAdjust.correlationId,
    });
    return stockBalance;
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async reserve(command: IStockReservationCommand): Promise<EntityStockReservation> {
    this._assertReservationCommand(command);
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

    const stockBalance = await this._getLockedBalance(command.skuId);
    if (!stockBalance) {
      this.app.throw(409, 'insufficient available stock');
    }
    const existingReservation = await this.scope.model.stockReservation.get({
      correlationId: command.correlationId,
    });
    if (existingReservation) {
      if (
        String(existingReservation.skuId) !== String(command.skuId) ||
        String(existingReservation.orderLineId ?? '') !== String(command.orderLineId ?? '') ||
        existingReservation.quantity !== command.quantity
      ) {
        this.app.throw(409, 'stock reservation correlation conflicts with an existing reservation');
      }
      return existingReservation;
    }
    if (stockBalance.available < command.quantity) {
      this.app.throw(409, 'insufficient available stock');
    }

    const reservation = await this.scope.model.stockReservation.insert({
      stockBalanceId: stockBalance.id,
      skuId: command.skuId,
      orderLineId: command.orderLineId,
      quantity: command.quantity,
      state: 'reserved',
      correlationId: command.correlationId,
    });
    const priorBalance = stockBalance;
    const updatedBalance = await this._updateBalance(stockBalance, {
      onHand: stockBalance.onHand,
      reserved: stockBalance.reserved + command.quantity,
    });
    await this._appendAudit({
      stockBalance: updatedBalance,
      priorBalance,
      stockReservationId: reservation.id,
      delta: -command.quantity,
      operation: 'reserve',
      reason: command.reason,
      correlationId: command.correlationId,
    });
    return reservation;
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  async consume(transition: IStockReservationTransition): Promise<EntityStockReservation> {
    return await this._transitionReservation(
      transition,
      'reserved',
      'consumed',
      (stockBalance, reservation) => ({
        onHand: stockBalance.onHand - reservation.quantity,
        reserved: stockBalance.reserved - reservation.quantity,
      }),
    );
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  async release(transition: IStockReservationTransition): Promise<EntityStockReservation> {
    return await this._transitionReservation(
      transition,
      'reserved',
      'released',
      (stockBalance, reservation) => ({
        onHand: stockBalance.onHand,
        reserved: stockBalance.reserved - reservation.quantity,
      }),
    );
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  async restore(transition: IStockReservationTransition): Promise<EntityStockReservation> {
    return await this._transitionReservation(
      transition,
      'consumed',
      'restored',
      (stockBalance, reservation) => ({
        onHand: stockBalance.onHand + reservation.quantity,
        reserved: stockBalance.reserved,
      }),
    );
  }

  private async _transitionReservation(
    transition: IStockReservationTransition,
    sourceState: TypeStockReservationState,
    targetState: TypeStockReservationState,
    calculateBalance: (
      stockBalance: EntityStockBalance,
      reservation: EntityStockReservation,
    ) => Pick<EntityStockBalance, 'onHand' | 'reserved'>,
  ): Promise<EntityStockReservation> {
    if (!transition.reason.trim()) {
      this.app.throw(400, 'stock reservation reason is required');
    }
    const reservation = await this.scope.model.stockReservation.getByIdForUpdate(
      transition.reservationId,
    );
    if (!reservation) {
      this.app.throw(404, 'stock reservation not found');
    }
    if (reservation.state === targetState) {
      return reservation;
    }
    if (reservation.state !== sourceState) {
      this.app.throw(409, `cannot ${targetState} a ${reservation.state} stock reservation`);
    }

    const stockBalance = await this.scope.model.stockBalance.getByIdForUpdate(
      reservation.stockBalanceId,
    );
    if (!stockBalance) {
      this.app.throw(404, 'stock balance not found');
    }
    const priorBalance = stockBalance;
    const updatedBalance = await this._updateBalance(
      stockBalance,
      calculateBalance(stockBalance, reservation),
    );
    await this.scope.model.stockReservation.updateById(reservation.id, { state: targetState });
    const updatedReservation = { ...reservation, state: targetState };
    const operation =
      targetState === 'consumed' ? 'consume' : targetState === 'released' ? 'release' : 'restore';
    await this._appendAudit({
      stockBalance: updatedBalance,
      priorBalance,
      stockReservationId: reservation.id,
      delta:
        operation === 'consume'
          ? -reservation.quantity
          : operation === 'restore'
            ? reservation.quantity
            : 0,
      operation,
      reason: transition.reason,
      correlationId: reservation.correlationId,
    });
    return updatedReservation;
  }

  private async _getLockedBalance(skuId: TableIdentity): Promise<EntityStockBalance | undefined> {
    return await this.scope.model.stockBalance.getForUpdate({ skuId });
  }

  private async _updateBalance(
    stockBalance: EntityStockBalance,
    values: Pick<EntityStockBalance, 'onHand' | 'reserved'>,
  ): Promise<EntityStockBalance> {
    const available = values.onHand - values.reserved;
    if (values.onHand < 0 || values.reserved < 0 || available < 0) {
      this.app.throw(409, 'stock balance would become negative');
    }
    await this.scope.model.stockBalance.updateById(stockBalance.id, {
      onHand: values.onHand,
      reserved: values.reserved,
      available,
    });
    return { ...stockBalance, ...values, available };
  }

  private async _appendAudit({
    stockBalance,
    priorBalance,
    stockReservationId,
    delta,
    operation,
    reason,
    correlationId,
  }: {
    stockBalance: EntityStockBalance;
    priorBalance: Pick<EntityStockBalance, 'onHand' | 'reserved' | 'available'>;
    stockReservationId?: TableIdentity;
    delta: number;
    operation: 'adjust' | 'reserve' | 'consume' | 'release' | 'restore';
    reason: string;
    correlationId: string;
  }) {
    await this.scope.model.stockAudit.insert({
      stockBalanceId: stockBalance.id,
      skuId: stockBalance.skuId,
      stockReservationId,
      actorId: this.bean.passport.currentUser?.anonymous
        ? undefined
        : this.bean.passport.currentUser?.id,
      operation,
      delta,
      reason,
      correlationId,
      priorOnHand: priorBalance.onHand,
      priorReserved: priorBalance.reserved,
      priorAvailable: priorBalance.available,
      onHand: stockBalance.onHand,
      reserved: stockBalance.reserved,
      available: stockBalance.available,
    });
  }

  private _assertReservationCommand(command: IStockReservationCommand) {
    if (!Number.isInteger(command.quantity) || command.quantity <= 0) {
      this.app.throw(400, 'stock reservation quantity must be a positive integer');
    }
    if (!command.correlationId.trim()) {
      this.app.throw(400, 'stock reservation correlationId is required');
    }
    if (!command.reason.trim()) {
      this.app.throw(400, 'stock reservation reason is required');
    }
  }
}
