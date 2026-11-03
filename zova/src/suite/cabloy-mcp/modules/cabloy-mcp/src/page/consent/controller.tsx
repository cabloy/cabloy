import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-basic-button';
import { ZPage } from 'zova-module-home-base';

import { ModelAuthorization } from '../../model/authorization.ts';

export const ControllerPageConsentSchemaQuery = z.object({
  request: z.string().min(1),
});

@Controller()
export class ControllerPageConsent extends BeanControllerPageBase {
  @Use()
  $$modelAuthorization: ModelAuthorization;

  clientReady = false;
  reloginPending = false;
  private _querySummary?: ReturnType<ModelAuthorization['summary']>;

  protected __init__() {
    this.$ssr.handleDirectOrOnHydrated(() => {
      this.clientReady = true;
    });
    this.$watch(
      () => this._querySummary?.error,
      error => {
        if (error?.code === 401) {
          return this.requireRelogin().catch(error => this.$errorHandler(error));
        }
      },
      { immediate: true },
    );
  }

  get querySummary() {
    if (!this.clientReady || this.reloginPending) return;
    return this.$$modelAuthorization.summary(this.$query.request);
  }

  private async requireRelogin() {
    if (this.reloginPending) return;
    const returnTo = this.app.$getCurrentPagePath();
    this.reloginPending = true;
    try {
      await this.$passport.requireRelogin(returnTo);
    } catch (error) {
      this.reloginPending = false;
      throw error;
    }
  }

  async decide(allow: boolean) {
    if (this.reloginPending) return;
    try {
      const result = await this.$$modelAuthorization.decision(this.$query.request, allow);
      window.location.assign(result.redirectUrl);
    } catch (error: any) {
      if (error.code !== 401) throw error;
      await this.requireRelogin();
    }
  }

  protected render() {
    const query = this.querySummary;
    this._querySummary = query;
    const summary = query?.data;
    const scopes = summary?.scope.split(' ').filter(Boolean) ?? [];
    return (
      <ZPage>
        <main class="flex min-h-screen items-center justify-center bg-base-200 px-4 py-10">
          <section class="card w-full max-w-xl border border-base-300 bg-base-100 shadow-sm">
            <div class="card-body gap-6">
              <h1 class="card-title text-2xl">{this.scope.locale.AuthorizeMcpAccess()}</h1>
              {!this.clientReady ||
              this.reloginPending ||
              query?.isPending ||
              query?.error?.code === 401 ? (
                <p role="status" class="text-base-content/70">
                  {this.scope.locale.LoadingAuthorizationRequest()}
                </p>
              ) : query?.error || !summary ? (
                <div role="alert" class="alert alert-error">
                  <span>{this.scope.locale.AuthorizationRequestUnavailable()}</span>
                </div>
              ) : (
                <>
                  <dl class="space-y-4">
                    <div>
                      <dt class="text-sm text-base-content/70">
                        {this.scope.locale.Application()}
                      </dt>
                      <dd class="break-words font-medium">{summary.clientName}</dd>
                    </div>
                    <div>
                      <dt class="text-sm text-base-content/70">
                        {this.scope.locale.RequestedScopes()}
                      </dt>
                      <dd>
                        <ul class="mt-1 flex flex-wrap gap-2">
                          {scopes.map(scope => (
                            <li key={scope} class="badge badge-outline">
                              {scope}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                  <div class="card-actions justify-end gap-3">
                    <ZButton class="btn btn-outline" onPerform={() => this.decide(false)}>
                      {this.scope.locale.Deny()}
                    </ZButton>
                    <ZButton class="btn btn-primary" onPerform={() => this.decide(true)}>
                      {this.scope.locale.Approve()}
                    </ZButton>
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      </ZPage>
    );
  }
}
