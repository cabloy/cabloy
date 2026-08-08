import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoStockAuditSelectRes } from '../dto/stockAuditSelectRes.tsx';
import type { DtoStockAuditView } from '../dto/stockAuditView.tsx';
import type { ModelStockAudit } from '../model/stockAudit.ts';

@Service()
export class ServiceStockAudit extends BeanBase {
  async select(params?: IQueryParams<ModelStockAudit>): Promise<DtoStockAuditSelectRes> {
    return await this.scope.model.stockAudit.selectAndCount({
      ...params,
      columns: ['id', 'skuId', 'operation', 'delta', 'createdAt'],
    });
  }

  async view(id: TableIdentity): Promise<DtoStockAuditView | undefined> {
    return await this.scope.model.stockAudit.getById(id, {
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
  }
}
