import { createHash } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type {
  IPayProviderVerifiedWebhook,
  TypePaymentSessionState,
  TypeRefundOperationState,
} from '../types/payment.ts';

export interface IWebhookReceiveCommand {
  providerName: string;
  clientName: string;
  environment: 'sandbox' | 'live';
  rawBody?: string;
  verified: IPayProviderVerifiedWebhook;
}

@Service()
export class ServiceWebhook extends BeanBase {
  async receive(command: IWebhookReceiveCommand) {
    return await this.scope.redlock.lock(
      `pay.webhook.${command.providerName}.${command.clientName}.${command.environment}.${command.verified.eventId}`,
      async () => await this.receiveLocked(command),
    );
  }

  @Core.transaction()
  async receiveLocked(command: IWebhookReceiveCommand) {
    const payment = command.verified.payment;
    const refund = command.verified.refund;
    if (!!payment === !!refund)
      this.app.throw(400, 'webhook must contain exactly one payment or refund');
    const amountMinor = command.verified.summary?.amountMinor;
    const currency = command.verified.summary?.currency;
    if (
      typeof amountMinor !== 'number' ||
      !Number.isInteger(amountMinor) ||
      amountMinor < 0 ||
      typeof currency !== 'string' ||
      currency.length !== 3
    ) {
      this.app.throw(400, 'payment webhook amount is incomplete');
    }
    if (payment) {
      return await this._receivePayment(command, payment, amountMinor, currency);
    }
    return await this._receiveRefund(command, refund!, amountMinor, currency);
  }

  private async _receivePayment(
    command: IWebhookReceiveCommand,
    payment: NonNullable<IPayProviderVerifiedWebhook['payment']>,
    amountMinor: number,
    currency: string,
  ) {
    const paymentSessionId = command.verified.paymentSessionId;
    const paymentState = payment.state as Extract<
      TypePaymentSessionState,
      'succeeded' | 'failed' | 'cancelled'
    >;
    if (
      !paymentSessionId ||
      !['succeeded', 'failed', 'cancelled'].includes(paymentState) ||
      command.verified.refundOperationId
    ) {
      this.app.throw(400, 'payment webhook is incomplete');
    }
    const session = await this.scope.model.paymentSession.getByIdForUpdate(paymentSessionId);
    if (!session) this.app.throw(404, 'payment session not found');
    this._assertSessionMatches(command, session, currency);
    const existing = await this._getExistingInbox(command);
    if (existing) return existing;
    const inbox = await this.scope.model.webhookInbox.insert({
      providerName: command.providerName,
      clientName: command.clientName,
      environment: command.environment,
      providerEventId: command.verified.eventId,
      eventType: command.verified.eventType,
      paymentSessionId: session.id,
      paymentState,
      amountMinor,
      currency,
      providerCaptureId: payment.providerCaptureId,
      payloadHash: this._payloadHash(command),
      state: 'received',
      retryCount: 0,
    });
    const transition = await this.scope.service.paymentSession.transitionFromWebhook(session.id, {
      state: paymentState,
      providerPaymentId: payment.providerPaymentId,
      providerCaptureId: payment.providerCaptureId,
      webhookInboxId: inbox.id,
    });
    if (transition.changed) {
      await this.scope.service.outbox.enqueue(session.id, 'payment.outcome.v1', {
        eventId: command.verified.eventId,
        paymentSessionId: session.id,
        businessReference: session.businessReference,
        providerName: session.providerName,
        state: paymentState,
        providerCaptureId: payment.providerCaptureId,
        amountMinor,
        currency,
      });
    }
    return await this._markProcessed(inbox.id, transition.ignoredReason);
  }

  private async _receiveRefund(
    command: IWebhookReceiveCommand,
    refund: NonNullable<IPayProviderVerifiedWebhook['refund']>,
    amountMinor: number,
    currency: string,
  ) {
    const refundOperationId = command.verified.refundOperationId;
    if (!refundOperationId || command.verified.paymentSessionId) {
      this.app.throw(400, 'refund webhook is incomplete');
    }
    const refundOperation =
      await this.scope.model.refundOperation.getByIdForUpdate(refundOperationId);
    if (!refundOperation) this.app.throw(404, 'refund operation not found');
    const session = await this.scope.model.paymentSession.getByIdForUpdate(
      refundOperation.paymentSessionId,
    );
    if (!session) this.app.throw(404, 'payment session not found');
    this._assertSessionMatches(command, session, currency, false);
    if (refundOperation.amountMinor !== amountMinor || refundOperation.currency !== currency) {
      this.app.throw(409, 'refund webhook conflicts with the refund operation');
    }
    if (
      refundOperation.providerRefundId &&
      refund.providerRefundId &&
      refundOperation.providerRefundId !== refund.providerRefundId
    ) {
      this.app.throw(409, 'refund webhook provider identifier conflicts with the refund operation');
    }
    const existing = await this._getExistingInbox(command);
    if (existing) return existing;
    const inbox = await this.scope.model.webhookInbox.insert({
      providerName: command.providerName,
      clientName: command.clientName,
      environment: command.environment,
      providerEventId: command.verified.eventId,
      eventType: command.verified.eventType,
      paymentSessionId: session.id,
      refundOperationId: refundOperation.id,
      refundState: refund.state,
      amountMinor,
      currency,
      providerCaptureId: session.providerCaptureId,
      providerRefundId: refund.providerRefundId,
      payloadHash: this._payloadHash(command),
      state: 'received',
      retryCount: 0,
    });
    const transition = await this.scope.service.refundOperation.transitionFromWebhook(
      refundOperation.id,
      {
        eventId: command.verified.eventId,
        state: refund.state as Extract<
          TypeRefundOperationState,
          'pending' | 'succeeded' | 'failed' | 'cancelled'
        >,
        providerRefundId: refund.providerRefundId,
      },
    );
    return await this._markProcessed(inbox.id, transition.ignoredReason);
  }

  private _assertSessionMatches(
    command: IWebhookReceiveCommand,
    session: {
      providerName: string;
      clientName: string;
      environment: string;
      amountMinor: number;
      currency: string;
    },
    currency: string,
    assertAmount = true,
  ) {
    if (
      session.providerName !== command.providerName ||
      session.clientName !== command.clientName ||
      session.environment !== command.environment ||
      (assertAmount && session.amountMinor !== command.verified.summary?.amountMinor) ||
      session.currency !== currency
    ) {
      this.app.throw(409, 'payment webhook conflicts with the payment session');
    }
  }

  private async _getExistingInbox(command: IWebhookReceiveCommand) {
    const existing = await this.scope.model.webhookInbox.getForUpdate({
      providerName: command.providerName,
      clientName: command.clientName,
      environment: command.environment,
      providerEventId: command.verified.eventId,
    });
    if (existing && existing.payloadHash !== this._payloadHash(command)) {
      this.app.throw(409, 'payment webhook event conflicts with a prior payload');
    }
    return existing;
  }

  private _payloadHash(command: IWebhookReceiveCommand) {
    return createHash('sha256')
      .update(command.rawBody ?? JSON.stringify(command.verified))
      .digest('hex');
  }

  private async _markProcessed(inboxId: string | number, errorSummary?: string) {
    const processedAt = new Date();
    await this.scope.model.webhookInbox.updateById(inboxId, {
      state: 'processed',
      processedAt,
      errorSummary,
    });
    const inbox = await this.scope.model.webhookInbox.getById(inboxId);
    if (!inbox) this.app.throw(500, 'persisted webhook inbox not found');
    return inbox;
  }
}
