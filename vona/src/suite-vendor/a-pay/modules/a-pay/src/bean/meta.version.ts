import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version !== 1) return;

    const paymentSession = this.scope.entity.paymentSession;
    await this.bean.model.createTable(paymentSession.$table, table => {
      table.basicFields();
      table.userId(paymentSession.userId);
      table.string(paymentSession.payScene, 100);
      table.string(paymentSession.businessReference, 100);
      table.string(paymentSession.providerInvoiceReference, 100);
      table.string(paymentSession.providerCorrelationReference, 100);
      table.string(paymentSession.providerName, 100);
      table.string(paymentSession.clientName, 100);
      table.string(paymentSession.environment, 16);
      table.integer(paymentSession.amountMinor);
      table.string(paymentSession.currency, 3);
      table.string(paymentSession.state, 32);
      table.json(paymentSession.nextAction);
      table.string(paymentSession.providerPaymentId, 255);
      table.string(paymentSession.providerOrderId, 255);
      table.string(paymentSession.providerCaptureId, 255);
      table.string(paymentSession.correlationId, 100);
      table.dateTime(paymentSession.expiresAt);
      table.dateTime(paymentSession.finalizedAt);
    });

    const providerOperation = this.scope.entity.providerOperation;
    await this.bean.model.createTable(providerOperation.$table, table => {
      table.basicFields();
      table.tableIdentity(providerOperation.paymentSessionId);
      table.tableIdentity(providerOperation.refundOperationId);
      table.string(providerOperation.kind, 32);
      table.string(providerOperation.state, 32);
      table.string(providerOperation.idempotencyKey, 100);
      table.string(providerOperation.correlationId, 100);
      table.string(providerOperation.providerRequestId, 255);
      table.string(providerOperation.providerResourceId, 255);
      table.integer(providerOperation.attemptCount);
      table.dateTime(providerOperation.claimedAt);
      table.string(providerOperation.claimToken, 100);
      table.dateTime(providerOperation.claimExpiresAt);
      table.dateTime(providerOperation.submittedAt);
      table.dateTime(providerOperation.recoveryRetryGrantedAt);
      table.dateTime(providerOperation.nextAttemptAt);
      table.string(providerOperation.errorCode, 100);
      table.string(providerOperation.errorSummary, 255);
      table.dateTime(providerOperation.finalizedAt);
    });

    const refundOperation = this.scope.entity.refundOperation;
    await this.bean.model.createTable(refundOperation.$table, table => {
      table.basicFields();
      table.tableIdentity(refundOperation.paymentSessionId);
      table.string(refundOperation.businessReference, 100);
      table.string(refundOperation.providerInvoiceReference, 100);
      table.string(refundOperation.providerCorrelationReference, 100);
      table.integer(refundOperation.amountMinor);
      table.string(refundOperation.currency, 3);
      table.string(refundOperation.state, 32);
      table.string(refundOperation.idempotencyKey, 100);
      table.string(refundOperation.providerRefundId, 255);
      table.dateTime(refundOperation.finalizedAt);
    });

    const providerOperationRecoveryAudit = this.scope.entity.providerOperationRecoveryAudit;
    await this.bean.model.createTable(providerOperationRecoveryAudit.$table, table => {
      table.basicFields();
      table.tableIdentity(providerOperationRecoveryAudit.providerOperationId);
      table.tableIdentity(providerOperationRecoveryAudit.actorId);
      table.string(providerOperationRecoveryAudit.action, 32);
      table.string(providerOperationRecoveryAudit.actionIdempotencyKey, 100);
      table.string(providerOperationRecoveryAudit.reason, 255);
      table.string(providerOperationRecoveryAudit.beforeState, 32);
      table.string(providerOperationRecoveryAudit.afterState, 32);
      table.integer(providerOperationRecoveryAudit.beforeAttemptCount);
      table.integer(providerOperationRecoveryAudit.afterAttemptCount);
      table.string(providerOperationRecoveryAudit.resolution, 32);
      table.string(providerOperationRecoveryAudit.providerRefundId, 255);
      table.dateTime(providerOperationRecoveryAudit.occurredAt);
    });

    const webhookInbox = this.scope.entity.webhookInbox;
    await this.bean.model.createTable(webhookInbox.$table, table => {
      table.basicFields();
      table.string(webhookInbox.providerName, 100);
      table.string(webhookInbox.clientName, 100);
      table.string(webhookInbox.environment, 16);
      table.string(webhookInbox.providerEventId, 255);
      table.string(webhookInbox.eventType, 100);
      table.tableIdentity(webhookInbox.paymentSessionId);
      table.tableIdentity(webhookInbox.refundOperationId);
      table.string(webhookInbox.paymentState, 32);
      table.string(webhookInbox.refundState, 32);
      table.integer(webhookInbox.amountMinor);
      table.string(webhookInbox.currency, 3);
      table.string(webhookInbox.providerCaptureId, 255);
      table.string(webhookInbox.providerRefundId, 255);
      table.string(webhookInbox.payloadHash, 64);
      table.string(webhookInbox.state, 32);
      table.integer(webhookInbox.retryCount);
      table.dateTime(webhookInbox.processedAt);
      table.string(webhookInbox.errorSummary, 255);
    });

    const paymentAudit = this.scope.entity.paymentAudit;
    await this.bean.model.createTable(paymentAudit.$table, table => {
      table.basicFields();
      table.tableIdentity(paymentAudit.paymentSessionId);
      table.tableIdentity(paymentAudit.providerOperationId);
      table.tableIdentity(paymentAudit.webhookInboxId);
      table.string(paymentAudit.fromState, 32);
      table.string(paymentAudit.toState, 32);
      table.string(paymentAudit.correlationId, 100);
      table.string(paymentAudit.source, 100);
      table.dateTime(paymentAudit.occurredAt);
    });

    const outboxEvent = this.scope.entity.outboxEvent;
    await this.bean.model.createTable(outboxEvent.$table, table => {
      table.basicFields();
      table.string(outboxEvent.eventType, 100);
      table.tableIdentity(outboxEvent.paymentSessionId);
      table.tableIdentity(outboxEvent.refundOperationId);
      table.json(outboxEvent.payload);
      table.string(outboxEvent.state, 32);
      table.integer(outboxEvent.attemptCount);
      table.dateTime(outboxEvent.claimedAt);
      table.string(outboxEvent.claimToken, 100);
      table.dateTime(outboxEvent.claimExpiresAt);
      table.dateTime(outboxEvent.nextAttemptAt);
      table.dateTime(outboxEvent.dispatchedAt);
      table.string(outboxEvent.errorSummary, 255);
    });
  }
}
