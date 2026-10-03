import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('commerceTradeCart', 'userId'),
    ...$tableColumns('commerceTradeCartItem', ['cartId', 'skuId']),
    ...$tableColumns('commerceTradeOrder', [
      'userId',
      'correlationId',
      'state',
      'reservationExpiresAt',
    ]),
    ...$tableColumns('commerceTradeOrderLine', ['orderId', 'skuId']),
    ...$tableColumns('commerceTradeShipment', ['orderId', 'correlationId']),
    ...$tableColumns('commerceTradeOrderAudit', ['orderId', 'correlationId']),
    ...$tableColumns('commerceTradeStockAudit', [
      'stockBalanceId',
      'skuId',
      'stockReservationId',
      'correlationId',
    ]),
    ...$tableColumns('commerceTradeStockBalance', 'skuId'),
    ...$tableColumns('commerceTradeStockReservation', [
      'stockBalanceId',
      'skuId',
      'orderLineId',
      'correlationId',
      'state',
    ]),
  },
})
export class MetaIndex extends BeanBase {}
