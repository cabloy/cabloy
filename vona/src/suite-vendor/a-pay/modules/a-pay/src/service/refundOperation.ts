import type { TableIdentity } from 'table-identity';

import { randomUUID } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { EntityRefundOperation } from '../entity/refundOperation.tsx';
import type { IPayProviderRefundSnapshot } from '../types/payment.ts';

export interface IRefundOperationCreateCommand {
  paymentSessionId: TableIdentity;
  businessReference: string;
  amountMinor: number;
  currency: string;
  idempotencyKey: string;
  correlationId: string;
}

@Service()
export class ServiceRefundOperation extends BeanBase {
  @Core.transaction()
  async create(command: IRefundOperationCreateCommand): Promise<EntityRefundOperation> {
    if (!Number.isSafeInteger(command.amountMinor) || command.amountMinor <= 0) {
      this.app.throw(409, 'refund amount is invalid');
    }
    const session = await this.scope.model.paymentSession.getByIdForUpdate(
      command.paymentSessionId,
    );
    if (!session) this.app.throw(404, 'payment session not found');
    const isLateCaptureCompensation = command.businessReference.startsWith('late-capture:');
    if (
      (session.state !== 'succeeded' &&
        !(session.state === 'expired' && isLateCaptureCompensation)) ||
      !session.providerCaptureId
    ) {
      this.app.throw(409, 'payment session is not refundable');
    }
    if (session.currency !== command.currency) this.app.throw(409, 'refund currency conflicts');
    const scene = this.bean.payScene.getOptions(session.payScene as never);
    if (!scene.refund?.enabled) this.app.throw(409, 'payment scene refunds are disabled');
    if (isLateCaptureCompensation && command.amountMinor !== session.amountMinor) {
      this.app.throw(409, 'late capture compensation must refund the full captured amount');
    }
    if (!scene.refund.allowPartial && command.amountMinor !== session.amountMinor) {
      this.app.throw(409, 'payment scene does not allow partial refunds');
    }

    const existing = await this.scope.model.refundOperation.getForUpdate({
      paymentSessionId: session.id,
      idempotencyKey: command.idempotencyKey,
    });
    if (existing) {
      if (
        existing.amountMinor !== command.amountMinor ||
        existing.currency !== command.currency ||
        existing.businessReference !== command.businessReference
      ) {
        this.app.throw(409, 'refund idempotency key conflicts with an existing operation');
      }
      return existing;
    }
    const operations = await this.scope.model.refundOperation.select({
      where: { paymentSessionId: session.id },
    });
    const committedAmount = operations
      .filter(item => ['created', 'submitting', 'pending', 'succeeded'].includes(item.state))
      .reduce((total, item) => total + item.amountMinor, 0);
    if (committedAmount + command.amountMinor > session.amountMinor) {
      this.app.throw(409, 'refund amount exceeds the remaining captured amount');
    }
    const refund = await this.scope.model.refundOperation.insert({
      paymentSessionId: session.id,
      businessReference: command.businessReference,
      providerInvoiceReference: randomUUID(),
      providerCorrelationReference: randomUUID(),
      amountMinor: command.amountMinor,
      currency: command.currency,
      state: 'created',
      idempotencyKey: command.idempotencyKey,
    });
    await this.scope.model.providerOperation.insert({
      paymentSessionId: session.id,
      refundOperationId: refund.id,
      kind: 'refund',
      state: 'created',
      idempotencyKey: randomUUID(),
      correlationId: command.correlationId,
      attemptCount: 0,
      nextAttemptAt: new Date(Date.now() - 1_000),
    });
    return refund;
  }

  async submit(refundOperationId: TableIdentity) {
    const operation = await this.scope.model.providerOperation.get({
      refundOperationId,
      kind: 'refund',
    });
    if (!operation) this.app.throw(404, 'refund provider operation not found');
    await this.scope.service.providerOperation.execute(operation.id);
    return await this.scope.model.refundOperation.getById(refundOperationId);
  }

  @Core.transaction()
  async settleProviderSnapshot(
    providerOperationId: TableIdentity,
    claimToken: string,
    snapshot: IPayProviderRefundSnapshot,
  ) {
    const providerOperation =
      await this.scope.model.providerOperation.getByIdForUpdate(providerOperationId);
    if (
      !providerOperation ||
      providerOperation.kind !== 'refund' ||
      !['claimed', 'submitted'].includes(providerOperation.state) ||
      providerOperation.claimToken !== claimToken ||
      !providerOperation.refundOperationId
    ) {
      return undefined;
    }
    const refund = await this.scope.model.refundOperation.getByIdForUpdate(
      providerOperation.refundOperationId,
    );
    if (!refund) this.app.throw(404, 'refund operation not found');
    const session = await this.scope.model.paymentSession.getByIdForUpdate(refund.paymentSessionId);
    if (!session) this.app.throw(404, 'payment session not found');
    if (
      refund.providerRefundId &&
      snapshot.providerRefundId &&
      refund.providerRefundId !== snapshot.providerRefundId
    ) {
      this.app.throw(409, 'provider refund identifier conflicts with the refund operation');
    }
    if (['succeeded', 'failed', 'cancelled'].includes(refund.state)) {
      await this._completeProviderOperation(providerOperation, snapshot.providerRefundId);
      return refund;
    }
    const finalizedAt = isTerminalRefundState(snapshot.state) ? new Date() : undefined;
    await this.scope.model.refundOperation.updateById(refund.id, {
      state: snapshot.state,
      providerRefundId: snapshot.providerRefundId,
      finalizedAt,
    });
    if (finalizedAt) {
      await this.scope.service.outbox.enqueue(session.id, 'refund.outcome.v1', {
        eventId: `${providerOperation.correlationId}:refund`,
        paymentSessionId: session.id,
        refundOperationId: refund.id,
        businessReference: refund.businessReference,
        providerName: session.providerName,
        state: snapshot.state as 'succeeded' | 'failed' | 'cancelled',
        providerRefundId: snapshot.providerRefundId,
        amountMinor: refund.amountMinor,
        currency: refund.currency,
      });
      await this._completeProviderOperation(providerOperation, snapshot.providerRefundId);
    } else {
      await this._scheduleReconciliation(providerOperation, snapshot.providerRefundId);
    }
    return { ...refund, ...snapshot, finalizedAt };
  }

  @Core.transaction()
  async transitionFromWebhook(
    refundOperationId: TableIdentity,
    options: {
      eventId: string;
      state: IPayProviderRefundSnapshot['state'];
      providerRefundId?: string;
    },
  ) {
    const refund = await this.scope.model.refundOperation.getByIdForUpdate(refundOperationId);
    if (!refund) this.app.throw(404, 'refund operation not found');
    const session = await this.scope.model.paymentSession.getByIdForUpdate(refund.paymentSessionId);
    if (!session) this.app.throw(404, 'payment session not found');
    if (
      refund.providerRefundId &&
      options.providerRefundId &&
      refund.providerRefundId !== options.providerRefundId
    ) {
      this.app.throw(409, 'provider refund identifier conflicts with the refund operation');
    }
    if (refund.state === options.state) return { refund, changed: false };
    if (['succeeded', 'failed', 'cancelled'].includes(refund.state)) {
      return { refund, changed: false, ignoredReason: 'refund operation is already finalized' };
    }
    const finalizedAt = isTerminalRefundState(options.state) ? new Date() : undefined;
    await this.scope.model.refundOperation.updateById(refund.id, {
      state: options.state as 'succeeded' | 'failed' | 'cancelled',
      providerRefundId: options.providerRefundId,
      finalizedAt,
    });
    if (finalizedAt) {
      await this.scope.service.outbox.enqueue(session.id, 'refund.outcome.v1', {
        eventId: options.eventId,
        paymentSessionId: session.id,
        refundOperationId: refund.id,
        businessReference: refund.businessReference,
        providerName: session.providerName,
        state: options.state as 'succeeded' | 'failed' | 'cancelled',
        providerRefundId: options.providerRefundId,
        amountMinor: refund.amountMinor,
        currency: refund.currency,
      });
    }
    return {
      refund: {
        ...refund,
        state: options.state,
        providerRefundId: options.providerRefundId,
        finalizedAt,
      },
      changed: true,
    };
  }

  private async _scheduleReconciliation(
    providerOperation: { id: TableIdentity },
    providerResourceId?: string,
  ) {
    await this.scope.model.providerOperation.updateById(providerOperation.id, {
      state: 'reconciliation_required',
      providerResourceId,
      claimToken: undefined,
      claimExpiresAt: undefined,
      nextAttemptAt: new Date(Date.now() + 5_000),
      errorCode: undefined,
      errorSummary: undefined,
    });
  }

  private async _completeProviderOperation(
    providerOperation: { id: TableIdentity },
    providerResourceId?: string,
  ) {
    await this.scope.model.providerOperation.updateById(providerOperation.id, {
      state: 'succeeded',
      providerResourceId,
      claimToken: undefined,
      claimExpiresAt: undefined,
      nextAttemptAt: undefined,
      finalizedAt: new Date(),
      errorCode: undefined,
      errorSummary: undefined,
    });
  }
}

function isTerminalRefundState(
  state: IPayProviderRefundSnapshot['state'],
): state is 'succeeded' | 'failed' | 'cancelled' {
  return ['succeeded', 'failed', 'cancelled'].includes(state);
}
