import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

import type { TypePaymentNextAction } from '../../types/payment.js';

import { ServicePaymentCoordinator } from '../../service/paymentCoordinator.js';

export interface ControllerPaymentNextActionProps {
  action?: TypePaymentNextAction;
  disabled?: boolean;
  onRefresh?: () => void | Promise<void>;
}

@Controller()
export class ControllerPaymentNextAction extends BeanControllerBase {
  static $propsDefault = {};

  @Use()
  $$paymentCoordinator: ServicePaymentCoordinator;

  async continueRedirect() {
    const action = this.$props.action;
    if (action?.kind !== 'redirect' || this.$props.disabled) return;
    await this.$$paymentCoordinator.execute(action);
  }

  protected render() {
    const { action, disabled, onRefresh } = this.$props as ControllerPaymentNextActionProps;
    if (!action) return null;
    if (action.kind === 'redirect') {
      return (
        <div class="mt-6 space-y-3">
          <p class="text-base-content/70">Continue to the payment provider to complete payment.</p>
          <button
            class="btn btn-primary"
            disabled={disabled}
            onClick={() => this.continueRedirect()}
          >
            Continue to payment
          </button>
        </div>
      );
    }
    if (action.kind === 'pending') {
      return (
        <div class="mt-6 space-y-3" aria-live="polite">
          <p class="text-base-content/70">
            Payment is being prepared
            {action.retryAfterSeconds
              ? `; retrying in about ${action.retryAfterSeconds} seconds`
              : ''}
            .
          </p>
          {onRefresh && (
            <button class="btn btn-outline" disabled={disabled} onClick={() => onRefresh()}>
              Refresh payment status
            </button>
          )}
        </div>
      );
    }
    if (action.kind === 'completed') {
      return (
        <p class="mt-6 text-base-content/70" aria-live="polite">
          Payment is complete. Confirming the order…
        </p>
      );
    }
    return (
      <div class="mt-6" aria-live="polite">
        <p class="text-base-content/70">
          Embedded checkout will be available when this payment provider is configured.
        </p>
      </div>
    );
  }
}
