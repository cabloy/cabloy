import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { EntityPaymentAttempt, TypePaymentAttemptState } from '../entity/paymentAttempt.tsx';

export interface IPaymentAttemptCreateCommand {
  orderId: TableIdentity;
  userId: TableIdentity;
  currency: 'USD';
  amountCents: number;
  correlationId: string;
}

export type TypePaymentAttemptFinalState = Extract<
  TypePaymentAttemptState,
  'succeeded' | 'failed' | 'cancelled'
>;

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

  async finalize(
    orderId: TableIdentity,
    state: TypePaymentAttemptFinalState,
  ): Promise<EntityPaymentAttempt | undefined> {
    const attempt = await this.scope.model.paymentAttempt.getForUpdate({ orderId });
    if (!attempt || attempt.state === state) return attempt;
    if (attempt.state !== 'created') this.app.throw(409, 'payment attempt is already finalized');
    const finalizedAt = new Date();
    const cancelledAt = state === 'cancelled' ? finalizedAt : undefined;
    await this.scope.model.paymentAttempt.updateById(attempt.id, {
      state,
      finalizedAt,
      cancelledAt,
    });
    return { ...attempt, state, finalizedAt, cancelledAt };
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  async cancel(orderId: TableIdentity): Promise<EntityPaymentAttempt | undefined> {
    return await this.finalize(orderId, 'cancelled');
  }
}
