import type { TableIdentity } from 'table-identity';

import { randomUUID } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { EntityPaymentSession } from '../entity/paymentSession.tsx';
import type { EntityProviderOperation } from '../entity/providerOperation.tsx';
import type { IPayProviderPaymentSnapshot } from '../types/payment.ts';

const ClaimLeaseMilliseconds = 60_000;
const MaxAttempts = 10;

@Service()
export class ServiceProviderOperation extends BeanBase {
  async start(paymentSessionId: TableIdentity): Promise<EntityPaymentSession> {
    const operation = await this.ensureStart(paymentSessionId);
    await this.execute(operation.id);
    const session = await this.scope.model.paymentSession.getById(paymentSessionId);
    if (!session) this.app.throw(404, 'payment session not found');
    return session;
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
    await this.scope.model.paymentSession.updateById(session.id, { state: 'starting' });
    await this.scope.model.paymentAudit.insert({
      paymentSessionId: session.id,
      fromState: session.state,
      toState: 'starting',
      correlationId: session.correlationId,
      source: 'providerOperation.start',
      occurredAt: now,
    });
    return await this.scope.model.providerOperation.insert({
      paymentSessionId: session.id,
      kind: 'start',
      state: 'created',
      idempotencyKey: `${session.correlationId}:start`,
      correlationId: session.correlationId,
      attemptCount: 0,
      nextAttemptAt: new Date(now.getTime() - 1_000),
    });
  }

  async execute(providerOperationId: TableIdentity) {
    const operation = await this.claim(providerOperationId);
    if (!operation) return undefined;
    try {
      const session = await this.scope.model.paymentSession.getById(operation.paymentSessionId);
      if (!session) this.app.throw(404, 'payment session not found');
      const { provider, clientOptions } = this.bean.payProvider.resolveByName(
        session.providerName,
        session.clientName,
      );
      if (clientOptions.environment !== session.environment) {
        this.app.throw(500, 'payment session provider environment is inconsistent');
      }
      const isReconciliation =
        operation.state === 'reconciliation_required' ||
        operation.state === 'claimed' ||
        operation.state === 'submitted';
      await this.markSubmitted(operation.id, operation.claimToken!);
      if (operation.kind === 'refund') {
        const refundOperationId = operation.refundOperationId;
        if (!refundOperationId) this.app.throw(500, 'refund provider operation is not linked');
        const refund = await this.scope.model.refundOperation.getById(refundOperationId);
        if (!refund) this.app.throw(404, 'refund operation not found');
        if (!session.providerCaptureId)
          this.app.throw(409, 'payment session has no provider capture');
        const input = {
          paymentSessionId: session.id,
          refundOperationId: refund.id,
          businessReference: refund.businessReference,
          idempotencyKey: operation.idempotencyKey,
          amountMinor: refund.amountMinor,
          currency: refund.currency,
          providerCaptureId: session.providerCaptureId,
        };
        const snapshot =
          isReconciliation && provider.queryRefund
            ? await provider.queryRefund(input, clientOptions)
            : await provider.createRefund(input, clientOptions);
        await this.scope.service.refundOperation.settleProviderSnapshot(
          operation.id,
          operation.claimToken!,
          snapshot,
        );
        return snapshot;
      }
      const input = {
        paymentSessionId: session.id,
        businessReference: session.businessReference,
        idempotencyKey: operation.idempotencyKey,
        amountMinor: session.amountMinor,
        currency: session.currency,
        providerOrderId: session.providerOrderId,
      };
      const snapshot =
        operation.state === 'reconciliation_required'
          ? await provider.queryPayment(input, clientOptions)
          : await provider.startPayment(input, clientOptions);
      await this.settlePaymentSnapshot(operation.id, operation.claimToken!, snapshot);
      return snapshot;
    } catch (error) {
      await this.releaseForReconciliation(operation.id, operation.claimToken!, error);
      return undefined;
    }
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
    if (operation.attemptCount >= MaxAttempts) {
      await this.scope.model.providerOperation.updateById(operation.id, {
        state: 'failed',
        finalizedAt: now,
        errorSummary: 'provider operation attempts exhausted',
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
      errorCode: undefined,
      errorSummary: undefined,
    });
    return {
      ...operation,
      state: operation.state,
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
      submittedAt,
    });
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

    if (isTerminalPaymentState(snapshot.state)) {
      const finalizedAt = new Date();
      await this.scope.model.paymentSession.updateById(session.id, {
        state: snapshot.state,
        nextAction: snapshot.nextAction,
        providerPaymentId: snapshot.providerPaymentId,
        providerOrderId: snapshot.providerOrderId,
        providerCaptureId: snapshot.providerCaptureId,
        finalizedAt,
      });
      await this.scope.model.paymentAudit.insert({
        paymentSessionId: session.id,
        providerOperationId: operation.id,
        fromState: session.state,
        toState: snapshot.state,
        correlationId: session.correlationId,
        source: 'providerOperation',
        occurredAt: finalizedAt,
      });
      await this.scope.service.outbox.enqueue(session.id, 'payment.outcome.v1', {
        eventId: `${operation.correlationId}:${operation.kind}`,
        paymentSessionId: session.id,
        businessReference: session.businessReference,
        providerName: session.providerName,
        state: snapshot.state,
        providerCaptureId: snapshot.providerCaptureId,
        amountMinor: session.amountMinor,
        currency: session.currency,
      });
    } else {
      await this.scope.model.paymentSession.updateById(session.id, {
        state: snapshot.state,
        nextAction: snapshot.nextAction,
        providerPaymentId: snapshot.providerPaymentId,
        providerOrderId: snapshot.providerOrderId,
        providerCaptureId: snapshot.providerCaptureId,
      });
      await this.scope.model.paymentAudit.insert({
        paymentSessionId: session.id,
        providerOperationId: operation.id,
        fromState: session.state,
        toState: snapshot.state,
        correlationId: session.correlationId,
        source: 'providerOperation',
        occurredAt: new Date(),
      });
    }
    await this._complete(operation, {
      providerResourceId: snapshot.providerCaptureId ?? snapshot.providerOrderId,
    });
    return { ...session, ...snapshot };
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
    const errorSummary = summarizeError(error);
    const now = new Date();
    if (operation.attemptCount >= MaxAttempts) {
      await this.scope.model.providerOperation.updateById(operation.id, {
        state: 'failed',
        claimToken: undefined,
        claimExpiresAt: undefined,
        finalizedAt: now,
        errorSummary,
      });
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
      errorSummary,
    });
    return { ...operation, state: 'reconciliation_required' as const, nextAttemptAt, errorSummary };
  }

  async queueDue(limit = 100) {
    const now = new Date();
    const due = await this.scope.model.providerOperation.select({
      where: {
        state: ['created', 'reconciliation_required'],
        nextAttemptAt: { _lte_: now },
      },
      orders: [
        ['nextAttemptAt', 'asc'],
        ['id', 'asc'],
      ],
      limit,
    });
    const expiredClaims = await this.scope.model.providerOperation.select({
      where: {
        state: ['claimed', 'submitted'],
        claimExpiresAt: { _lte_: now },
      },
      orders: [
        ['claimExpiresAt', 'asc'],
        ['id', 'asc'],
      ],
      limit: Math.max(0, limit - due.length),
    });
    const operations = [...due, ...expiredClaims];
    for (const operation of operations) {
      await this.execute(operation.id);
    }
    return operations.length;
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

function isTerminalPaymentState(
  state: IPayProviderPaymentSnapshot['state'],
): state is 'succeeded' | 'failed' | 'cancelled' {
  return ['succeeded', 'failed', 'cancelled'].includes(state);
}

function retryDelayMilliseconds(attemptCount: number) {
  return Math.min(60_000, 1_000 * 2 ** Math.max(0, attemptCount - 1));
}

function summarizeError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.slice(0, 255);
}
