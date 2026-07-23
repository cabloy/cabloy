import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { EntityPaymentAttempt } from '../entity/paymentAttempt.tsx';

export interface IPaymentAttemptCreateCommand {
  orderId: TableIdentity;
  userId: TableIdentity;
  currency: 'USD';
  amountCents: number;
  correlationId: string;
}

@Service()
export class ServicePaymentAttempt extends BeanBase {
  async create(command: IPaymentAttemptCreateCommand): Promise<EntityPaymentAttempt> {
    return await this.scope.model.paymentAttempt.insert({
      orderId: command.orderId,
      userId: command.userId,
      state: 'created',
      currency: command.currency,
      amountCents: command.amountCents,
      correlationId: command.correlationId,
    });
  }

  async cancel(orderId: TableIdentity): Promise<EntityPaymentAttempt | undefined> {
    const transaction = this.bean.database.current.transaction;
    if (transaction.inTransaction) return await this._cancel(orderId);
    return await transaction.begin(() => this._cancel(orderId), { isolationLevel: 'SERIALIZABLE' });
  }

  private async _cancel(orderId: TableIdentity): Promise<EntityPaymentAttempt | undefined> {
    const attempt = await this.scope.model.paymentAttempt.getForUpdate({ orderId });
    if (!attempt || attempt.state === 'cancelled') return attempt;
    const cancelledAt = new Date();
    await this.scope.model.paymentAttempt.updateById(attempt.id, {
      state: 'cancelled',
      cancelledAt,
    });
    return { ...attempt, state: 'cancelled', cancelledAt };
  }
}
