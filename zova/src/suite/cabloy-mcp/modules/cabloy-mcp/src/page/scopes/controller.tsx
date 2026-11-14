import type { TypeFormOnSubmitData } from 'zova-module-a-form';

import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZForm, ZFormField, ZFormFieldPreset } from 'zova-module-a-form';
import { $QueriesEnsureLoaded, $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZButton } from 'zova-module-basic-button';
import { ZPage } from 'zova-module-home-base';

import type {
  CatalogTool,
  PersonalScope,
  PersonalScopeDraft,
  ToolIdentity,
} from '../../model/personalScopes.ts';

import { getMcpResource } from '../../lib/mcpResource.ts';
import { ModelPersonalScopes, toolIdentityKey } from '../../model/personalScopes.ts';

@Controller()
export class ControllerPageScopes extends BeanControllerPageBase {
  @Use()
  $$modelPersonalScopes: ModelPersonalScopes;

  toolSearch = '';

  protected async __init__() {
    await $QueriesEnsureLoaded(
      () => this.queryScopes,
      () => this.queryCatalog,
    );
  }

  get queryScopes() {
    return this.$$modelPersonalScopes.mine();
  }

  get queryCatalog() {
    return this.$$modelPersonalScopes.catalog();
  }

  private _apiSchemas(editing: boolean) {
    return editing
      ? this.scope.apiSchema.mcpAuthCustomScope.updateMine()
      : this.scope.apiSchema.mcpAuthCustomScope.createMine();
  }

  async openEditor(item?: PersonalScope) {
    await $QueryEnsureLoaded(() => this._apiSchemas(!!item).sdk);
    const queryCatalog = this.queryCatalog;
    if (!queryCatalog) return;
    await queryCatalog.refetch({ throwOnError: true });
    const catalog = queryCatalog.data;
    if (!catalog) return;
    const available = new Set(catalog.map(toolIdentityKey));
    this.toolSearch = '';
    const draft: PersonalScopeDraft = item
      ? {
          name: item.name,
          description: item.description,
          tools: item.tools
            .filter(tool => available.has(toolIdentityKey(tool)))
            .map(tool => ({ ...tool })),
        }
      : { name: '', description: '', tools: [] };
    this.$appModal.dialog(
      {
        title: item ? this.scope.locale.McpScopeEdit() : this.scope.locale.McpScopeCreate(),
        slotDefault: dialog => (
          <ZForm
            data={draft}
            schema={this._apiSchemas(!!item).requestBody}
            localePresentationRefresh={{ identity: `mcp-scope:${item?.id ?? 'create'}` }}
            onSubmitData={data => this._save(data, item, dialog.close)}
            onShowError={async ({ error }) => {
              await this.$performCommand('basic-commands:alert', {
                type: 'error',
                text: error.message,
              });
            }}
            slotFooter={form => (
              <div class="flex justify-end gap-2">
                <ZButton
                  class="btn btn-ghost"
                  disabled={form.formState.isSubmitting}
                  onPerform={() => dialog.close()}
                >
                  {this.scope.locale.Cancel()}
                </ZButton>
                <ZButton
                  class="btn btn-primary"
                  disabled={form.formState.isSubmitting}
                  onPerform={async () => {
                    await form.submit();
                  }}
                >
                  {this.scope.locale.Save()}
                </ZButton>
              </div>
            )}
          >
            <ZFormFieldPreset
              name="name"
              render="basic-input:formFieldInput"
              options={{ type: 'text' }}
            />
            <p class="text-sm text-base-content/70">{this.scope.locale.McpScopeNameHelp()}</p>
            <ZFormFieldPreset
              name="description"
              render="basic-input:formFieldInput"
              options={{ type: 'text' }}
            />
            <ZFormField
              name="tools"
              slotDefault={({ propsBucket }, field) => {
                const selected = (propsBucket.value ?? []) as ToolIdentity[];
                return this._renderToolPicker(selected, tools => {
                  field.setValue(tools, propsBucket.disableNotifyChanged);
                  field.handleBlur();
                });
              }}
            />
            {item && (
              <p class="text-sm text-warning">{this.scope.locale.McpScopeAccessChangeWarning()}</p>
            )}
          </ZForm>
        ),
      },
      { closeOnBackdrop: false, closeOnEscape: false, maxWidth: 760, showCloseButton: true },
    );
  }

  private async _save(
    data: TypeFormOnSubmitData<PersonalScopeDraft>,
    item: PersonalScope | undefined,
    close: () => void,
  ) {
    if (item) {
      const before = item.tools.map(toolIdentityKey).sort();
      const after = data.value.tools.map(toolIdentityKey).sort();
      if (
        item.name.trim() !== data.value.name.trim() ||
        JSON.stringify(before) !== JSON.stringify(after)
      ) {
        const confirmed = await this.$performCommand('basic-commands:confirm', {
          text: this.scope.locale.McpScopeAccessChangeConfirm(),
        });
        if (!confirmed) return;
      }
    }
    await this.$$modelPersonalScopes.save(item?.id).mutateAsync(data.value);
    close();
  }

  async delete(item: PersonalScope) {
    const confirmed = await this.$performCommand('basic-commands:confirm', {
      text: this.scope.locale.McpScopeDeleteConfirm(),
    });
    if (!confirmed) return;
    await this.$$modelPersonalScopes.deleteMine(item.id).mutateAsync();
  }

  private _renderToolIdentity(tool: ToolIdentity, details?: CatalogTool) {
    return (
      <div class="min-w-0 space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <span class="break-words text-sm">{details?.summary?.trim() || tool.name}</span>
          {details ? (
            <span class="badge badge-outline badge-sm">
              {details.readOnly
                ? this.scope.locale.McpToolReadOnly()
                : this.scope.locale.McpToolWrites()}
            </span>
          ) : (
            <span class="badge badge-warning badge-sm">{this.scope.locale.McpToolMissing()}</span>
          )}
        </div>
        <p class="break-all font-mono text-xs text-base-content/70">
          {tool.controller} / {tool.action}
        </p>
        {details?.description && (
          <p class="whitespace-pre-wrap text-sm text-base-content/70">{details.description}</p>
        )}
      </div>
    );
  }

  private _renderToolPicker(selected: ToolIdentity[], change: (tools: ToolIdentity[]) => void) {
    const catalog = this.queryCatalog?.data ?? [];
    const keys = new Set(selected.map(toolIdentityKey));
    const available = new Set(catalog.map(toolIdentityKey));
    const missing = selected.filter(tool => !available.has(toolIdentityKey(tool)));
    const summaries = new Map(catalog.map(tool => [tool.controller, tool.controllerSummary]));
    const search = this.toolSearch.trim().toLowerCase();
    const tools = [...missing, ...catalog].filter(
      tool =>
        !search ||
        [
          tool.name,
          'summary' in tool ? tool.summary : '',
          tool.controller,
          summaries.get(tool.controller),
          tool.action,
          'description' in tool ? tool.description : '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(search),
    );
    const groups = new Map<string, typeof tools>();
    for (const tool of tools) {
      const group = groups.get(tool.controller);
      if (group) group.push(tool);
      else groups.set(tool.controller, [tool]);
    }
    return (
      <div class="space-y-3" data-mcp-tool-picker>
        <p class="text-sm text-base-content/70">{this.scope.locale.McpScopeToolsHelp()}</p>
        <label class="form-control gap-2">
          <span class="label-text">{this.scope.locale.McpScopeToolSearch()}</span>
          <input class="input input-bordered w-full" type="search" v-model={this.toolSearch} />
        </label>
        <p class="text-sm">{this.scope.locale.McpScopeSelectedTools(selected.length)}</p>
        {missing.length > 0 && (
          <p role="alert" class="text-sm text-warning">
            {this.scope.locale.McpScopeMissingToolsHelp()}
          </p>
        )}
        <div class="max-h-80 space-y-4 overflow-y-auto">
          {Array.from(groups, ([controller, group]) => (
            <fieldset key={controller} class="min-w-0 space-y-2" data-mcp-tool-group={controller}>
              <legend class="break-words text-sm font-medium">
                {summaries.get(controller)?.trim() || this.scope.locale.McpScopeOtherTools()}
              </legend>
              {group.map(tool => {
                const key = toolIdentityKey(tool);
                const details = catalog.find(entry => toolIdentityKey(entry) === key);
                return (
                  <label
                    key={key}
                    class="flex cursor-pointer items-start gap-3 rounded-box border border-base-300 p-3"
                  >
                    <input
                      class="checkbox checkbox-primary mt-1"
                      type="checkbox"
                      aria-label={details?.summary?.trim() || tool.name}
                      data-tool-name={tool.name}
                      data-tool-controller={tool.controller}
                      data-tool-action={tool.action}
                      checked={keys.has(key)}
                      onChange={event => {
                        const checked = (event.target as HTMLInputElement).checked;
                        change(
                          checked
                            ? [
                                ...selected.filter(entry => toolIdentityKey(entry) !== key),
                                {
                                  name: tool.name,
                                  controller: tool.controller,
                                  action: tool.action,
                                },
                              ]
                            : selected.filter(entry => toolIdentityKey(entry) !== key),
                        );
                      }}
                    />
                    {this._renderToolIdentity(tool, details)}
                  </label>
                );
              })}
            </fieldset>
          ))}
          {tools.length === 0 && (
            <p class="text-sm text-base-content/70">{this.scope.locale.McpScopeNoTools()}</p>
          )}
        </div>
      </div>
    );
  }

  private _renderScope(item: PersonalScope) {
    const catalog = this.queryCatalog?.data;
    return (
      <article
        key={item.id}
        data-mcp-scope={item.scope}
        class="card border border-base-300 bg-base-100 shadow-sm"
      >
        <div class="card-body gap-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <h2 class="card-title break-words">{item.name}</h2>
            <div class="flex gap-2">
              <ZButton class="btn btn-outline btn-sm" onPerform={() => this.openEditor(item)}>
                {this.scope.locale.Edit()}
              </ZButton>
              <ZButton class="btn btn-error btn-outline btn-sm" onPerform={() => this.delete(item)}>
                {this.scope.locale.Delete()}
              </ZButton>
            </div>
          </div>
          <p class="whitespace-pre-wrap text-sm">{item.description}</p>
          <p class="break-all font-mono text-xs text-base-content/70">{item.scope}</p>
          <details>
            <summary class="cursor-pointer text-sm">
              {this.scope.locale.McpScopeSelectedTools(item.tools.length)}
            </summary>
            <ul class="mt-3 space-y-3">
              {item.tools.map(tool => (
                <li key={toolIdentityKey(tool)}>
                  {catalog ? (
                    this._renderToolIdentity(
                      tool,
                      catalog.find(entry => toolIdentityKey(entry) === toolIdentityKey(tool)),
                    )
                  ) : (
                    <p class="break-all font-mono text-sm">
                      {tool.name} ({tool.controller} / {tool.action})
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </article>
    );
  }

  protected render() {
    const query = this.queryScopes;
    const list = query?.data?.list;
    return (
      <ZPage>
        <section class="mx-auto max-w-4xl space-y-6 p-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 class="text-3xl font-semibold">{this.scope.locale.McpPersonalScopes()}</h1>
              <p class="mt-2 text-base-content/70">{this.scope.locale.McpPersonalScopesHelp()}</p>
            </div>
            <ZButton class="btn btn-primary" onPerform={() => this.openEditor()}>
              {this.scope.locale.McpScopeCreate()}
            </ZButton>
          </div>
          <dl class="space-y-1 text-sm">
            <dt class="text-base-content/70">{this.scope.locale.Resource()}</dt>
            <dd data-mcp-resource class="select-text break-all font-mono">
              {getMcpResource(this.sys.env)}
            </dd>
          </dl>
          {(!query || query.isPending) && (
            <p role="status">{this.scope.locale.McpScopesLoading()}</p>
          )}
          {(query?.error || this.queryCatalog?.error) && (
            <div role="alert" class="alert alert-error">
              <span>{this.scope.locale.McpScopesLoadFailed()}</span>
              <ZButton
                class="btn btn-sm"
                onPerform={async () => {
                  await this.queryScopes?.refetch({ throwOnError: true });
                  await this.queryCatalog?.refetch({ throwOnError: true });
                }}
              >
                {this.scope.locale.Retry()}
              </ZButton>
            </div>
          )}
          {list?.length === 0 && <p>{this.scope.locale.McpScopesEmpty()}</p>}
          <div class="space-y-4">{list?.map(item => this._renderScope(item))}</div>
        </section>
      </ZPage>
    );
  }
}
