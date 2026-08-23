import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

import { ModelAccount } from '../../model/account.js';

export const ControllerPageActivationSchemaQuery = z.object({
  token: z.preprocess(
    value => (typeof value === 'string' ? value : undefined),
    z.string().optional(),
  ),
});

@Controller()
export class ControllerPageActivation extends BeanControllerPageBase {
  @Use()
  $$modelAccount: ModelAccount;

  private token?: string;
  tokenReady = false;
  completed = false;

  protected async __init__() {
    this.ctx.meta.$ssr.handleDirectOrOnHydrated(async () => {
      await this._consumeQueryToken();
    });
  }

  gotoLogin() {
    return this.app.$gotoPage('/home/login', {
      query: { [this.sys.env.ROUTER_KEY_RETURNTO]: this.app.$getReturnTo() },
    });
  }

  private async _consumeQueryToken() {
    this.token = this.$query.token || undefined;
    try {
      if (!this.token) return;
      await this.$$modelAccount.consumeActivation().mutateAsync({ token: this.token });
      this.completed = true;
    } catch {
      // Invalid and expired tokens intentionally share the same public state.
    } finally {
      this.token = undefined;
      const pagePath = this.$router.getPagePath('/home/user/activation');
      await this.$router.replace(pagePath);
      this.tokenReady = true;
    }
  }

  protected render() {
    return (
      <ZPage>
        <section class="mx-auto max-w-md p-6">
          <div class="card border border-base-300 bg-base-100 shadow-sm">
            <div class="card-body gap-4">
              <h1 class="card-title text-2xl">{this.scope.locale.AccountActivation()}</h1>
              {!this.tokenReady ? (
                <p class="text-sm text-base-content/70">
                  {this.scope.locale.AccountActivationPreparing()}
                </p>
              ) : this.completed ? (
                <p class="text-sm text-base-content/70">
                  {this.scope.locale.AccountActivationCompleted()}
                </p>
              ) : (
                <p role="alert" class="text-sm text-error">
                  {this.scope.locale.AccountActivationInvalid()}
                </p>
              )}
              {this.tokenReady && (
                <button class="btn btn-primary" type="button" onClick={() => this.gotoLogin()}>
                  {this.scope.locale.AccountActivationBackToLogin()}
                </button>
              )}
            </div>
          </div>
        </section>
      </ZPage>
    );
  }
}
