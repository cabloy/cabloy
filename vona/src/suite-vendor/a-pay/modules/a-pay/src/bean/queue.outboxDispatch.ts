import type { TableIdentity } from 'table-identity';
import type { IQueueExecute, IQueuePushOptions } from 'vona-module-a-queue';

import { BeanQueueBase, Queue } from 'vona-module-a-queue';

import type { IPaymentOutcomeEvent } from '../types/payment.ts';

export interface IOutboxDispatchJobData {
  outboxEventId: TableIdentity;
}

@Queue()
export class QueueOutboxDispatch
  extends BeanQueueBase<IOutboxDispatchJobData, void>
  implements IQueueExecute<IOutboxDispatchJobData, void>
{
  async execute(data: IOutboxDispatchJobData, _options?: IQueuePushOptions): Promise<void> {
    const event = await this.scope.service.outbox.claim(data.outboxEventId);
    if (!event) return;
    try {
      if (event.eventType !== 'payment.outcome.v1') {
        this.app.throw(409, `unsupported payment outbox event: ${event.eventType}`);
      }
      const session = await this.scope.model.paymentSession.getById(event.paymentSessionId);
      if (!session) this.app.throw(404, 'payment session not found');
      const payScene = this.bean.payScene.get(session.payScene as never);
      await payScene.onPaymentOutcome(event.payload as unknown as IPaymentOutcomeEvent);
      await this.scope.service.outbox.markDispatched(event.id, event.claimToken!);
    } catch (error) {
      await this.scope.service.outbox.release(event.id, event.claimToken!, error);
    }
  }
}
