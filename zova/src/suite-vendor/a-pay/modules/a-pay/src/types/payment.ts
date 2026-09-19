export type TypePaymentNextAction =
  | { kind: 'redirect'; url: string }
  | { kind: 'embedded'; clientToken: string; publishableConfig?: Record<string, string> }
  | { kind: 'pending'; retryAfterSeconds?: number }
  | { kind: 'completed' };

export interface IPaymentSessionView {
  id: string | number;
  state:
    | 'created'
    | 'starting'
    | 'requires_action'
    | 'processing'
    | 'succeeded'
    | 'failed'
    | 'cancelled'
    | 'expired';
  providerName: string;
  nextAction?: TypePaymentNextAction;
}

export interface IPaymentNextActionProps {
  action?: TypePaymentNextAction;
  disabled?: boolean;
  continueToPaymentText?: string;
  continueToPaymentHelpText?: string;
  embeddedCheckoutUnavailableText?: string;
  paymentCompletedText?: string;
  paymentPreparingText?: string;
  paymentPreparingRetryText?: (retryAfterSeconds: number) => string;
  refreshPaymentStatusText?: string;
  onRefresh?: () => void | Promise<void>;
}

export interface IPayUiProvider {
  supports(action: TypePaymentNextAction): boolean;
  execute(action: TypePaymentNextAction): Promise<void>;
}
