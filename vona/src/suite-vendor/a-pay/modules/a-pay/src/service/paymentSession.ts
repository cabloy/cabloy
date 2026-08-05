import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { EntityPaymentSession } from '../entity/paymentSession.tsx';
import type {
  IPayProviderCapabilities,
  IPayProviderPaymentSnapshot,
  TypePaymentNextAction,
  TypePaymentSessionState,
} from '../types/payment.ts';
import type { IDecoratorPaySceneOptions } from '../types/payScene.ts';

export interface IPaymentSessionCreateCommand {
  userId: TableIdentity;
  payScene: string;
  businessReference: string;
  amountMinor: number;
  currency: string;
  correlationId: string;
  providerCandidateKey?: string;
}

@Service()
export class ServicePaymentSession extends BeanBase {
  async create(command: IPaymentSessionCreateCommand): Promise<EntityPaymentSession> {
    const sceneOptions = this.bean.payScene.getOptions(command.payScene as never);
    this._assertCreateCommand(command, sceneOptions);
    const provider = await this.bean.payScene.resolveProvider(command.payScene as never, command);
    this._assertProviderCapabilities(provider.capabilities, sceneOptions);
    const sessionExpiresIn = sceneOptions.sessionExpiresIn;
    if (!Number.isSafeInteger(sessionExpiresIn) || !sessionExpiresIn || sessionExpiresIn < 0) {
      this.app.throw(500, 'payment scene has an invalid session expiration');
    }
    return await this.scope.model.paymentSession.insert({
      ...command,
      providerName: provider.providerName,
      clientName: provider.clientName,
      environment: provider.environment,
      expiresAt: new Date(Date.now() + sessionExpiresIn),
      state: 'created',
    });
  }

  private _assertCreateCommand(
    command: IPaymentSessionCreateCommand,
    sceneOptions: IDecoratorPaySceneOptions,
  ) {
    if (!Number.isSafeInteger(command.amountMinor) || command.amountMinor < 0) {
      this.app.throw(422, 'payment amount is invalid');
    }
    if (sceneOptions.currencies && !sceneOptions.currencies.includes(command.currency)) {
      this.app.throw(422, 'payment currency is not allowed by the payment scene');
    }
  }

  private _assertProviderCapabilities(
    capabilities: IPayProviderCapabilities,
    sceneOptions: IDecoratorPaySceneOptions,
  ) {
    if (
      (sceneOptions.captureMode === 'automatic' && !capabilities.automaticCapture) ||
      (sceneOptions.captureMode === 'manual' && !capabilities.manualCapture)
    ) {
      this.app.throw(500, 'payment scene capture mode is not supported by the payment provider');
    }
    if (sceneOptions.refund?.enabled && !capabilities.refunds) {
      this.app.throw(500, 'payment scene refunds are not supported by the payment provider');
    }
    if (sceneOptions.refund?.allowPartial && !capabilities.partialRefunds) {
      this.app.throw(
        500,
        'payment scene partial refunds are not supported by the payment provider',
      );
    }
  }

  async start(paymentSessionId: TableIdentity): Promise<EntityPaymentSession> {
    return await this.scope.service.providerOperation.start(paymentSessionId);
  }

  @Core.transaction()
  async beginStart(paymentSessionId: TableIdentity): Promise<EntityPaymentSession> {
    const session = await this.scope.model.paymentSession.getByIdForUpdate(paymentSessionId);
    if (!session) this.app.throw(404, 'payment session not found');
    if (session.state !== 'created') this.app.throw(409, 'payment session is not ready to start');
    if (session.expiresAt <= new Date()) this.app.throw(409, 'payment session is expired');
    return await this.transition(session.id, 'starting', { source: 'paymentSession.start' });
  }

  @Core.transaction()
  async settleStartSnapshot(
    paymentSessionId: TableIdentity,
    snapshot: IPayProviderPaymentSnapshot & {
      state: 'succeeded' | 'failed' | 'cancelled';
    },
  ): Promise<EntityPaymentSession> {
    const session = await this.scope.model.paymentSession.getByIdForUpdate(paymentSessionId);
    if (!session) this.app.throw(404, 'payment session not found');
    if (session.state !== 'starting') this.app.throw(409, 'payment session is not starting');
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
      fromState: session.state,
      toState: snapshot.state,
      correlationId: session.correlationId,
      source: 'paymentSession.startProvider',
      occurredAt: finalizedAt,
    });
    await this.scope.service.outbox.enqueue(session.id, 'payment.outcome.v1', {
      eventId: `${session.correlationId}:start`,
      paymentSessionId: session.id,
      businessReference: session.businessReference,
      providerName: session.providerName,
      state: snapshot.state,
      providerCaptureId: snapshot.providerCaptureId,
      amountMinor: session.amountMinor,
      currency: session.currency,
    });
    return { ...session, ...snapshot, state: snapshot.state, finalizedAt };
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
  ): Promise<{
    session: EntityPaymentSession;
    changed: boolean;
    ignoredReason?: string;
  }> {
    const session = await this.scope.model.paymentSession.getByIdForUpdate(paymentSessionId);
    if (!session) this.app.throw(404, 'payment session not found');
    if (session.state === options.state) {
      this._assertWebhookProviderFactsConsistent(session, options);
      return { session, changed: false };
    }
    if (['succeeded', 'failed', 'cancelled', 'expired'].includes(session.state)) {
      if (
        session.state === 'expired' &&
        options.state === 'succeeded' &&
        options.providerCaptureId
      ) {
        const finalizedAt = new Date();
        await this.scope.model.paymentSession.updateById(session.id, {
          providerPaymentId: options.providerPaymentId,
          providerCaptureId: options.providerCaptureId,
        });
        await this.scope.model.paymentAudit.insert({
          paymentSessionId: session.id,
          webhookInboxId: options.webhookInboxId,
          fromState: 'expired',
          toState: 'expired',
          correlationId: session.correlationId,
          source: 'webhook.lateCapture',
          occurredAt: finalizedAt,
        });
        return {
          session: { ...session, ...options },
          changed: true,
          ignoredReason: 'late successful capture requires compensation',
        };
      }
      return {
        session,
        changed: false,
        ignoredReason: `terminal payment state ${options.state} ignored after ${session.state}`,
      };
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

  private _assertWebhookProviderFactsConsistent(
    session: EntityPaymentSession,
    options: {
      providerPaymentId?: string;
      providerCaptureId?: string;
    },
  ) {
    if (
      (session.providerPaymentId &&
        options.providerPaymentId &&
        session.providerPaymentId !== options.providerPaymentId) ||
      (session.providerCaptureId &&
        options.providerCaptureId &&
        session.providerCaptureId !== options.providerCaptureId)
    ) {
      this.app.throw(409, 'payment webhook provider facts conflict with the payment session');
    }
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
