import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version !== 1) return;

    const entityPaymentAttempt = this.scope.entity.paymentAttempt;
    await this.bean.model.createTable(entityPaymentAttempt.$table, table => {
      table.comment(entityPaymentAttempt.$comment.$table);
      table.basicFields();
      table
        .tableIdentity(entityPaymentAttempt.orderId)
        .comment(entityPaymentAttempt.$comment.orderId);
      table.userId(entityPaymentAttempt.userId).comment(entityPaymentAttempt.$comment.userId);
      table.string(entityPaymentAttempt.state, 20).comment(entityPaymentAttempt.$comment.state);
      table
        .string(entityPaymentAttempt.currency, 3)
        .comment(entityPaymentAttempt.$comment.currency);
      table
        .integer(entityPaymentAttempt.amountCents)
        .comment(entityPaymentAttempt.$comment.amountCents);
      table
        .string(entityPaymentAttempt.correlationId, 100)
        .comment(entityPaymentAttempt.$comment.correlationId);
      table
        .dateTime(entityPaymentAttempt.finalizedAt)
        .nullable()
        .comment(entityPaymentAttempt.$comment.finalizedAt);
      table
        .dateTime(entityPaymentAttempt.cancelledAt)
        .nullable()
        .comment(entityPaymentAttempt.$comment.cancelledAt);
    });

    const entityPaymentAudit = this.scope.entity.paymentAudit;
    await this.bean.model.createTable(entityPaymentAudit.$table, table => {
      table.comment(entityPaymentAudit.$comment.$table);
      table.basicFields();
      table
        .tableIdentity(entityPaymentAudit.paymentAttemptId)
        .comment(entityPaymentAudit.$comment.paymentAttemptId);
      table.tableIdentity(entityPaymentAudit.orderId).comment(entityPaymentAudit.$comment.orderId);
      table.userId(entityPaymentAudit.userId).comment(entityPaymentAudit.$comment.userId);
      table.string(entityPaymentAudit.provider, 20).comment(entityPaymentAudit.$comment.provider);
      table.string(entityPaymentAudit.outcome, 20).comment(entityPaymentAudit.$comment.outcome);
      table
        .string(entityPaymentAudit.fromAttemptState, 20)
        .comment(entityPaymentAudit.$comment.fromAttemptState);
      table
        .string(entityPaymentAudit.toOrderState, 30)
        .comment(entityPaymentAudit.$comment.toOrderState);
      table
        .string(entityPaymentAudit.idempotencyKey, 100)
        .comment(entityPaymentAudit.$comment.idempotencyKey);
      table
        .string(entityPaymentAudit.correlationId, 100)
        .comment(entityPaymentAudit.$comment.correlationId);
      table.string(entityPaymentAudit.reason, 255).comment(entityPaymentAudit.$comment.reason);
      table
        .userId(entityPaymentAudit.actorId)
        .nullable()
        .comment(entityPaymentAudit.$comment.actorId);
      table
        .dateTime(entityPaymentAudit.processedAt)
        .comment(entityPaymentAudit.$comment.processedAt);
    });
  }
}
