import type { IPaymentNextActionProps } from 'zova-module-a-pay';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ServicePaymentCoordinator } from 'zova-module-a-pay';
import { ZButton } from 'zova-module-basic-button';

export interface ControllerPaymentNextActionProps extends IPaymentNextActionProps {}

@Controller()
export class ControllerPaymentNextAction extends BeanControllerBase {
  static $propsDefault = {};

  @Use()
  $$paymentCoordinator: ServicePaymentCoordinator;

  async continueRedirect() {
    const { action, disabled } = this.$props as IPaymentNextActionProps;
    if (action?.kind !== 'redirect' || disabled) return;
    await this.$$paymentCoordinator.execute(action);
  }

  protected render() {
    const {
      action,
      disabled,
      continueToPaymentText,
      continueToPaymentHelpText,
      embeddedCheckoutUnavailableText,
      paymentCompletedText,
      paymentPreparingText,
      paymentPreparingRetryText,
      refreshPaymentStatusText,
      onRefresh,
    } = this.$props as IPaymentNextActionProps;
    if (!action) return null;
    if (action.kind === 'redirect') {
      return (
        <div class="mt-6 space-y-3">
          <p class="text-base-content/70">{continueToPaymentHelpText}</p>
          <ZButton
            class="btn btn-primary"
            disabled={disabled}
            onPerform={() => this.continueRedirect()}
          >
            {continueToPaymentText}
          </ZButton>
        </div>
      );
    }
    if (action.kind === 'pending') {
      return (
        <div class="mt-6 space-y-3" aria-live="polite">
          <p class="text-base-content/70">
            {action.retryAfterSeconds
              ? paymentPreparingRetryText?.(action.retryAfterSeconds)
              : paymentPreparingText}
          </p>
          {onRefresh && (
            <ZButton class="btn btn-outline" disabled={disabled} onPerform={() => onRefresh()}>
              {refreshPaymentStatusText}
            </ZButton>
          )}
        </div>
      );
    }
    if (action.kind === 'completed') {
      return (
        <p class="mt-6 text-base-content/70" aria-live="polite">
          {paymentCompletedText}
        </p>
      );
    }
    return (
      <div class="mt-6" aria-live="polite">
        <p class="text-base-content/70">{embeddedCheckoutUnavailableText}</p>
      </div>
    );
  }
}
