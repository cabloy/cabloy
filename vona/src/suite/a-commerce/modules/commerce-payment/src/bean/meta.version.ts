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

    const entityRefundRequest = this.scope.entity.refundRequest;
    await this.bean.model.createTable(entityRefundRequest.$table, table => {
      table.comment(entityRefundRequest.$comment.$table);
      table.basicFields();
      table
        .tableIdentity(entityRefundRequest.orderId)
        .comment(entityRefundRequest.$comment.orderId);
      table.userId(entityRefundRequest.userId).comment(entityRefundRequest.$comment.userId);
      table.string(entityRefundRequest.state, 20).comment(entityRefundRequest.$comment.state);
      table.string(entityRefundRequest.currency, 3).comment(entityRefundRequest.$comment.currency);
      table
        .integer(entityRefundRequest.amountCents)
        .comment(entityRefundRequest.$comment.amountCents);
      table
        .string(entityRefundRequest.correlationId, 100)
        .comment(entityRefundRequest.$comment.correlationId);
      table.string(entityRefundRequest.reason, 255).comment(entityRefundRequest.$comment.reason);
      table
        .userId(entityRefundRequest.reviewedBy)
        .nullable()
        .comment(entityRefundRequest.$comment.reviewedBy);
      table
        .dateTime(entityRefundRequest.reviewedAt)
        .nullable()
        .comment(entityRefundRequest.$comment.reviewedAt);
      table
        .dateTime(entityRefundRequest.finalizedAt)
        .nullable()
        .comment(entityRefundRequest.$comment.finalizedAt);
    });

    const entityRefundAttempt = this.scope.entity.refundAttempt;
    await this.bean.model.createTable(entityRefundAttempt.$table, table => {
      table.comment(entityRefundAttempt.$comment.$table);
      table.basicFields();
      table
        .tableIdentity(entityRefundAttempt.refundRequestId)
        .comment(entityRefundAttempt.$comment.refundRequestId);
      table
        .tableIdentity(entityRefundAttempt.orderId)
        .comment(entityRefundAttempt.$comment.orderId);
      table.userId(entityRefundAttempt.userId).comment(entityRefundAttempt.$comment.userId);
      table.string(entityRefundAttempt.state, 20).comment(entityRefundAttempt.$comment.state);
      table.string(entityRefundAttempt.currency, 3).comment(entityRefundAttempt.$comment.currency);
      table
        .integer(entityRefundAttempt.amountCents)
        .comment(entityRefundAttempt.$comment.amountCents);
      table
        .string(entityRefundAttempt.correlationId, 100)
        .comment(entityRefundAttempt.$comment.correlationId);
      table
        .dateTime(entityRefundAttempt.finalizedAt)
        .nullable()
        .comment(entityRefundAttempt.$comment.finalizedAt);
    });

    const entityRefundAudit = this.scope.entity.refundAudit;
    await this.bean.model.createTable(entityRefundAudit.$table, table => {
      table.comment(entityRefundAudit.$comment.$table);
      table.basicFields();
      table
        .tableIdentity(entityRefundAudit.refundRequestId)
        .comment(entityRefundAudit.$comment.refundRequestId);
      table
        .tableIdentity(entityRefundAudit.refundAttemptId)
        .nullable()
        .comment(entityRefundAudit.$comment.refundAttemptId);
      table.tableIdentity(entityRefundAudit.orderId).comment(entityRefundAudit.$comment.orderId);
      table.userId(entityRefundAudit.userId).comment(entityRefundAudit.$comment.userId);
      table
        .string(entityRefundAudit.toRefundState, 20)
        .comment(entityRefundAudit.$comment.toRefundState);
      table
        .string(entityRefundAudit.attemptState, 20)
        .nullable()
        .comment(entityRefundAudit.$comment.attemptState);
      table
        .string(entityRefundAudit.idempotencyKey, 100)
        .nullable()
        .comment(entityRefundAudit.$comment.idempotencyKey);
      table
        .string(entityRefundAudit.correlationId, 100)
        .comment(entityRefundAudit.$comment.correlationId);
      table.string(entityRefundAudit.reason, 255).comment(entityRefundAudit.$comment.reason);
      table
        .userId(entityRefundAudit.actorId)
        .nullable()
        .comment(entityRefundAudit.$comment.actorId);
      table.dateTime(entityRefundAudit.processedAt).comment(entityRefundAudit.$comment.processedAt);
    });
  }
}
