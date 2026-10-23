import type { IComponentOptions } from 'zova';
import type {
  IFormMeta,
  IFormProvider,
  IJsxRenderContextPageEntry,
  IPageEntryScope,
  IResourceBlockOptionsBase,
  IResourceRenderBlockOptionsBlock,
  TypeFormScene,
  TypeFormSchemaScene,
} from 'zova-module-a-openapi';

import { celEnvBase, isNil } from '@cabloy/utils';
import { SchemaObject } from 'openapi3-ts/oas31';
import { TableIdentity } from 'table-identity';
import { VNode } from 'vue';
import { BeanControllerBase, deepEqual, deepExtend } from 'zova';
import { ZovaJsx } from 'zova-jsx';
import { Controller } from 'zova-module-a-bean';
import {
  BeanControllerFormBase,
  formMetaFromFormScene,
  TypeFormOnSubmitData,
} from 'zova-module-a-form';
import { $QueriesEnsureLoaded } from 'zova-module-a-model';
import { ZButton } from 'zova-module-basic-button';
import { ModelResource } from 'zova-module-rest-resource';

import type { BeanDraftCoordinator } from '../../bean/bean.draftCoordinator.js';
import type { IDraftEditor, IDraftEnvelope, IDraftIdentity } from '../../types/draft.js';

import {
  createDraftSchema,
  draftBaselineSignature,
  projectDraftValues,
  restoreDraftValues,
} from '../../lib/draftSchema.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-pageentry:blockPageEntry'?: ControllerBlockPageEntryProps;
  }
}

export interface ControllerBlockPageEntryProps extends IResourceBlockOptionsBase {
  blocks?: IResourceRenderBlockOptionsBlock[];
  resource?: string;
  id?: TableIdentity;
  formScene?: TypeFormScene;
  pageTitleKey?: string;
  draft?: boolean;
}

@Controller()
export class ControllerBlockPageEntry<TData extends {} = {}> extends BeanControllerBase {
  static $propsDefault = { pageTitleKey: 'name' };
  static $componentOptions: IComponentOptions = {
    inheritAttrs: false,
    deepExtendDefault: true,
    boundary: { retry: true },
  };

  entryIdCreated?: TableIdentity;

  formRef: BeanControllerFormBase;

  formMeta: IFormMeta;
  formProvider: IFormProvider;
  formSchema?: SchemaObject;
  formData?: TData;
  editorData?: TData;
  draftCandidate?: IDraftEnvelope;
  draftActive = false;
  draftError?: 'storage' | 'incompatible' | 'recover';
  private _baseline?: TData;
  private _dirty = false;
  private _draftStarted = false;
  private _draftDisposed = false;
  private _draftSession = 0;
  private _draftInputRevision = 0;
  private _draftSaveRevision = 0;
  private _draftRecoveryRevision = 0;
  private _draftRemovalPending = false;
  private _draftDiscardState?: { candidate: boolean; inputRevision: number };
  private _draftCoordinator?: BeanDraftCoordinator;
  private _draftIdentity?: IDraftIdentity;
  private _draftEditor?: IDraftEditor;
  private _offDraftDiscard?: () => void;

  jsxZova: ZovaJsx;
  jsxCelScope: IPageEntryScope;
  jsxRenderContext: IJsxRenderContextPageEntry<TData>;

  $$modelResource: ModelResource<TData>;

  protected async __init__() {
    this.$$modelResource = await this.bean._getBeanSelector(
      'rest-resource.model.resource',
      true,
      this.resource,
    );
    this.formMeta = this.$computed(() => {
      const formScene = this.formScene;
      return { ...formMetaFromFormScene(formScene), formScene };
    });
    this.formProvider = this.$computed(() => {
      return this.$$modelResource.formProvider;
    });
    this.formSchema = this.$computed(() => {
      return this.$$modelResource.getFormSchema(this.formMeta);
    });
    this.formData = this.$computed(() => {
      return this.projectFormData(
        this.$$modelResource.getFormData(this.formMeta, this.entryId) as TData | undefined,
      );
    });
    // jsx
    this._prepareJsx();
    // load schema/data
    await $QueriesEnsureLoaded(
      () => this.$$modelResource.getFormApiSchemas(this.formMeta)?.sdk,
      () => this.queryData,
    );
    this._setEditorBaseline(this.formData);
    this.$watch(
      () => this.formData,
      (newValue, oldValue) => {
        if (
          deepEqual(newValue, oldValue) ||
          this._dirty ||
          (!newValue && this.formMeta.editMode === 'create')
        ) {
          return;
        }
        this._setEditorBaseline(newValue);
      },
    );
    this.$ssr.handleDirectOrOnHydrated(() => {
      // Client navigation can finish loading the edit schema after the form mounts.
      this.$watch(
        () => this._draftEnabled && !!this.$pageRoute,
        ready => {
          if (ready) void this._startDraft();
        },
        { immediate: true },
      );
    });
  }

  protected __dispose__() {
    this._draftDisposed = true;
    ++this._draftSession;
    this._offDraftDiscard?.();
  }

  protected projectFormData(data: TData | undefined): TData | undefined {
    return data;
  }

  private _setEditorBaseline(data: TData | undefined) {
    this._baseline = data ? deepExtend({}, data) : undefined;
    this.editorData = this._baseline;
    this.setPageMeta(data, false);
  }

  formReady(form: BeanControllerFormBase) {
    this.formRef = form;
    this.$ssr.handleDirectOrOnHydrated(() => {
      void this._startDraft();
      if (form && this._draftEditor && this._dirty && !this.draftCandidate) {
        void this._saveDraft(form.formState.values as TData);
      }
    });
  }

  formChanged(data: TData) {
    ++this._draftInputRevision;
    ++this._draftRecoveryRevision;
    this._dirty = true;
    this.draftCandidate = undefined;
    if (this.draftError !== 'storage') this.draftError = undefined;
    this.setPageMeta(data, true);
    void this._saveDraft(data);
  }

  formSchemaRefreshed(data: TData) {
    if (!this._dirty) return;
    this.setPageMeta(data, true);
    if (!this.draftCandidate) void this._saveDraft(data);
  }

  private _draftCurrent(session: number, editor: IDraftEditor) {
    return (
      !this._draftDisposed &&
      session === this._draftSession &&
      editor === this._draftEditor &&
      !!this._draftCoordinator?.current(editor)
    );
  }

  async retryDraftStorage() {
    if (this._draftRemovalPending) {
      if (this._draftDiscardState) {
        await this.discardDraft();
      } else if (await this._removeDraft()) {
        if (this._dirty && this.formRef) {
          await this._saveDraft(this.formRef.formState.values as TData);
        }
      }
    } else if (!this._draftEditor) {
      this._draftStarted = false;
      await this._startDraft();
    } else if (this._dirty && !this.draftCandidate && this.formRef) {
      await this._saveDraft(this.formRef.formState.values as TData);
    } else {
      // A failed initial read needs a fresh load, not an empty replacement.
      this._draftEditor = undefined;
      this._draftStarted = false;
      await this._startDraft();
    }
  }

  private _getDraftSchema() {
    if (!this.formSchema) return;
    return createDraftSchema(this.formSchema, {
      scene: this.schemaScene,
      loadProperties: (schema, scene) => this.$sdk.loadSchemaProperties(schema, scene),
      resolveSchema: reference => this.$sdk.getSchema(reference).data,
    });
  }

  private get _draftEnabled() {
    const config = this.scope.config.draft;
    return (
      this.formMeta.formMode === 'edit' &&
      config.enabled &&
      this.$props.draft !== false &&
      config.resources[this.resource!] !== false &&
      this._getDraftSchema()?.enabled
    );
  }

  private async _startDraft() {
    if (
      !process.env.CLIENT ||
      this._draftDisposed ||
      this._draftStarted ||
      !this._draftEnabled ||
      !this.$pageRoute
    ) {
      return;
    }
    this._draftStarted = true;
    const session = ++this._draftSession;
    try {
      const coordinator = await this.app.bean._getBean(
        'basic-pageentry.bean.draftCoordinator',
        true,
      );
      const identity = coordinator.identity(
        this.$router,
        this.$pageRoute.fullPath,
        this.resource,
        this.formMeta.editMode === 'create' ? 'create' : 'edit',
        this.entryId,
      );
      if (!identity || this._draftDisposed || session !== this._draftSession) return;
      this._draftCoordinator = coordinator;
      this._draftIdentity = identity;
      const editor = await coordinator.open(identity);
      if (!editor || this._draftDisposed || session !== this._draftSession) return;
      this._draftEditor = editor;
      this._offDraftDiscard?.();
      this._offDraftDiscard = this.app.meta.event.on('a-router:routeDiscard', (event, next) => {
        if (event.items.some(item => event.router.resolve(item.fullPath).path === identity.path)) {
          ++this._draftSession;
          this._draftEditor = undefined;
          this.draftCandidate = undefined;
          this.draftActive = false;
          this.draftError = undefined;
        }
        return next();
      });
      this.draftError = editor.owner.failed ? 'storage' : undefined;
      // Input that arrived during discovery owns the draft, not the late snapshot.
      if (this._draftInputRevision > 0) {
        if (this.formRef) await this._saveDraft(this.formRef.formState.values as TData);
        return;
      }
      const snapshot = editor.owner.snapshot;
      if (snapshot) {
        this.draftCandidate = snapshot;
        if (
          snapshot.version !== 1 ||
          !Number.isFinite(snapshot.savedAt) ||
          snapshot.savedAt + this.scope.config.draft.maxAge <= Date.now()
        ) {
          if (await this._removeDraft()) {
            if (this._dirty && this.formRef) {
              await this._saveDraft(this.formRef.formState.values as TData);
            }
          }
        } else if (
          !editor.owner.failed &&
          snapshot.schemaSignature !== this._getDraftSchema()?.signature
        ) {
          this.draftError = 'incompatible';
        }
      }
    } catch {
      if (!this._draftDisposed && session === this._draftSession) {
        this.draftError = 'storage';
        this._draftStarted = false;
      }
    }
  }

  private async _saveDraft(data: TData) {
    const revision = ++this._draftSaveRevision;
    const session = this._draftSession;
    const editor = this._draftEditor;
    const identity = this._draftIdentity;
    const coordinator = this._draftCoordinator;
    const schema = this._getDraftSchema();
    if (
      !editor ||
      !identity ||
      !coordinator ||
      !schema?.enabled ||
      !this._draftEnabled ||
      !this._draftCurrent(session, editor)
    ) {
      return;
    }
    try {
      const envelope: IDraftEnvelope = {
        version: 1,
        savedAt: Date.now(),
        schemaSignature: schema.signature,
        baselineSignature:
          identity.mode === 'edit' ? draftBaselineSignature(schema, this._baseline) : undefined,
        projection: projectDraftValues(schema, data, this._baseline),
      };
      await coordinator.save(editor, identity, envelope);
      if (!this._draftCurrent(session, editor) || revision !== this._draftSaveRevision) return;
      this.draftError = editor.owner.failed ? 'storage' : undefined;
      this.draftActive = !editor.owner.failed;
    } catch {
      if (this._draftCurrent(session, editor) && revision === this._draftSaveRevision) {
        this.draftError = 'storage';
      }
    }
  }

  async recoverDraft() {
    const candidate = this.draftCandidate;
    const editor = this._draftEditor;
    const session = this._draftSession;
    const inputRevision = this._draftInputRevision;
    const recoveryRevision = ++this._draftRecoveryRevision;
    if (!candidate || !editor || !this.formRef || !this._draftEnabled) return;
    const current = () =>
      this._draftCurrent(session, editor) &&
      this.draftCandidate === candidate &&
      inputRevision === this._draftInputRevision &&
      recoveryRevision === this._draftRecoveryRevision;
    if (!current()) return;
    try {
      if (
        this._dirty &&
        !(await this.$performCommand('basic-commands:confirm', {
          text: this.scope.locale.DraftReplaceConfirm(),
        }))
      ) {
        return;
      }
      if (!current()) return;
      let baseline = this._baseline;
      if (this._draftIdentity?.mode === 'edit') {
        const result = await this.queryData!.refetch({ throwOnError: true });
        baseline = this.projectFormData(result.data as TData | undefined);
      }
      if (!current()) return;
      const schema = this._getDraftSchema();
      if (
        !baseline ||
        !schema?.enabled ||
        candidate.schemaSignature !== schema.signature ||
        candidate.savedAt + this.scope.config.draft.maxAge <= Date.now() ||
        (this._draftIdentity?.mode === 'edit' &&
          candidate.baselineSignature !== draftBaselineSignature(schema, baseline))
      ) {
        this.draftError = 'incompatible';
        return;
      }
      const values = restoreDraftValues(schema, candidate.projection, baseline);
      if (!values) {
        this.draftError = 'incompatible';
        return;
      }
      this._baseline = deepExtend({}, baseline);
      this.formRef.reset(values, { keepDefaultValues: true });
      this.draftCandidate = undefined;
      this.draftError = undefined;
      this.draftActive = true;
      this._dirty = true;
      this.setPageMeta(values, true);
    } catch (error: any) {
      if (!current()) return;
      this.draftError = [403, 404].includes(error?.code ?? error?.response?.status)
        ? 'incompatible'
        : 'recover';
    }
  }

  async discardDraft() {
    const state = this._draftDiscardState ?? {
      candidate: !!this.draftCandidate,
      inputRevision: this._draftInputRevision,
    };
    this._draftDiscardState = state;
    if (!(await this._removeDraft())) return;
    this._draftDiscardState = undefined;
    if (!state.candidate && state.inputRevision === this._draftInputRevision && this._baseline) {
      this.formRef?.reset(this._baseline);
      this._dirty = false;
      this.setPageMeta(this._baseline, false);
    } else if (this._dirty && this.formRef) {
      await this._saveDraft(this.formRef.formState.values as TData);
    }
  }

  private async _removeDraft() {
    if (!this._draftIdentity || !this._draftCoordinator) return true;
    const session = ++this._draftSession;
    this._draftRemovalPending = true;
    this._draftEditor = undefined;
    try {
      await this._draftCoordinator.remove(this._draftIdentity);
      if (this._draftDisposed || session !== this._draftSession) return false;
      const editor = await this._draftCoordinator.open(this._draftIdentity);
      if (!editor || this._draftDisposed || session !== this._draftSession) return false;
      this._draftEditor = editor;
      this._draftRemovalPending = false;
      this.draftCandidate = undefined;
      this.draftActive = false;
      this.draftError = undefined;
      return true;
    } catch {
      if (!this._draftDisposed && session === this._draftSession) this.draftError = 'storage';
      return false;
    }
  }

  get resource() {
    return this.$props.resource;
  }

  get entryId() {
    return this.$props.id;
  }

  get formScene() {
    return (
      (this.$props.formScene as TypeFormScene | undefined) ??
      (isNil(this.entryId) ? 'create' : 'view')
    );
  }

  get schemaScene(): TypeFormSchemaScene {
    if (this.formMeta.formMode === 'view') return 'form-view';
    if (this.formMeta.editMode === 'create') return 'form-create';
    return 'form';
  }

  get queryData() {
    if (isNil(this.entryId)) return;
    return this.$$modelResource.view(this.entryId);
  }

  private _prepareJsx() {
    const jsxCelEnv = celEnvBase.clone();
    this.jsxZova = this.bean._newBeanSimple(
      ZovaJsx,
      false,
      this.formProvider.components,
      jsxCelEnv,
    );
    this.jsxCelScope = this._prepareJsxCelScope();
    this.jsxRenderContext = {
      app: this.app,
      ctx: this.ctx,
      $scene: 'pageEntry',
      $host: this,
      $celScope: this.jsxCelScope,
      $jsx: this.jsxZova,
      $$pageEntry: this,
    };
  }

  private _prepareJsxCelScope(): IPageEntryScope {
    // eslint-disable-next-line
    const self = this;
    const permissions = this.$customRef(() => {
      return {
        get() {
          return self.$$modelResource.permissions;
        },
        set(_value) {},
      };
    }) as any;
    return {
      resource: this.resource,
      id: this.entryId ?? null,
      permissions,
    };
  }

  async submitData(data: TypeFormOnSubmitData<TData>) {
    const mutationSubmit = this.$$modelResource.getFormMutationSubmit(this.formMeta, this.entryId);
    if (!mutationSubmit) throw new Error('Resource form has no submit mutation');
    this.entryIdCreated = (await mutationSubmit.mutateAsync(data.value as any)) as TableIdentity;
    this._dirty = false;
    await this._removeDraft();
    this.setPageMeta(data.value, false);
  }

  setPageMeta(data: any | undefined, pageDirty?: boolean) {
    if (!this.$pageRoute) return;
    const pageTitle = data?.[this.$props.pageTitleKey] || this.formSchema?.title;
    this.$router.setPageMeta(this.$pageRoute, { pageTitle, pageDirty, formMeta: this.formMeta });
  }

  protected render() {
    const data = this.formMeta.editMode === 'create' ? this.editorData : this.formData;
    if (!data) {
      return (
        <div>
          {this._renderDraft()}
          {this._renderDraftStorage()}
          <div>{this.scope.locale.EntryNotExist()}</div>
        </div>
      );
    }
    return (
      <div class={this.$props.class}>
        {this._renderDraft()}
        {this._renderDraftStorage()}
        {this._renderFormWrapper()}
      </div>
    );
  }

  private get _draftVisible() {
    return (
      process.env.CLIENT &&
      !this._draftDisposed &&
      !this.$ssr.isRuntimeSsrPreHydration &&
      this._draftEnabled &&
      this.$passport.isAuthenticated &&
      !!this._draftIdentity &&
      this._draftCoordinator?.isCurrent(this._draftIdentity)
    );
  }

  private _renderDraft() {
    if (!this._draftVisible || !this.draftCandidate) return;
    const locale = this.scope.locale;
    const error =
      this.draftError === 'incompatible'
        ? locale.DraftIncompatible()
        : this.draftError === 'recover'
          ? locale.DraftRecoverFailed()
          : undefined;
    return (
      <div class="alert mb-3" role="status" data-testid="resource-draft">
        <div>
          <div>{error ?? locale.DraftAvailable()}</div>
          {Number.isFinite(this.draftCandidate.savedAt) && (
            <time datetime={new Date(this.draftCandidate.savedAt).toISOString()}>
              {new Date(this.draftCandidate.savedAt).toLocaleString(this.app.meta.locale.current)}
            </time>
          )}
        </div>
        {this.formData && this.formRef && (
          <ZButton
            type="button"
            class="btn btn-sm btn-primary"
            onPerform={() => this.recoverDraft()}
          >
            {locale.DraftRecover()}
          </ZButton>
        )}
        <ZButton type="button" class="btn btn-sm" onPerform={() => this.discardDraft()}>
          {locale.DraftDiscard()}
        </ZButton>
      </div>
    );
  }

  private _renderDraftStorage() {
    if (!this._draftVisible || this.draftError !== 'storage') return;
    return (
      <div
        class="mb-3 flex items-center gap-2 text-sm"
        role="status"
        data-testid="resource-draft-storage"
      >
        <span>{this.scope.locale.DraftStorageFailed()}</span>
        <ZButton
          type="button"
          class="btn btn-ghost btn-xs"
          onPerform={() => this.retryDraftStorage()}
        >
          {this.scope.locale.DraftRetry()}
        </ZButton>
      </div>
    );
  }

  private _renderFormWrapper() {
    return (
      <form
        onSubmit={(e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          this.formRef?.submit();
        }}
      >
        {this._renderBlocks()}
        <button type="submit" style={{ display: 'none' }}></button>
      </form>
    );
  }

  private _renderBlocks() {
    const blocks = this.$props.blocks;
    if (!blocks || blocks.length === 0) return;
    const domBlocks: VNode[] = [];
    blocks.forEach((block, index) => {
      const options = Object.assign({ key: index }, block.options);
      const domBlock = this.jsxZova.render(
        block.render!,
        options,
        this.jsxCelScope,
        this.jsxRenderContext,
      );
      if (!domBlock) return;
      if (Array.isArray(domBlock)) {
        domBlocks.push(...domBlock);
      } else {
        domBlocks.push(domBlock);
      }
    });
    return domBlocks;
  }
}
