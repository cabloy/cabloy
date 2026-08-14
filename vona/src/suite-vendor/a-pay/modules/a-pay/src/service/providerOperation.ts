import type { TableIdentity } from 'table-identity';

import { randomUUID } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { EntityPaymentSession } from '../entity/paymentSession.tsx';
import type { EntityProviderOperation } from '../entity/providerOperation.tsx';
import type {
  IPayProviderOperationStartInputSnapshot,
  IPayProviderPaymentInput,
  IPayProviderPaymentSnapshot,
  IPayProviderRefundInput,
  TypeProviderOperationKind,
} from '../types/payment.ts';

import { ProviderOperationFailure } from '../lib/providerOperationFailure.ts';

const ClaimLeaseMilliseconds = 60_000;
const MaxAttempts = 10;
const PaypalRefundIdempotencyRetentionMilliseconds = 45 * 24 * 60 * 60 * 1_000;

export interface IRefundRecoveryCommand {
  actionIdempotencyKey: string;
  reason: string;
  acknowledgeRetryRisk?: boolean;
  actorId?: TableIdentity;
}

@Service()
export class ServiceProviderOperation extends BeanBase {
  async start(paymentSessionId: TableIdentity): Promise<EntityPaymentSession> {
    return await this.scope.redlock.lock(
      `pay.providerOperation.start.${paymentSessionId}`,
      async () => {
        const operation = await this.ensureStart(paymentSessionId);
        await this.execute(operation.id);
        return await this._getSession(paymentSessionId);
      },
    );
  }

  async confirm(paymentSessionId: TableIdentity): Promise<EntityPaymentSession> {
    return await this.scope.redlock.lock(
      `pay.providerOperation.confirm.${paymentSessionId}`,
      async () => {
        const operation = await this.ensureConfirm(paymentSessionId);
        if (operation) await this.execute(operation.id);
        return await this._getSession(paymentSessionId);
      },
    );
  }

  async reconcile(paymentSessionId: TableIdentity): Promise<EntityPaymentSession> {
    return await this.scope.redlock.lock(
      `pay.providerOperation.query.${paymentSessionId}`,
      async () => {
        const operation = await this.ensureQuery(paymentSessionId);
        await this.execute(operation.id);
        return await this._getSession(paymentSessionId);
      },
    );
  }

  @Core.transaction()
  async ensureStart(paymentSessionId: TableIdentity): Promise<EntityProviderOperation> {
    const session = await this.scope.model.paymentSession.getByIdForUpdate(paymentSessionId);
    if (!session) this.app.throw(404, 'payment session not found');
    const existing = await this.scope.model.providerOperation.getForUpdate({
      paymentSessionId: session.id,
      kind: 'start',
    });
    if (existing) return existing;
    if (session.state !== 'created') this.app.throw(409, 'payment session is not ready to start');
    if (session.expiresAt <= new Date()) this.app.throw(409, 'payment session is expired');

    const now = new Date();
    const { clientOptions } = this.bean.payProvider.resolveByName(
      session.providerName,
      session.clientName,
    );
    if (clientOptions.environment !== session.environment) {
      this.app.throw(500, 'payment session provider environment is inconsistent');
    }
    const callbackUrls = clientOptions.capabilities.redirectCheckout
      ? await this.scope.service.paymentCallback.createUrls(session)
      : undefined;
    await this.scope.model.paymentSession.updateById(session.id, { state: 'starting' });
    await this.scope.model.paymentAudit.insert({
      paymentSessionId: session.id,
      fromState: session.state,
      toState: 'starting',
      correlationId: session.correlationId,
      source: 'providerOperation.start',
      occurredAt: now,
    });
    return await this._insertOperation(session, 'start', now, callbackUrls);
  }

  @Core.transaction()
  async ensureConfirm(
    paymentSessionId: TableIdentity,
  ): Promise<EntityProviderOperation | undefined> {
    const session = await this.scope.model.paymentSession.getByIdForUpdate(paymentSessionId);
    if (!session) this.app.throw(404, 'payment session not found');
    if (['succeeded', 'failed', 'cancelled', 'expired'].includes(session.state)) return undefined;
    if (!session.providerOrderId) this.app.throw(409, 'payment session has no provider order');
    if (session.providerCaptureId || session.state === 'processing') {
      return await this._ensureQueryLocked(session);
    }
    const existing = await this.scope.model.providerOperation.getForUpdate({
      paymentSessionId: session.id,
      kind: 'confirm',
    });
    if (existing && !['succeeded', 'failed'].includes(existing.state)) return existing;
    return await this._insertOperation(session, 'confirm', new Date());
  }

  @Core.transaction()
  async ensureQuery(paymentSessionId: TableIdentity): Promise<EntityProviderOperation> {
    const session = await this.scope.model.paymentSession.getByIdForUpdate(paymentSessionId);
    if (!session) this.app.throw(404, 'payment session not found');
    if (!session.providerOrderId && !session.providerCaptureId) {
      this.app.throw(409, 'payment session has no provider resource to reconcile');
    }
    return await this._ensureQueryLocked(session);
  }

  private async _ensureQueryLocked(session: EntityPaymentSession) {
    const existing = await this.scope.model.providerOperation.getForUpdate({
      paymentSessionId: session.id,
      kind: 'query',
    });
    if (existing && !['succeeded', 'failed'].includes(existing.state)) return existing;
    return await this._insertOperation(session, 'query', new Date());
  }

  async reconcileRefund(providerOperationId: TableIdentity, command: IRefundRecoveryCommand) {
    const prepared = await this._prepareRefundRecovery(providerOperationId, command, 'reconcile');
    if (prepared.replay || prepared.resolution === 'unresolved') return prepared;
    await this.execute(providerOperationId);
    return await this._refundRecoveryResult(providerOperationId, prepared.auditId);
  }

  async retryRefund(providerOperationId: TableIdentity, command: IRefundRecoveryCommand) {
    const prepared = await this._prepareRefundRecovery(providerOperationId, command, 'retry');
    if (prepared.replay || prepared.resolution === 'unresolved') return prepared;
    await this.execute(providerOperationId);
    return await this._refundRecoveryResult(providerOperationId, prepared.auditId);
  }

  async execute(providerOperationId: TableIdentity) {
    const operation = await this.claim(providerOperationId);
    if (!operation) return undefined;
    try {
      const session = await this._getSession(operation.paymentSessionId);
      const { provider, clientOptions } = this.bean.payProvider.resolveByName(
        session.providerName,
        session.clientName,
      );
      if (clientOptions.environment !== session.environment) {
        this.app.throw(500, 'payment session provider environment is inconsistent');
      }
      await this.markSubmitted(operation.id, operation.claimToken!);
      if (operation.kind === 'refund') {
        return await this._executeRefund(operation, session, provider, clientOptions);
      }
      const snapshot = await this._executePayment(operation, session, provider, clientOptions);
      await this.settlePaymentSnapshot(operation.id, operation.claimToken!, snapshot);
      return snapshot;
    } catch (error) {
      await this.releaseForReconciliation(operation.id, operation.claimToken!, error);
      return undefined;
    }
  }

  private async _executePayment(
    operation: EntityProviderOperation,
    session: EntityPaymentSession,
    provider: ReturnType<typeof this.bean.payProvider.resolveByName>['provider'],
    clientOptions: ReturnType<typeof this.bean.payProvider.resolveByName>['clientOptions'],
  ) {
    const input =
      operation.kind === 'start' && !session.providerOrderId
        ? this._getStartInputSnapshot(operation, session)
        : this._createPaymentInput(operation, session);
    if (operation.kind === 'start') {
      return session.providerOrderId
        ? await provider.queryPayment(input, clientOptions)
        : await provider.startPayment(input, clientOptions);
    }
    if (operation.kind === 'confirm') {
      return session.providerCaptureId
        ? await provider.queryPayment(input, clientOptions)
        : await provider.confirmPayment(input, clientOptions);
    }
    if (operation.kind === 'query') return await provider.queryPayment(input, clientOptions);
    this.app.throw(500, `unsupported payment provider operation: ${operation.kind}`);
  }

  private _getStartInputSnapshot(
    operation: EntityProviderOperation,
    session: EntityPaymentSession,
  ): IPayProviderPaymentInput {
    const snapshot = operation.startInputSnapshot;
    if (!snapshot) {
      throw new ProviderOperationFailure(
        'start_input_snapshot_missing',
        'Payment start request cannot be replayed safely',
      );
    }
    if (
      snapshot.version !== 1 ||
      snapshot.paymentSessionId !== session.id ||
      snapshot.businessReference !== session.businessReference ||
      snapshot.providerInvoiceReference !== session.providerInvoiceReference ||
      snapshot.providerCorrelationReference !== session.providerCorrelationReference ||
      snapshot.idempotencyKey !== operation.idempotencyKey ||
      snapshot.amountMinor !== session.amountMinor ||
      snapshot.currency !== session.currency ||
      snapshot.providerOrderId ||
      Boolean(snapshot.returnUrl) !== Boolean(snapshot.cancelUrl)
    ) {
      throw new ProviderOperationFailure(
        'start_input_snapshot_invalid',
        'Payment start request cannot be replayed safely',
      );
    }
    return snapshot;
  }

  private _createPaymentInput(
    operation: EntityProviderOperation,
    session: EntityPaymentSession,
  ): IPayProviderPaymentInput {
    return {
      paymentSessionId: session.id,
      businessReference: session.businessReference,
      providerInvoiceReference: session.providerInvoiceReference,
      providerCorrelationReference: session.providerCorrelationReference,
      idempotencyKey: operation.idempotencyKey,
      amountMinor: session.amountMinor,
      currency: session.currency,
      providerOrderId: session.providerOrderId,
    };
  }

  private async _executeRefund(
    operation: EntityProviderOperation,
    session: EntityPaymentSession,
    provider: ReturnType<typeof this.bean.payProvider.resolveByName>['provider'],
    clientOptions: ReturnType<typeof this.bean.payProvider.resolveByName>['clientOptions'],
  ) {
    const refundOperationId = operation.refundOperationId;
    if (!refundOperationId) this.app.throw(500, 'refund provider operation is not linked');
    const refund = await this.scope.model.refundOperation.getById(refundOperationId);
    if (!refund) this.app.throw(404, 'refund operation not found');
    if (!session.providerCaptureId) this.app.throw(409, 'payment session has no provider capture');
    const input: IPayProviderRefundInput = {
      paymentSessionId: session.id,
      refundOperationId: refund.id,
      businessReference: refund.businessReference,
      providerInvoiceReference: refund.providerInvoiceReference,
      providerCorrelationReference: refund.providerCorrelationReference,
      idempotencyKey: operation.idempotencyKey,
      amountMinor: refund.amountMinor,
      currency: refund.currency,
      providerCaptureId: session.providerCaptureId,
      providerRefundId: refund.providerRefundId,
    };
    const snapshot = refund.providerRefundId
      ? provider.queryRefund
        ? await provider.queryRefund(input, clientOptions)
        : this.app.throw(409, 'payment provider cannot reconcile a known refund')
      : operation.attemptCount === 1 || operation.recoveryRetryGrantedAt
        ? await provider.createRefund(input, clientOptions)
        : this.app.throw(409, 'refund submission outcome requires audited recovery');
    await this.scope.service.refundOperation.settleProviderSnapshot(
      operation.id,
      operation.claimToken!,
      snapshot,
    );
    return snapshot;
  }

  @Core.transaction()
  async claim(id: TableIdentity) {
    const operation = await this.scope.model.providerOperation.getByIdForUpdate(id);
    if (!operation || ['succeeded', 'failed'].includes(operation.state)) return undefined;
    const now = new Date();
    const eligible =
      (operation.state === 'created' &&
        (!operation.nextAttemptAt || operation.nextAttemptAt <= now)) ||
      (operation.state === 'reconciliation_required' &&
        (!operation.nextAttemptAt || operation.nextAttemptAt <= now)) ||
      (['claimed', 'submitted'].includes(operation.state) &&
        !!operation.claimExpiresAt &&
        operation.claimExpiresAt <= now);
    if (!eligible) return undefined;
    const refund =
      operation.kind === 'refund' && operation.refundOperationId
        ? await this.scope.model.refundOperation.getByIdForUpdate(operation.refundOperationId)
        : undefined;
    if (
      operation.kind === 'refund' &&
      operation.submittedAt &&
      operation.errorCode === 'refund_submission_outcome_unknown' &&
      !operation.recoveryRetryGrantedAt &&
      !operation.providerResourceId &&
      !refund?.providerRefundId
    ) {
      return undefined;
    }
    if (operation.attemptCount >= MaxAttempts) {
      await this._finalizeFailedOperation(operation, {
        finalizedAt: now,
        errorCode: operation.errorCode,
        errorSummary: operation.errorSummary,
        source: 'attemptsExhausted',
      });
      return undefined;
    }
    const claimToken = randomUUID();
    const claimExpiresAt = new Date(now.getTime() + ClaimLeaseMilliseconds);
    await this.scope.model.providerOperation.updateById(operation.id, {
      state: 'claimed',
      claimedAt: now,
      claimToken,
      claimExpiresAt,
      attemptCount: operation.attemptCount + 1,
    });
    return {
      ...operation,
      claimedAt: now,
      claimToken,
      claimExpiresAt,
      attemptCount: operation.attemptCount + 1,
    };
  }

  @Core.transaction()
  async markSubmitted(id: TableIdentity, claimToken: string) {
    const operation = await this.scope.model.providerOperation.getByIdForUpdate(id);
    if (!operation || operation.state !== 'claimed' || operation.claimToken !== claimToken)
      return undefined;
    const submittedAt = new Date();
    await this.scope.model.providerOperation.updateById(operation.id, {
      state: 'submitted',
      providerRequestId: operation.providerRequestId ?? operation.idempotencyKey,
      submittedAt,
      recoveryRetryGrantedAt: undefined,
    });
    if (operation.kind === 'refund' && operation.refundOperationId) {
      const refund = await this.scope.model.refundOperation.getByIdForUpdate(
        operation.refundOperationId,
      );
      if (!refund) this.app.throw(404, 'refund operation not found');
      if (refund.state === 'created') {
        await this.scope.model.refundOperation.updateById(refund.id, { state: 'submitting' });
      }
    }
    return { ...operation, state: 'submitted' as const, submittedAt };
  }

  @Core.transaction()
  async settlePaymentSnapshot(
    id: TableIdentity,
    claimToken: string,
    snapshot: IPayProviderPaymentSnapshot,
  ) {
    const operation = await this.scope.model.providerOperation.getByIdForUpdate(id);
    if (
      !operation ||
      !['claimed', 'submitted'].includes(operation.state) ||
      operation.claimToken !== claimToken
    ) {
      return undefined;
    }
    const session = await this.scope.model.paymentSession.getByIdForUpdate(
      operation.paymentSessionId,
    );
    if (!session) this.app.throw(404, 'payment session not found');
    if (['succeeded', 'failed', 'cancelled', 'expired'].includes(session.state)) {
      await this._complete(operation, {
        providerResourceId: snapshot.providerCaptureId ?? snapshot.providerOrderId,
      });
      return session;
    }

    const nextAction = snapshot.nextAction;
    const providerPaymentId = snapshot.providerPaymentId ?? session.providerPaymentId;
    const providerOrderId = snapshot.providerOrderId ?? session.providerOrderId;
    const providerCaptureId = snapshot.providerCaptureId ?? session.providerCaptureId;
    if (isTerminalPaymentState(snapshot.state)) {
      const finalizedAt = new Date();
      await this.scope.model.paymentSession.updateById(session.id, {
        state: snapshot.state,
        nextAction,
        providerPaymentId,
        providerOrderId,
        providerCaptureId,
        finalizedAt,
      });
      await this.scope.model.paymentAudit.insert({
        paymentSessionId: session.id,
        providerOperationId: operation.id,
        fromState: session.state,
        toState: snapshot.state,
        correlationId: session.correlationId,
        source: `providerOperation.${operation.kind}`,
        occurredAt: finalizedAt,
      });
      await this.scope.service.outbox.enqueue(session.id, 'payment.outcome.v1', {
        eventId: `${operation.correlationId}:${operation.kind}`,
        paymentSessionId: session.id,
        businessReference: session.businessReference,
        providerName: session.providerName,
        state: snapshot.state,
        providerCaptureId,
        amountMinor: session.amountMinor,
        currency: session.currency,
      });
    } else {
      await this.scope.model.paymentSession.updateById(session.id, {
        state: snapshot.state,
        nextAction,
        providerPaymentId,
        providerOrderId,
        providerCaptureId,
      });
      await this.scope.model.paymentAudit.insert({
        paymentSessionId: session.id,
        providerOperationId: operation.id,
        fromState: session.state,
        toState: snapshot.state,
        correlationId: session.correlationId,
        source: `providerOperation.${operation.kind}`,
        occurredAt: new Date(),
      });
    }
    if (snapshot.state === 'processing' && ['confirm', 'query'].includes(operation.kind)) {
      await this._scheduleReconciliation(operation, providerCaptureId ?? providerOrderId);
    } else {
      await this._complete(operation, { providerResourceId: providerCaptureId ?? providerOrderId });
    }
    return {
      ...session,
      ...snapshot,
      nextAction,
      providerPaymentId,
      providerOrderId,
      providerCaptureId,
    };
  }

  @Core.transaction()
  async releaseForReconciliation(id: TableIdentity, claimToken: string, error: unknown) {
    const operation = await this.scope.model.providerOperation.getByIdForUpdate(id);
    if (
      !operation ||
      !['claimed', 'submitted'].includes(operation.state) ||
      operation.claimToken !== claimToken
    ) {
      return undefined;
    }
    const failure = classifyProviderFailure(error, operation.kind);
    const now = new Date();
    const isAmbiguousRefundSubmission =
      operation.kind === 'refund' &&
      operation.submittedAt &&
      failure.code === 'refund_submission_outcome_unknown';
    if (
      failure.terminal ||
      (operation.attemptCount >= MaxAttempts && !isAmbiguousRefundSubmission)
    ) {
      await this._finalizeFailedOperation(operation, {
        finalizedAt: now,
        errorCode: failure.code,
        errorSummary: failure.summary,
        source: failure.terminal ? 'providerRejected' : 'attemptsExhausted',
      });
      this._logProviderFailure(operation, failure, 'failed', error);
      return undefined;
    }
    const nextAttemptAt = new Date(
      Math.ceil((now.getTime() + retryDelayMilliseconds(operation.attemptCount)) / 1_000) * 1_000,
    );
    await this.scope.model.providerOperation.updateById(operation.id, {
      state: 'reconciliation_required',
      claimToken: undefined,
      claimExpiresAt: undefined,
      nextAttemptAt,
      errorCode: failure.code,
      errorSummary: failure.summary,
    });
    this._logProviderFailure(operation, failure, 'reconciliation_required', error);
    return {
      ...operation,
      state: 'reconciliation_required' as const,
      nextAttemptAt,
      errorCode: failure.code,
      errorSummary: failure.summary,
    };
  }

  async queueDue(limit = 100) {
    const now = new Date();
    const due = await this.scope.model.providerOperation.select({
      where: { state: ['created', 'reconciliation_required'], nextAttemptAt: { _lte_: now } },
      orders: [
        ['nextAttemptAt', 'asc'],
        ['id', 'asc'],
      ],
      limit,
    });
    const expiredClaims = await this.scope.model.providerOperation.select({
      where: { state: ['claimed', 'submitted'], claimExpiresAt: { _lte_: now } },
      orders: [
        ['claimExpiresAt', 'asc'],
        ['id', 'asc'],
      ],
      limit: Math.max(0, limit - due.length),
    });
    const operations = [...due, ...expiredClaims];
    for (const operation of operations) await this.execute(operation.id);
    return operations.length;
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  private async _prepareRefundRecovery(
    providerOperationId: TableIdentity,
    command: IRefundRecoveryCommand,
    action: 'reconcile' | 'retry',
  ) {
    const actionIdempotencyKey = command.actionIdempotencyKey.trim();
    const reason = command.reason.trim();
    if (!actionIdempotencyKey) this.app.throw(400, 'refund recovery idempotency key is required');
    if (!reason) this.app.throw(400, 'refund recovery reason is required');
    const operation =
      await this.scope.model.providerOperation.getByIdForUpdate(providerOperationId);
    if (!operation || operation.kind !== 'refund' || !operation.refundOperationId) {
      this.app.throw(404, 'refund provider operation not found');
    }
    const existing = await this.scope.model.providerOperationRecoveryAudit.getForUpdate({
      providerOperationId: operation.id,
      actionIdempotencyKey,
    });
    if (existing) {
      if (existing.action !== action || existing.reason !== reason) {
        this.app.throw(409, 'refund recovery idempotency key conflicts with an existing action');
      }
      return { auditId: existing.id, resolution: existing.resolution, replay: true };
    }
    const refund = await this.scope.model.refundOperation.getByIdForUpdate(
      operation.refundOperationId,
    );
    if (!refund) this.app.throw(404, 'refund operation not found');
    const now = new Date();
    let afterState = operation.state;
    let resolution: 'reconciled' | 'unresolved' | 'retried' = 'unresolved';
    if (action === 'retry') {
      if (!command.acknowledgeRetryRisk) {
        this.app.throw(409, 'refund retry requires explicit risk acknowledgement');
      }
      if (refund.providerRefundId) {
        this.app.throw(409, 'a known provider refund must be reconciled without resubmission');
      }
      if (
        !operation.submittedAt ||
        now.getTime() - operation.submittedAt.getTime() >
          PaypalRefundIdempotencyRetentionMilliseconds
      ) {
        this.app.throw(409, 'refund retry is outside the provider idempotency window');
      }
      if (
        operation.errorCode !== 'refund_submission_outcome_unknown' ||
        ['succeeded', 'claimed', 'submitted'].includes(operation.state)
      ) {
        this.app.throw(409, 'refund retry is not available');
      }
      const reconciliations = await this.scope.model.providerOperationRecoveryAudit.select({
        where: { providerOperationId: operation.id, action: 'reconcile', resolution: 'unresolved' },
        limit: 1,
      });
      if (!reconciliations.length) {
        this.app.throw(409, 'refund retry requires a preceding unresolved reconciliation');
      }
      const retries = await this.scope.model.providerOperationRecoveryAudit.select({
        where: { providerOperationId: operation.id, action: 'retry' },
        limit: 1,
      });
      if (retries.length) this.app.throw(409, 'refund retry has already been used');
      afterState = 'reconciliation_required';
      resolution = 'retried';
      await this.scope.model.providerOperation.updateById(operation.id, {
        state: afterState,
        claimToken: undefined,
        claimExpiresAt: undefined,
        nextAttemptAt: new Date(now.getTime() - 1_000),
        recoveryRetryGrantedAt: now,
      });
    } else if (refund.providerRefundId && operation.state !== 'succeeded') {
      afterState = 'reconciliation_required';
      resolution = 'reconciled';
      await this.scope.model.providerOperation.updateById(operation.id, {
        state: afterState,
        claimToken: undefined,
        claimExpiresAt: undefined,
        nextAttemptAt: new Date(now.getTime() - 1_000),
      });
    }
    const audit = await this.scope.model.providerOperationRecoveryAudit.insert({
      providerOperationId: operation.id,
      actorId: command.actorId,
      action,
      actionIdempotencyKey,
      reason,
      beforeState: operation.state,
      afterState,
      beforeAttemptCount: operation.attemptCount,
      afterAttemptCount: operation.attemptCount,
      resolution,
      providerRefundId: refund.providerRefundId,
      occurredAt: now,
    });
    return { auditId: audit.id, resolution };
  }

  @Core.transaction()
  private async _refundRecoveryResult(providerOperationId: TableIdentity, auditId: TableIdentity) {
    const operation =
      await this.scope.model.providerOperation.getByIdForUpdate(providerOperationId);
    const audit = await this.scope.model.providerOperationRecoveryAudit.getByIdForUpdate(auditId);
    if (!operation || !audit) this.app.throw(404, 'refund recovery audit not found');
    const refund = operation.refundOperationId
      ? await this.scope.model.refundOperation.getByIdForUpdate(operation.refundOperationId)
      : undefined;
    await this.scope.model.providerOperationRecoveryAudit.updateById(audit.id, {
      afterState: operation.state,
      afterAttemptCount: operation.attemptCount,
      providerRefundId: refund?.providerRefundId,
    });
    return {
      auditId: audit.id,
      resolution: audit.resolution,
      providerOperationState: operation.state,
      providerOperationAttemptCount: operation.attemptCount,
      providerRefundId: refund?.providerRefundId,
    };
  }

  private async _finalizeFailedOperation(
    operation: EntityProviderOperation,
    options: {
      finalizedAt: Date;
      errorCode?: string;
      errorSummary?: string;
      source: 'attemptsExhausted' | 'providerRejected';
    },
  ) {
    await this.scope.model.providerOperation.updateById(operation.id, {
      state: 'failed',
      claimToken: undefined,
      claimExpiresAt: undefined,
      nextAttemptAt: undefined,
      finalizedAt: options.finalizedAt,
      errorCode: options.errorCode,
      errorSummary: options.errorSummary,
    });
    if (operation.kind === 'refund') return;

    const session = await this.scope.model.paymentSession.getByIdForUpdate(
      operation.paymentSessionId,
    );
    if (!session || ['succeeded', 'failed', 'cancelled', 'expired'].includes(session.state)) return;
    await this.scope.model.paymentSession.updateById(session.id, {
      state: 'failed',
      nextAction: undefined,
      finalizedAt: options.finalizedAt,
    });
    await this.scope.model.paymentAudit.insert({
      paymentSessionId: session.id,
      providerOperationId: operation.id,
      fromState: session.state,
      toState: 'failed',
      correlationId: session.correlationId,
      source: `providerOperation.${operation.kind}.${options.source}`,
      occurredAt: options.finalizedAt,
    });
    await this.scope.service.outbox.enqueue(session.id, 'payment.outcome.v1', {
      eventId: `${operation.correlationId}:${operation.kind}:${options.source}`,
      paymentSessionId: session.id,
      businessReference: session.businessReference,
      providerName: session.providerName,
      state: 'failed',
      providerCaptureId: session.providerCaptureId,
      amountMinor: session.amountMinor,
      currency: session.currency,
    });
  }

  private _logProviderFailure(
    operation: EntityProviderOperation,
    failure: { code: string; summary: string },
    state: 'failed' | 'reconciliation_required',
    error: unknown,
  ) {
    this.$logger.warn(failure.summary, {
      event: 'pay.provider_operation_failed',
      providerOperationId: operation.id,
      paymentSessionId: operation.paymentSessionId,
      refundOperationId: operation.refundOperationId,
      kind: operation.kind,
      attemptCount: operation.attemptCount,
      state,
      errorCode: failure.code,
      errorSummary: failure.summary,
      ...providerErrorLogFields(error),
    });
  }

  private async _insertOperation(
    session: EntityPaymentSession,
    kind: Exclude<TypeProviderOperationKind, 'refund'>,
    now: Date,
    callbackUrls?: { returnUrl: string; cancelUrl: string },
  ) {
    const idempotencyKey = randomUUID();
    const startInputSnapshot =
      kind === 'start'
        ? this._createStartInputSnapshot(session, idempotencyKey, callbackUrls)
        : undefined;
    return await this.scope.model.providerOperation.insert({
      paymentSessionId: session.id,
      kind,
      state: 'created',
      idempotencyKey,
      correlationId: session.correlationId,
      startInputSnapshot,
      attemptCount: 0,
      nextAttemptAt: new Date(now.getTime() - 1_000),
    });
  }

  private _createStartInputSnapshot(
    session: EntityPaymentSession,
    idempotencyKey: string,
    callbackUrls?: { returnUrl: string; cancelUrl: string },
  ): IPayProviderOperationStartInputSnapshot {
    return {
      version: 1,
      paymentSessionId: session.id,
      businessReference: session.businessReference,
      providerInvoiceReference: session.providerInvoiceReference,
      providerCorrelationReference: session.providerCorrelationReference,
      idempotencyKey,
      amountMinor: session.amountMinor,
      currency: session.currency,
      ...callbackUrls,
    };
  }

  private async _getSession(paymentSessionId: TableIdentity) {
    const session = await this.scope.model.paymentSession.getById(paymentSessionId);
    if (!session) this.app.throw(404, 'payment session not found');
    return session;
  }

  private async _scheduleReconciliation(
    operation: EntityProviderOperation,
    providerResourceId?: string,
  ) {
    await this.scope.model.providerOperation.updateById(operation.id, {
      state: 'reconciliation_required',
      providerResourceId,
      claimToken: undefined,
      claimExpiresAt: undefined,
      nextAttemptAt: new Date(Date.now() + 5_000),
      errorCode: undefined,
      errorSummary: undefined,
    });
  }

  private async _complete(
    operation: EntityProviderOperation,
    options: { providerResourceId?: string },
  ) {
    await this.scope.model.providerOperation.updateById(operation.id, {
      state: 'succeeded',
      providerResourceId: options.providerResourceId,
      claimToken: undefined,
      claimExpiresAt: undefined,
      nextAttemptAt: undefined,
      finalizedAt: new Date(),
      errorCode: undefined,
      errorSummary: undefined,
    });
  }
}

function providerErrorLogFields(error: unknown) {
  const value = error as Record<string, unknown> | undefined;
  const message = error instanceof Error ? redactProviderErrorMessage(error.message) : undefined;
  return {
    ...(message && { providerErrorMessage: message }),
    ...(typeof value?.type === 'string' && { providerErrorType: value.type.slice(0, 100) }),
    ...(typeof value?.code === 'string' && { providerErrorCode: value.code.slice(0, 100) }),
    ...(typeof value?.requestId === 'string' && {
      providerRequestId: value.requestId.slice(0, 100),
    }),
  };
}

function redactProviderErrorMessage(message: string) {
  return message
    .slice(0, 500)
    .replace(/\b(?:sk_(?:test|live)_\w+|whsec_\w+)\b/g, '<redacted>')
    .replace(/\b(Bearer\s+)\S+/gi, '$1<redacted>')
    .replace(
      /([?&](?:state|client_secret|api_key|key|token|authorization)=)[^&\s]+/gi,
      '$1<redacted>',
    );
}

function isTerminalPaymentState(
  state: IPayProviderPaymentSnapshot['state'],
): state is 'succeeded' | 'failed' | 'cancelled' {
  return ['succeeded', 'failed', 'cancelled'].includes(state);
}

function retryDelayMilliseconds(attemptCount: number) {
  return Math.min(60_000, 1_000 * 2 ** Math.max(0, attemptCount - 1));
}

function classifyProviderFailure(
  error: unknown,
  kind: TypeProviderOperationKind,
): { code: string; summary: string; terminal: boolean } {
  if (kind === 'refund') {
    return {
      code: 'refund_submission_outcome_unknown',
      summary: 'Provider refund submission outcome is unknown',
      terminal: false,
    };
  }
  if (error instanceof ProviderOperationFailure) {
    return { code: error.failureCode, summary: error.summary, terminal: true };
  }
  return {
    code: 'provider_operation_failed',
    summary: 'Provider operation failed and will be reconciled',
    terminal: false,
  };
}
