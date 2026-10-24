import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-basic-button';
import { ZPage } from 'zova-module-home-base';

import { ModelAuthorization } from '../../model/authorization.js';

export const ControllerPageConsentSchemaQuery = z.object({
  request: z.string().min(1),
});

@Controller()
export class ControllerPageConsent extends BeanControllerPageBase {
  @Use()
  $$modelAuthorization: ModelAuthorization;

  clientReady = false;

  protected __init__() {
    this.$ssr.handleDirectOrOnHydrated(() => {
      this.clientReady = true;
    });
  }

  get querySummary() {
    if (!this.clientReady) return;
    return this.$$modelAuthorization.summary(this.$query.request);
  }

  async decide(allow: boolean) {
    const result = await this.$$modelAuthorization.decision(this.$query.request, allow);
    window.location.assign(result.redirectUrl);
  }

  protected render() {
    const query = this.querySummary;
    const summary = query?.data;
    return (
      <ZPage>
        <main class="flex min-h-screen items-center justify-center bg-base-200 px-4 py-10">
          <section class="card w-full max-w-xl border border-base-300 bg-base-100 shadow-sm">
            <div class="card-body gap-6">
              <h1 class="card-title text-2xl">{this.scope.locale.AuthorizeMcpAccess()}</h1>
              {!this.clientReady || query?.isPending ? (
                <p role="status" class="text-base-content/70">
                  {this.scope.locale.LoadingAuthorizationRequest()}
                </p>
              ) : query?.error || !summary ? (
                <div role="alert" class="alert alert-error">
                  <span>{this.scope.locale.AuthorizationRequestUnavailable()}</span>
                </div>
              ) : (
                <>
                  <p class="text-base-content/70">{this.scope.locale.AuthorizationConsentHelp()}</p>
                  <dl class="space-y-4">
                    <div>
                      <dt class="text-sm text-base-content/70">
                        {this.scope.locale.Application()}
                      </dt>
                      <dd class="break-words font-medium">{summary.clientName}</dd>
                    </div>
                    <div>
                      <dt class="text-sm text-base-content/70">{this.scope.locale.Resource()}</dt>
                      <dd class="break-all">{summary.resource}</dd>
                    </div>
                    <div>
                      <dt class="text-sm text-base-content/70">
                        {this.scope.locale.RequestedScopes()}
                      </dt>
                      <dd>
                        <ul class="mt-1 flex flex-wrap gap-2">
                          {summary.scope
                            .split(' ')
                            .filter(Boolean)
                            .map(scope => (
                              <li key={scope} class="badge badge-outline">
                                {scope}
                              </li>
                            ))}
                        </ul>
                      </dd>
                    </div>
                    <div>
                      <dt class="text-sm text-base-content/70">
                        {this.scope.locale.RequestExpires()}
                      </dt>
                      <dd>
                        <time datetime={new Date(summary.expiresAt).toISOString()}>
                          {new Date(summary.expiresAt).toLocaleString()}
                        </time>
                      </dd>
                    </div>
                  </dl>
                  <p class="text-sm text-base-content/70">
                    {this.scope.locale.AuthorizationReadScopeHelp()}
                  </p>
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
