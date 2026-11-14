import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZButton } from 'zova-module-basic-button';
import { ZPage } from 'zova-module-home-base';

import type { ApiApiMcpAuthAuthorizationGrantmineResponseBody } from '../../api/mcpAuthAuthorizationGrant.ts';

import { getMcpResource } from '../../lib/mcpResource.ts';
import { ModelAuthorizationRecords } from '../../model/authorizationRecords.ts';

type AuthorizationItem = ApiApiMcpAuthAuthorizationGrantmineResponseBody['list'][number];

@Controller()
export class ControllerPageAuthorizations extends BeanControllerPageBase {
  @Use()
  $$modelAuthorizationRecords: ModelAuthorizationRecords;

  pageNo = 1;
  readonly pageSize = 20;

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.queryRecords);
  }

  get queryRecords() {
    return this.$$modelAuthorizationRecords.mine({ pageNo: this.pageNo, pageSize: this.pageSize });
  }

  async revoke(item: AuthorizationItem) {
    const confirmed = await this.$performCommand('basic-commands:confirm', {
      text: this.scope.locale.McpAuthorizationRevokeConfirm(),
    });
    if (!confirmed) return;
    await this.$$modelAuthorizationRecords.revokeMine(item.id).mutateAsync();
  }

  private _status(state: AuthorizationItem['state']) {
    switch (state) {
      case 'pending':
        return this.scope.locale.McpAuthorizationPending();
      case 'codeReady':
        return this.scope.locale.McpAuthorizationCodeReady();
      case 'tokenActive':
        return this.scope.locale.McpAuthorizationTokenActive();
      case 'denied':
        return this.scope.locale.McpAuthorizationDenied();
      case 'revoked':
        return this.scope.locale.McpAuthorizationRevoked();
      default:
        return state;
    }
  }

  private _renderDate(value: string | number | Date) {
    const date = value instanceof Date ? value : new Date(value);
    return (
      <time datetime={date.toISOString()}>
        {date.toLocaleString(this.app.meta.locale.current, { timeZone: this.app.meta.locale.tz })}
      </time>
    );
  }

  private _renderRecord(item: AuthorizationItem) {
    return (
      <article
        key={item.id}
        data-authorization-id={item.id}
        class="card border border-base-300 bg-base-100 shadow-sm"
      >
        <div class="card-body gap-4">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <h2 class="card-title break-words">{item.clientName}</h2>
            {(item.state === 'codeReady' || item.state === 'tokenActive') && (
              <ZButton class="btn btn-outline btn-sm" onPerform={() => this.revoke(item)}>
                {this.scope.locale.Revoke()}
              </ZButton>
            )}
          </div>
          <dl class="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-base-content/70">{this.scope.locale.McpAuthorizationStatus()}</dt>
              <dd>{this._status(item.state)}</dd>
            </div>
            <div>
              <dt class="text-base-content/70">{this.scope.locale.McpGrantedScope()}</dt>
              <dd class="break-words">{item.scope}</dd>
            </div>
            <div>
              <dt class="text-base-content/70">{this.scope.locale.RequestedScopes()}</dt>
              <dd class="break-words">{item.requestedScope}</dd>
            </div>
            <div>
              <dt class="text-base-content/70">{this.scope.locale.McpAuthorizationCreated()}</dt>
              <dd>{this._renderDate(item.createdAt)}</dd>
            </div>
            <div>
              <dt class="text-base-content/70">
                {this.scope.locale.McpAuthorizationAccessExpires()}
              </dt>
              <dd>
                {item.tokenExpiresAt > 0
                  ? this._renderDate(item.tokenExpiresAt)
                  : this.scope.locale.McpAuthorizationNotIssued()}
              </dd>
            </div>
            <div>
              <dt class="text-base-content/70">
                {this.scope.locale.McpAuthorizationRefreshExpires()}
              </dt>
              <dd>
                {!item.refreshEnabled
                  ? this.scope.locale.McpAuthorizationRefreshDisabled()
                  : item.refreshExpiresAt && item.refreshExpiresAt > 0
                    ? this._renderDate(item.refreshExpiresAt)
                    : this.scope.locale.McpAuthorizationNotIssued()}
              </dd>
            </div>
          </dl>
          <details class="text-sm">
            <summary class="cursor-pointer">{this.scope.locale.McpAuthorizationClientId()}</summary>
            <p class="mt-2 break-all font-mono">{item.clientId}</p>
          </details>
        </div>
      </article>
    );
  }

  protected render() {
    const query = this.queryRecords;
    const data = query?.data;
    const loading = !query || query.isPending;
    return (
      <ZPage>
        <section class="mx-auto max-w-4xl space-y-6 p-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 class="text-3xl font-semibold">{this.scope.locale.McpAuthorizations()}</h1>
              <p class="mt-2 text-base-content/70">{this.scope.locale.McpAuthorizationsHelp()}</p>
            </div>
            <ZButton
              class="btn btn-outline btn-sm"
              disabled={!query}
              onPerform={async () => {
                await this.queryRecords?.refetch({ throwOnError: true });
              }}
            >
              {this.scope.locale.Refresh()}
            </ZButton>
          </div>
          <dl class="space-y-1 text-sm">
            <dt class="text-base-content/70">{this.scope.locale.Resource()}</dt>
            <dd data-mcp-resource class="select-text break-all font-mono">
              {getMcpResource(this.sys.env)}
            </dd>
          </dl>
          <p class="text-sm text-base-content/70">
            {this.scope.locale.McpAuthorizationsRetention()}
          </p>
          {loading && <p role="status">{this.scope.locale.McpAuthorizationsLoading()}</p>}
          {query?.error && (
            <div role="alert" class="alert alert-error">
              <span>{this.scope.locale.McpAuthorizationsLoadFailed()}</span>
              <ZButton
                class="btn btn-sm"
                onPerform={async () => {
                  await this.queryRecords?.refetch({ throwOnError: true });
                }}
              >
                {this.scope.locale.Retry()}
              </ZButton>
            </div>
          )}
          {!loading && !query?.error && data?.list.length === 0 && (
            <p>{this.scope.locale.McpAuthorizationsEmpty()}</p>
          )}
          <div class="space-y-4">{data?.list.map(item => this._renderRecord(item))}</div>
          {data && data.pageCount > 0 && (
            <nav
              aria-label={this.scope.locale.McpAuthorizations()}
              class="flex flex-wrap items-center justify-between gap-3"
            >
              <ZButton
                class="btn btn-outline btn-sm"
                disabled={this.pageNo <= 1}
                onPerform={() => {
                  this.pageNo -= 1;
                }}
              >
                {this.scope.locale.Previous()}
              </ZButton>
              <span class="text-sm text-base-content/70">
                {this.scope.locale.McpAuthorizationsPage(data.pageNo, data.pageCount, data.total)}
              </span>
              <ZButton
                class="btn btn-outline btn-sm"
                disabled={this.pageNo >= data.pageCount}
                onPerform={() => {
                  this.pageNo += 1;
                }}
              >
                {this.scope.locale.Next()}
              </ZButton>
            </nav>
          )}
        </section>
      </ZPage>
    );
  }
}
