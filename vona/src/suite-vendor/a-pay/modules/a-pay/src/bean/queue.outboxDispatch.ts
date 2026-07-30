import type { TableIdentity } from 'table-identity';
import type { IQueueExecute, IQueuePushOptions } from 'vona-module-a-queue';

import { BeanQueueBase, Queue } from 'vona-module-a-queue';

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
      await this.scope.event.paymentOutcome.emit(event.payload as never);
      await this.scope.service.outbox.markDispatched(event.id, event.claimToken!);
    } catch (error) {
      await this.scope.service.outbox.release(event.id, event.claimToken!, error);
    }
  }
}
