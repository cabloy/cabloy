import type { TableIdentity } from 'table-identity';
import type { TypeFormOnSubmitData } from 'zova-module-a-form';

import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZForm, ZFormField } from 'zova-module-a-form';
import { $QueriesEnsureLoaded, $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZButton } from 'zova-module-basic-button';
import { ZPage } from 'zova-module-home-base';

import type { AccessTokenDraft, AccessTokenItem } from '../../model/accessTokens.ts';

import { getMcpResource } from '../../lib/mcpResource.ts';
import { ModelAccessTokens } from '../../model/accessTokens.ts';
import { ModelPersonalScopes } from '../../model/personalScopes.ts';

const secondsPerDay = 24 * 60 * 60;

type DialogHandle = { close: () => void };
type RevealedToken = Pick<
  Awaited<ReturnType<ModelAccessTokens['createMine']>>,
  'accessToken' | 'resource'
>;

@Controller()
export class ControllerPageAccessTokens extends BeanControllerPageBase {
  @Use()
  $$modelAccessTokens: ModelAccessTokens;

  @Use()
  $$modelPersonalScopes: ModelPersonalScopes;

  pageNo = 1;
  readonly pageSize = 20;
  listRefreshFailed = false;

  private _editor?: DialogHandle;
  private _reveal?: DialogHandle;
  private _revealedToken?: RevealedToken;
  private _generation = 0;
  private _disposed = false;

  protected async __init__() {
    this.$watch(
      [() => this.$passport.user?.id, () => this.$passport.isAuthenticated],
      () => {
        this._clearDialogs();
        this.pageNo = 1;
      },
      { flush: 'sync' },
    );
    this.$watch(
      () => this.$currentRoute?.fullPath,
      () => this._clearDialogs(),
      { flush: 'sync' },
    );
    this.$watch(
      () => this.$pageHost?.active,
      active => {
        if (active === false) this._clearDialogs();
      },
      { flush: 'sync' },
    );
    await $QueryEnsureLoaded(() => this.queryTokens);
  }

  protected __dispose__() {
    this._disposed = true;
    this._clearDialogs();
  }

  get queryTokens() {
    return this.$$modelAccessTokens.mine({ pageNo: this.pageNo, pageSize: this.pageSize });
  }

  get queryScopes() {
    return this.$$modelPersonalScopes.mine();
  }

  get apiSchemasCreate() {
    return this.scope.apiSchema.mcpAuthAccessToken.createMine();
  }

  private _clearDialogs() {
    this._generation += 1;
    this._revealedToken = undefined;
    const editor = this._editor;
    const reveal = this._reveal;
    this._editor = undefined;
    this._reveal = undefined;
    editor?.close();
    reveal?.close();
  }

  private _isCurrent(generation: number, userId: TableIdentity | undefined) {
    return (
      !this._disposed &&
      this.$pageHost?.active !== false &&
      this.$passport.isAuthenticated &&
      this.$passport.user?.id === userId &&
      this._generation === generation
    );
  }

  async openCreate() {
    if (!process.env.CLIENT || this._editor || this._reveal) return;
    const generation = ++this._generation;
    const userId = this.$passport.user?.id;
    await $QueriesEnsureLoaded(
      () => this.apiSchemasCreate.sdk,
      () => this.queryScopes,
    );
    if (!this._isCurrent(generation, userId)) return;
    const draft: AccessTokenDraft = { name: '', scope: 'mcp:read', expiresIn: 7 * secondsPerDay };
    this._editor = this.$appModal.dialog(
      {
        title: this.scope.locale.McpAccessTokenCreate(),
        onClose: () => {
          this._editor = undefined;
          this._generation += 1;
        },
        slotDefault: dialog => (
          <ZForm
            slotWrapper={children => (
              <div data-testid="mcp-access-token-create-form">{children}</div>
            )}
            data={draft}
            schema={this.apiSchemasCreate.requestBody}
            localePresentationRefresh={{ identity: 'mcp-access-token:create' }}
            onSubmitData={data => this._create(data, generation, userId, dialog.close)}
            onShowError={async () => {
              await this.$performCommand('basic-commands:alert', {
                type: 'error',
                text: this.scope.locale.McpAccessTokenCreateFailed(),
              });
            }}
            slotFooter={form => (
              <div class="flex justify-end gap-2">
                <ZButton
                  data-testid="mcp-access-token-create-cancel"
                  class="btn btn-ghost"
                  onPerform={() => dialog.close()}
                >
                  {this.scope.locale.Cancel()}
                </ZButton>
                <ZButton
                  data-testid="mcp-access-token-create-submit"
                  class="btn btn-primary"
                  disabled={form.formState.isSubmitting}
                  onPerform={async () => {
                    await form.submit();
                  }}
                >
                  {this.scope.locale.McpAccessTokenCreate()}
                </ZButton>
              </div>
            )}
          >
            <ZFormField
              name="name"
              slotDefault={({ propsBucket }, field) => (
                <input
                  data-testid="mcp-access-token-name"
                  class="input input-bordered w-full"
                  type="text"
                  autocomplete="off"
                  value={propsBucket.value}
                  onInput={event =>
                    field.setValue(
                      (event.target as HTMLInputElement).value,
                      propsBucket.disableNotifyChanged,
                    )
                  }
                  onBlur={() => field.handleBlur()}
                />
              )}
            />
            <ZFormField
              name="scope"
              slotDefault={({ propsBucket }, field) => (
                <div class="space-y-2">
                  <select
                    data-testid="mcp-access-token-scope"
                    class="select select-bordered w-full"
                    value={propsBucket.value}
                    onChange={event => {
                      field.setValue(
                        (event.target as HTMLSelectElement).value,
                        propsBucket.disableNotifyChanged,
                      );
                      field.handleBlur();
                    }}
                  >
                    <option value="mcp:read">mcp:read</option>
                    <option value="mcp:all">mcp:all</option>
                    {this.queryScopes?.data?.list.map(scope => (
                      <option key={scope.id} value={scope.scope}>
                        {scope.name} ({scope.scope})
                      </option>
                    ))}
                  </select>
                  <p
                    class={`text-sm ${propsBucket.value === 'mcp:all' ? 'text-warning' : 'text-base-content/70'}`}
                  >
                    {propsBucket.value === 'mcp:all'
                      ? this.scope.locale.AuthorizationAllScopeHelp()
                      : this.scope.locale.McpAccessTokenScopeHelp()}
                  </p>
                  <a
                    class="link link-primary text-sm"
                    href={this.$router.getPagePath('/cabloy/mcp/scopes')}
                  >
                    {this.scope.locale.McpManageScopes()}
                  </a>
                </div>
              )}
            />
            <ZFormField
              name="expiresIn"
              layout={{ label: this.scope.locale.McpAccessTokenLifetimeDays() }}
              slotDefault={({ propsBucket }, field) => (
                <div class="space-y-2">
                  <input
                    data-testid="mcp-access-token-expires-in"
                    class="input input-bordered w-full"
                    type="number"
                    min={1}
                    step={1}
                    value={propsBucket.value == null ? '' : propsBucket.value / secondsPerDay}
                    onInput={event => {
                      const value = (event.target as HTMLInputElement).value;
                      field.setValue(
                        value === '' ? undefined : Number(value) * secondsPerDay,
                        propsBucket.disableNotifyChanged,
                      );
                    }}
                    onBlur={() => field.handleBlur()}
                  />
                  <p class="text-sm text-base-content/70">
                    {this.scope.locale.McpAccessTokenExpiryHelp()}
                  </p>
                </div>
              )}
            />
          </ZForm>
        ),
      },
      { closeOnBackdrop: false, closeOnEscape: true, maxWidth: 600, showCloseButton: true },
    );
  }

  private async _create(
    data: TypeFormOnSubmitData<AccessTokenDraft>,
    generation: number,
    userId: TableIdentity | undefined,
    close: () => void,
  ) {
    if (!process.env.CLIENT || !this._isCurrent(generation, userId)) return;
    const created = await this.$$modelAccessTokens.createMine(data.value);
    if (!this._isCurrent(generation, userId)) return;
    close();
    this._showSecret({ accessToken: created.accessToken, resource: created.resource });
    // Revealing the only copy of a new credential must not depend on list refresh succeeding.
    try {
      await this.$$modelAccessTokens.invalidateMine();
      this.listRefreshFailed = false;
    } catch {
      this.listRefreshFailed = true;
    }
  }

  private _showSecret(secret: RevealedToken) {
    this._revealedToken = secret;
    this._reveal = this.$appModal.dialog(
      {
        title: this.scope.locale.McpAccessTokenCreated(),
        onClose: () => {
          this._revealedToken = undefined;
          this._reveal = undefined;
          this._generation += 1;
        },
        slotDefault: () => (
          <div data-testid="mcp-access-token-reveal" class="flex flex-col gap-4">
            <p role="alert" class="text-sm text-warning">
              {this.scope.locale.McpAccessTokenOneTimeHelp()}
            </p>
            <label class="flex flex-col gap-2">
              <span class="label-text">{this.scope.locale.McpAccessTokenSecret()}</span>
              <textarea
                data-testid="mcp-access-token-secret"
                class="textarea textarea-bordered w-full break-all font-mono text-sm"
                readonly
                autocomplete="off"
                spellcheck={false}
                value={this._revealedToken?.accessToken ?? ''}
              />
            </label>
            <ZButton
              data-testid="mcp-access-token-copy-secret"
              class="btn btn-outline btn-sm self-start"
              onPerform={async () => {
                if (!this._revealedToken) return;
                await this.$performCommand('basic-commands:copy', {
                  text: this._revealedToken.accessToken,
                });
              }}
            >
              {this.scope.locale.McpAccessTokenCopySecret()}
            </ZButton>
            <label class="flex flex-col gap-2">
              <span class="label-text">{this.scope.locale.McpAccessTokenResource()}</span>
              <input
                data-testid="mcp-access-token-resource"
                class="input input-bordered w-full font-mono text-sm"
                type="url"
                readonly
                value={this._revealedToken?.resource ?? ''}
              />
            </label>
            <ZButton
              data-testid="mcp-access-token-copy-resource"
              class="btn btn-outline btn-sm self-start"
              onPerform={async () => {
                if (!this._revealedToken) return;
                await this.$performCommand('basic-commands:copy', {
                  text: this._revealedToken.resource,
                });
              }}
            >
              {this.scope.locale.McpAccessTokenCopyResource()}
            </ZButton>
          </div>
        ),
        slotActions: dialog => (
          <ZButton
            data-testid="mcp-access-token-reveal-close"
            class="btn btn-primary"
            onPerform={() => dialog.close()}
          >
            {this.scope.locale.Close()}
          </ZButton>
        ),
      },
      { closeOnBackdrop: false, closeOnEscape: true, maxWidth: 640, showCloseButton: true },
    );
  }

  async delete(item: AccessTokenItem) {
    const confirmed = await this.$performCommand('basic-commands:confirm', {
      text: this.scope.locale.McpAccessTokenDeleteConfirm(),
    });
    if (!confirmed) return;
    await this.$$modelAccessTokens.deleteMine(item.id).mutateAsync();
    const pageCount = this.queryTokens?.data?.pageCount;
    if (pageCount !== undefined && this.pageNo > Math.max(1, pageCount)) {
      this.pageNo = Math.max(1, pageCount);
    }
  }

  private _status(status: AccessTokenItem['status']) {
    switch (status) {
      case 'active':
        return this.scope.locale.McpAccessTokenActive();
      case 'expired':
        return this.scope.locale.McpAccessTokenExpired();
      case 'revoked':
        return this.scope.locale.McpAccessTokenRevoked();
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

  private _renderToken(item: AccessTokenItem) {
    return (
      <article
        key={item.id}
        data-testid="mcp-access-token-row"
        data-mcp-access-token-id={item.id}
        class="card border border-base-300 bg-base-100 shadow-sm"
      >
        <div class="card-body gap-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <h2 class="card-title break-words">{item.name}</h2>
            <ZButton
              data-testid="mcp-access-token-delete"
              class="btn btn-error btn-outline btn-sm"
              onPerform={() => this.delete(item)}
            >
              {this.scope.locale.Delete()}
            </ZButton>
          </div>
          <dl class="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-base-content/70">{this.scope.locale.McpAuthorizationStatus()}</dt>
              <dd>{this._status(item.status)}</dd>
            </div>
            <div>
              <dt class="text-base-content/70">{this.scope.locale.McpGrantedScope()}</dt>
              <dd class="break-all font-mono">{item.scope}</dd>
            </div>
            <div>
              <dt class="text-base-content/70">{this.scope.locale.McpAuthorizationCreated()}</dt>
              <dd>{this._renderDate(item.createdAt)}</dd>
            </div>
            <div>
              <dt class="text-base-content/70">
                {this.scope.locale.McpAuthorizationAccessExpires()}
              </dt>
              <dd>{this._renderDate(item.tokenExpiresAt)}</dd>
            </div>
          </dl>
        </div>
      </article>
    );
  }

  protected render() {
    const query = this.queryTokens;
    const data = query?.data;
    const loading = !query || query.isPending;
    return (
      <ZPage>
        <section data-testid="mcp-access-tokens" class="mx-auto max-w-4xl space-y-6 p-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 class="text-3xl font-semibold">{this.scope.locale.McpAccessTokens()}</h1>
              <p class="mt-2 text-base-content/70">{this.scope.locale.McpAccessTokensHelp()}</p>
            </div>
            <ZButton
              data-testid="mcp-access-token-create"
              class="btn btn-primary"
              onPerform={() => this.openCreate()}
            >
              {this.scope.locale.McpAccessTokenCreate()}
            </ZButton>
          </div>
          <dl class="space-y-1 text-sm">
            <dt class="text-base-content/70">{this.scope.locale.Resource()}</dt>
            <dd data-mcp-resource class="select-text break-all font-mono">
              {getMcpResource(this.sys.env)}
            </dd>
          </dl>
          <p class="text-sm text-base-content/70">{this.scope.locale.McpAccessTokenRetention()}</p>
          {loading && <p role="status">{this.scope.locale.McpAccessTokensLoading()}</p>}
          {(query?.error || this.listRefreshFailed) && (
            <div role="alert" class="alert alert-error">
              <span>{this.scope.locale.McpAccessTokensLoadFailed()}</span>
              <ZButton
                class="btn btn-sm"
                onPerform={async () => {
                  await this.queryTokens?.refetch({ throwOnError: true });
                  this.listRefreshFailed = false;
                }}
              >
                {this.scope.locale.Retry()}
              </ZButton>
            </div>
          )}
          {!loading && !query?.error && data?.list.length === 0 && (
            <p>{this.scope.locale.McpAccessTokensEmpty()}</p>
          )}
          <div class="space-y-4">{data?.list.map(item => this._renderToken(item))}</div>
          {data && data.pageCount > 0 && (
            <nav
              aria-label={this.scope.locale.McpAccessTokens()}
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
