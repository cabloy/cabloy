import type { TableIdentity } from 'table-identity';

export type TypePayEnvironment = 'sandbox' | 'live';

export type TypePaymentSessionState =
  | 'created'
  | 'starting'
  | 'requires_action'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'expired';

export type TypeRefundOperationState =
  | 'created'
  | 'submitting'
  | 'pending'
  | 'succeeded'
  | 'failed'
  | 'cancelled';

export type TypeProviderOperationKind = 'start' | 'confirm' | 'query' | 'refund';

export type TypeProviderOperationState =
  | 'created'
  | 'claimed'
  | 'submitted'
  | 'succeeded'
  | 'failed'
  | 'reconciliation_required';

export type TypeOutboxEventState = 'pending' | 'claimed' | 'dispatched' | 'failed';

export type TypePaymentNextAction =
  | { kind: 'redirect'; url: string }
  | { kind: 'embedded'; clientToken: string; publishableConfig?: Record<string, string> }
  | { kind: 'pending'; retryAfterSeconds?: number }
  | { kind: 'completed' };

export interface IPayMoney {
  amountMinor: number;
  currency: string;
}

export interface IPayProviderCapabilities {
  redirectCheckout: boolean;
  embeddedCheckout: boolean;
  automaticCapture: boolean;
  manualCapture: boolean;
  refunds: boolean;
  partialRefunds: boolean;
  webhooks: boolean;
}

export interface IPayProviderPaymentInput extends IPayMoney {
  paymentSessionId: TableIdentity;
  businessReference: string;
  idempotencyKey: string;
  returnUrl?: string;
  cancelUrl?: string;
  providerOrderId?: string;
}

export interface IPayProviderRefundInput extends IPayMoney {
  paymentSessionId: TableIdentity;
  refundOperationId: TableIdentity;
  businessReference: string;
  idempotencyKey: string;
  providerCaptureId: string;
}

export interface IPayProviderPaymentSnapshot {
  state: Extract<
    TypePaymentSessionState,
    'requires_action' | 'processing' | 'succeeded' | 'failed' | 'cancelled'
  >;
  providerPaymentId?: string;
  providerOrderId?: string;
  providerCaptureId?: string;
  nextAction?: TypePaymentNextAction;
  summary?: Record<string, string | number | boolean | null>;
}

export interface IPayProviderRefundSnapshot {
  state: Extract<TypeRefundOperationState, 'pending' | 'succeeded' | 'failed' | 'cancelled'>;
  providerRefundId?: string;
  summary?: Record<string, string | number | boolean | null>;
}

export interface IPayProviderWebhookInput {
  endpointKey: string;
  rawBody?: string;
  body: unknown;
  headers: Record<string, string | string[] | undefined>;
}

export interface IPayProviderVerifiedWebhook {
  eventId: string;
  eventType: string;
  paymentSessionId?: TableIdentity;
  refundOperationId?: TableIdentity;
  payment?: IPayProviderPaymentSnapshot;
  refund?: IPayProviderRefundSnapshot;
  summary?: Record<string, string | number | boolean | null>;
}

export interface IPayProviderExecute {
  getCapabilities(): IPayProviderCapabilities;
  startPayment(input: IPayProviderPaymentInput): Promise<IPayProviderPaymentSnapshot>;
  queryPayment(input: IPayProviderPaymentInput): Promise<IPayProviderPaymentSnapshot>;
  createRefund(input: IPayProviderRefundInput): Promise<IPayProviderRefundSnapshot>;
  queryRefund?(input: IPayProviderRefundInput): Promise<IPayProviderRefundSnapshot>;
  verifyWebhook(input: IPayProviderWebhookInput): Promise<IPayProviderVerifiedWebhook>;
}

export interface IPaymentOutcomeEvent extends IPayMoney {
  eventId: string;
  paymentSessionId: TableIdentity;
  businessReference: string;
  providerName: string;
  state: Extract<TypePaymentSessionState, 'succeeded' | 'failed' | 'cancelled'>;
  providerCaptureId?: string;
}

export interface IRefundOutcomeEvent extends IPayMoney {
  eventId: string;
  paymentSessionId: TableIdentity;
  refundOperationId: TableIdentity;
  businessReference: string;
  providerName: string;
  state: Extract<TypeRefundOperationState, 'succeeded' | 'failed' | 'cancelled'>;
  providerRefundId?: string;
}
