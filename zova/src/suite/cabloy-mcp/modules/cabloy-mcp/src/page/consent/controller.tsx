import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-basic-button';
import { ZPage } from 'zova-module-home-base';

import type { ApiApiAuthorizationsummaryResponseBody } from '../../api/authorization.ts';

import { ModelAuthorization } from '../../model/authorization.ts';
import { toolIdentityKey } from '../../model/personalScopes.ts';

type ScopeOption = ApiApiAuthorizationsummaryResponseBody['options'][number];

export const ControllerPageConsentSchemaQuery = z.object({
  request: z.string().min(1),
});

@Controller()
export class ControllerPageConsent extends BeanControllerPageBase {
  @Use()
  $$modelAuthorization: ModelAuthorization;

  clientReady = false;
  reloginPending = false;
  selectedScope?: string;
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
    this.$watch(
      () => this.$query.request,
      () => {
        this.selectedScope = undefined;
      },
    );
  }

  get querySummary() {
    if (!this.clientReady || this.reloginPending) return;
    return this.$$modelAuthorization.summary(this.$query.request);
  }

  private _effectiveOption(summary: ApiApiAuthorizationsummaryResponseBody) {
    if (this.selectedScope !== undefined) {
      return summary.options.find(option => option.scope === this.selectedScope && option.allowed);
    }
    return (
      summary.options.find(option => option.scope === summary.scope && option.allowed) ??
      summary.options.find(option => option.allowed)
    );
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
    const summary = this.querySummary?.data;
    const selected = summary && this._effectiveOption(summary);
    if (allow && !selected) return;
    try {
      const result = await this.$$modelAuthorization.decision(
        this.$query.request,
        allow,
        allow ? selected?.scope : undefined,
      );
      window.location.assign(result.redirectUrl);
    } catch (error: any) {
      if (error.code !== 401) throw error;
      await this.requireRelogin();
    }
  }

  private _reason(option: ScopeOption) {
    switch (option.reason) {
      case 'outside_requested_scope':
        return this.scope.locale.McpScopeOutsideRequested();
      case 'outside_client_scope':
        return this.scope.locale.McpScopeOutsideClient();
      case 'tools_unavailable':
        return this.scope.locale.McpScopeUnavailable();
      default:
        return this.scope.locale.McpScopeNotAllowed();
    }
  }

  private _renderOption(option: ScopeOption, selected?: string) {
    return (
      <div
        key={option.scope}
        data-mcp-scope-option={option.scope}
        class="rounded-box border border-base-300 p-4"
      >
        <label class="flex cursor-pointer items-start gap-3">
          <input
            class="radio radio-primary mt-1"
            type="radio"
            name="mcp-effective-scope"
            value={option.scope}
            checked={selected === option.scope}
            disabled={!option.allowed}
            aria-label={option.name}
            onChange={() => {
              this.selectedScope = option.scope;
            }}
          />
          <span class="min-w-0 space-y-1">
            <span class="block break-words font-medium">{option.name}</span>
            <span class="block break-all font-mono text-xs text-base-content/70">
              {option.scope}
            </span>
            <span class="block whitespace-pre-wrap text-sm text-base-content/70">
              {option.description}
            </span>
            {!option.allowed && (
              <span class="block text-sm text-warning">{this._reason(option)}</span>
            )}
          </span>
        </label>
        <details class="mt-3 text-sm">
          <summary class="cursor-pointer">
            {this.scope.locale.McpScopeSelectedTools(option.tools.length)}
          </summary>
          <ul class="mt-3 space-y-3">
            {option.tools.map(tool => (
              <li key={toolIdentityKey(tool)} class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="break-words text-sm">{tool.summary?.trim() || tool.name}</span>
                  <span
                    class={`badge badge-sm ${tool.available ? 'badge-outline' : 'badge-warning'}`}
                  >
                    {!tool.available
                      ? this.scope.locale.McpToolMissing()
                      : tool.readOnly
                        ? this.scope.locale.McpToolReadOnly()
                        : this.scope.locale.McpToolWrites()}
                  </span>
                </div>
                <p class="break-all font-mono text-xs text-base-content/70">
                  {tool.controller} / {tool.action}
                </p>
                {tool.description && (
                  <p class="whitespace-pre-wrap text-sm text-base-content/70">{tool.description}</p>
                )}
              </li>
            ))}
          </ul>
          {option.tools.length === 0 && (
            <p class="mt-2 text-base-content/70">{this.scope.locale.McpScopeNoTools()}</p>
          )}
        </details>
      </div>
    );
  }

  protected render() {
    const query = this.querySummary;
    this._querySummary = query;
    const summary = query?.data;
    const scopes = summary?.scope.split(' ').filter(Boolean) ?? [];
    const selected = summary && this._effectiveOption(summary);
    return (
      <ZPage>
        <main class="flex min-h-screen items-center justify-center bg-base-200 px-4 py-10">
          <section class="card w-full max-w-2xl border border-base-300 bg-base-100 shadow-sm">
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
                      <dt class="text-sm text-base-content/70">{this.scope.locale.Resource()}</dt>
                      <dd data-mcp-resource class="select-text break-all font-mono text-sm">
                        {summary.resource}
                      </dd>
                    </div>
                    <div>
                      <dt class="text-sm text-base-content/70">
                        {this.scope.locale.RequestedScopes()}
                      </dt>
                      <dd>
                        <ul class="mt-1 flex flex-wrap gap-2" data-mcp-requested-scope>
                          {scopes.map(scope => (
                            <li key={scope} class="badge badge-outline">
                              {scope}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                  <fieldset class="space-y-3">
                    <legend class="mb-2 font-medium">
                      {this.scope.locale.McpEffectiveScope()}
                    </legend>
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <p class="text-sm text-base-content/70">
                        {this.scope.locale.McpEffectiveScopeHelp()}
                      </p>
                      <a
                        class="link link-primary text-sm"
                        href={summary.scopesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {this.scope.locale.McpManageScopes()}
                      </a>
                    </div>
                    {summary.options.map(option => this._renderOption(option, selected?.scope))}
                    {!selected && (
                      <p role="alert" class="text-sm text-warning">
                        {this.scope.locale.McpScopeNoAllowedOption()}
                      </p>
                    )}
                  </fieldset>
                  <div class="card-actions justify-end gap-3">
                    <ZButton class="btn btn-outline" onPerform={() => this.decide(false)}>
                      {this.scope.locale.Deny()}
                    </ZButton>
                    <ZButton
                      class="btn btn-primary"
                      disabled={!selected}
                      onPerform={() => this.decide(true)}
                    >
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
