import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('commerceTradeStockAudit', 'stockBalanceId'),
    ...$tableColumns('commerceTradeStockAudit', 'skuId'),
    ...$tableColumns('commerceTradeStockAudit', 'correlationId'),
    ...$tableColumns('commerceTradeStockBalance', 'skuId'),
  },
})
export class MetaIndex extends BeanBase {}
