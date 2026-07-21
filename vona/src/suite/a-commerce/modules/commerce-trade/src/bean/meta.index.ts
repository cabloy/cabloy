import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('commerceTradeCart', 'userId'),
    ...$tableColumns('commerceTradeCartItem', 'cartId'),
    ...$tableColumns('commerceTradeCartItem', 'skuId'),
    ...$tableColumns('commerceTradeStockAudit', 'stockBalanceId'),
    ...$tableColumns('commerceTradeStockAudit', 'skuId'),
    ...$tableColumns('commerceTradeStockAudit', 'stockReservationId'),
    ...$tableColumns('commerceTradeStockAudit', 'correlationId'),
    ...$tableColumns('commerceTradeStockBalance', 'skuId'),
    ...$tableColumns('commerceTradeStockReservation', 'stockBalanceId'),
    ...$tableColumns('commerceTradeStockReservation', 'skuId'),
    ...$tableColumns('commerceTradeStockReservation', 'correlationId'),
    ...$tableColumns('commerceTradeStockReservation', 'state'),
  },
})
export class MetaIndex extends BeanBase {}
