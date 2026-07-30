import { createHash } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type {
  IPayProviderVerifiedWebhook,
  IPaymentOutcomeEvent,
  TypePaymentSessionState,
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
    const paymentSessionId = command.verified.paymentSessionId;
    const amountMinor = command.verified.summary?.amountMinor;
    const currency = command.verified.summary?.currency;
    const paymentState = payment?.state as
      | Extract<TypePaymentSessionState, 'succeeded' | 'failed' | 'cancelled'>
      | undefined;
    if (
      !payment ||
      !paymentSessionId ||
      !['succeeded', 'failed', 'cancelled'].includes(paymentState ?? '') ||
      typeof amountMinor !== 'number' ||
      !Number.isInteger(amountMinor) ||
      amountMinor < 0 ||
      typeof currency !== 'string' ||
      currency.length !== 3
    ) {
      this.app.throw(400, 'payment webhook is incomplete');
    }

    const session = await this.scope.model.paymentSession.getByIdForUpdate(paymentSessionId);
    if (!session) this.app.throw(404, 'payment session not found');
    if (
      session.providerName !== command.providerName ||
      session.clientName !== command.clientName ||
      session.environment !== command.environment ||
      session.amountMinor !== amountMinor ||
      session.currency !== currency
    ) {
      this.app.throw(409, 'payment webhook conflicts with the payment session');
    }

    const payloadHash = createHash('sha256')
      .update(command.rawBody ?? JSON.stringify(command.verified))
      .digest('hex');
    const existing = await this.scope.model.webhookInbox.getForUpdate({
      providerName: command.providerName,
      clientName: command.clientName,
      environment: command.environment,
      providerEventId: command.verified.eventId,
    });
    if (existing) {
      if (existing.payloadHash !== payloadHash) {
        this.app.throw(409, 'payment webhook event conflicts with a prior payload');
      }
      return existing;
    }

    const inbox = await this.scope.model.webhookInbox.insert({
      providerName: command.providerName,
      clientName: command.clientName,
      environment: command.environment,
      providerEventId: command.verified.eventId,
      eventType: command.verified.eventType,
      paymentSessionId: session.id,
      paymentState: paymentState!,
      amountMinor,
      currency,
      providerCaptureId: payment.providerCaptureId,
      payloadHash,
      state: 'received',
      retryCount: 0,
    });

    const transition = await this.scope.service.paymentSession.transitionFromWebhook(session.id, {
      state: paymentState!,
      providerPaymentId: payment.providerPaymentId,
      providerCaptureId: payment.providerCaptureId,
      webhookInboxId: inbox.id,
    });
    if (transition.changed) {
      const event: IPaymentOutcomeEvent = {
        eventId: command.verified.eventId,
        paymentSessionId: session.id,
        businessReference: session.businessReference,
        providerName: session.providerName,
        state: paymentState!,
        providerCaptureId: payment.providerCaptureId,
        amountMinor,
        currency,
      };
      await this.scope.service.outbox.enqueue(session.id, 'payment.outcome.v1', { ...event });
    }
    await this.scope.model.webhookInbox.updateById(inbox.id, {
      state: 'processed',
      processedAt: new Date(),
    });
    return { ...inbox, state: 'processed' as const, processedAt: new Date() };
  }
}
