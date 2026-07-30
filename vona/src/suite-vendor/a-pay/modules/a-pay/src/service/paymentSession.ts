import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { EntityPaymentSession } from '../entity/paymentSession.tsx';
import type { TypePaymentNextAction, TypePaymentSessionState } from '../types/payment.ts';

export interface IPaymentSessionCreateCommand {
  userId: TableIdentity;
  payScene: string;
  businessReference: string;
  providerName: string;
  clientName: string;
  environment: 'sandbox' | 'live';
  amountMinor: number;
  currency: string;
  correlationId: string;
  expiresAt: Date;
}

@Service()
export class ServicePaymentSession extends BeanBase {
  async create(command: IPaymentSessionCreateCommand): Promise<EntityPaymentSession> {
    return await this.scope.model.paymentSession.insert({
      ...command,
      state: 'created',
    });
  }

  async start(paymentSessionId: TableIdentity): Promise<EntityPaymentSession> {
    const session = await this.transition(paymentSessionId, 'starting', {
      source: 'paymentSession.start',
    });
    const provider = this.bean.payProvider.get(session.providerName as never);
    const snapshot = await provider.startPayment({
      paymentSessionId: session.id,
      businessReference: session.businessReference,
      idempotencyKey: `${session.correlationId}:start`,
      amountMinor: session.amountMinor,
      currency: session.currency,
      providerOrderId: session.providerOrderId,
    });
    return await this.transition(session.id, snapshot.state, {
      nextAction: snapshot.nextAction,
      providerPaymentId: snapshot.providerPaymentId,
      providerOrderId: snapshot.providerOrderId,
      providerCaptureId: snapshot.providerCaptureId,
      source: 'paymentSession.startProvider',
    });
  }

  @Core.transaction()
  async transitionFromWebhook(
    paymentSessionId: TableIdentity,
    options: {
      state: Extract<TypePaymentSessionState, 'succeeded' | 'failed' | 'cancelled'>;
      providerPaymentId?: string;
      providerCaptureId?: string;
      webhookInboxId: TableIdentity;
    },
  ): Promise<{ session: EntityPaymentSession; changed: boolean }> {
    const session = await this.scope.model.paymentSession.getByIdForUpdate(paymentSessionId);
    if (!session) this.app.throw(404, 'payment session not found');
    if (session.state === options.state) return { session, changed: false };
    if (session.expiresAt <= new Date()) {
      this.app.throw(409, 'payment session is expired');
    }
    if (['succeeded', 'failed', 'cancelled', 'expired'].includes(session.state)) {
      this.app.throw(409, 'payment session terminal state conflicts with the webhook');
    }
    const finalizedAt = new Date();
    await this.scope.model.paymentSession.updateById(session.id, {
      state: options.state,
      providerPaymentId: options.providerPaymentId,
      providerCaptureId: options.providerCaptureId,
      finalizedAt,
    });
    await this.scope.model.paymentAudit.insert({
      paymentSessionId: session.id,
      webhookInboxId: options.webhookInboxId,
      fromState: session.state,
      toState: options.state,
      correlationId: session.correlationId,
      source: 'webhook',
      occurredAt: finalizedAt,
    });
    return {
      session: { ...session, ...options, state: options.state, finalizedAt },
      changed: true,
    };
  }

  @Core.transaction()
  async transition(
    paymentSessionId: TableIdentity,
    state: TypePaymentSessionState,
    options?: {
      nextAction?: TypePaymentNextAction;
      providerPaymentId?: string;
      providerOrderId?: string;
      providerCaptureId?: string;
      source?: string;
    },
  ): Promise<EntityPaymentSession> {
    const session = await this.scope.model.paymentSession.getByIdForUpdate(paymentSessionId);
    if (!session) this.app.throw(404, 'payment session not found');
    if (session.state === state) return session;
    if (['succeeded', 'failed', 'cancelled', 'expired'].includes(session.state)) {
      this.app.throw(409, 'payment session is already finalized');
    }
    const finalizedAt = ['succeeded', 'failed', 'cancelled', 'expired'].includes(state)
      ? new Date()
      : undefined;
    await this.scope.model.paymentSession.updateById(session.id, {
      state,
      nextAction: options?.nextAction,
      providerPaymentId: options?.providerPaymentId,
      providerOrderId: options?.providerOrderId,
      providerCaptureId: options?.providerCaptureId,
      finalizedAt,
    });
    await this.scope.model.paymentAudit.insert({
      paymentSessionId: session.id,
      fromState: session.state,
      toState: state,
      correlationId: session.correlationId,
      source: options?.source ?? 'paymentSession',
      occurredAt: new Date(),
    });
    return { ...session, ...options, state, finalizedAt };
  }
}
