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

export interface IPayUiProvider {
  supports(action: TypePaymentNextAction): boolean;
  execute(action: TypePaymentNextAction): Promise<void>;
}
