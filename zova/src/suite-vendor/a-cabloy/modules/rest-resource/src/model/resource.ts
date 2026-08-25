import type { TableIdentity } from 'table-identity';
import type { DataMutation, IDecoratorModelOptions } from 'zova-module-a-model';
import type {
  IFormMeta,
  IFormProvider,
  ISchemaObjectExtensionField,
  ITableQuery,
  ITableRes,
  TypeOpenapiPermissions,
} from 'zova-module-a-openapi';

import { hashkey, isNil } from '@cabloy/utils';
import { SchemaObject } from 'openapi3-ts/oas31';
import { UseScope } from 'zova';
import { formSceneFromFormMeta } from 'zova-module-a-form';
import { $QueryEnsureLoaded, BeanModelBase, Model } from 'zova-module-a-model';
import { ScopeModuleAOpenapi, SymbolOpenapiSchemaName } from 'zova-module-a-openapi';

import { prepareDeleteRequestConfig } from '../lib/deleteRequest.js';

export interface IModelOptionsResource extends IDecoratorModelOptions {}

interface IModelResourceQueryItemOptions<TData> {
  id: TableIdentity;
  action: string;
  queryFn: () => Promise<TData>;
  meta?: {
    disableSuspenseOnInit?: boolean;
    disableErrorEffect?: boolean;
  };
}

interface IModelResourceMutationItemOptions<TData = void, TVariables = void> {
  id: TableIdentity;
  action: string;
  mutationFn: (params: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables, context: unknown) => void | Promise<void>;
  invalidateSelect?: boolean;
}

@Model<IModelOptionsResource>({
  enableSelector: true,
})
export class ModelResource<
  Entity = any,
  EntityCreate = Partial<Entity>,
  EntityUpdate = Partial<Entity>,
  EntityDelete = void,
> extends BeanModelBase {
  public resource: string;
  public resourceApi: string;
  public permissions?: TypeOpenapiPermissions;
  public formProvider: IFormProvider;
  public schemaView?: ISchemaObjectExtensionField;
  public schemaCreate?: ISchemaObjectExtensionField;
  public schemaUpdate?: ISchemaObjectExtensionField;
  public schemaFilter?: ISchemaObjectExtensionField;
  public schemaRow?: ISchemaObjectExtensionField;
  public schemaPages?: ISchemaObjectExtensionField;

  @UseScope()
  $$scopeOpenapi: ScopeModuleAOpenapi;

  protected async __init__(resource: string) {
    if (!resource) throw new Error('resource not specified');
    await super.__init__(resource);
    this.resource = resource;
    this.permissions = this.$computed(() => {
      if (this.$ssr.cookieDisabledOnServer) return;
      const permissions = this.$sdk.getPermissions(this.resource);
      return permissions.data;
    });
    this.formProvider = this.$computed(() => {
      return this.$$scopeOpenapi.config.formProvider;
    });
    this.schemaView = this.$computed(() => {
      return this.apiSchemasView.responseBody;
    });
    this.schemaCreate = this.$computed(() => {
      return this.apiSchemasCreate.requestBody;
    });
    this.schemaUpdate = this.$computed(() => {
      return this.apiSchemasUpdate.requestBody;
    });
    this.schemaFilter = this.$computed(() => {
      return this.apiSchemasSelect.filter;
    });
    this.schemaRow = this.$computed(() => {
      return this.apiSchemasSelect.row;
    });
    this.schemaPages = this.$computed(() => {
      return this.apiSchemasSelect.paged;
    });
    // bootstrap
    await this._bootstrap();
  }

  selectGeneral(actionPath?: string, query?: ITableQuery) {
    return this.$useStateData({
      queryKey: this.keySelect(actionPath, query),
      queryFn: async () => {
        const apiPath = actionPath ? `${this.resourceApi}/${actionPath}` : this.resourceApi;
        return this.$fetch.get<any, ITableRes<Entity>>(
          this.sys.util.apiActionPathTranslate(apiPath),
          this.sys.util.apiActionConfigPrepare(undefined, { query }),
        );
      },
    });
  }

  select(query?: ITableQuery) {
    return this.selectGeneral(undefined, query);
  }

  query<TData>(action: string, queryFn: () => Promise<TData>) {
    return this.$useStateData({
      queryKey: this.keySelect(action),
      queryFn,
    });
  }

  queryItem<TData>(options: IModelResourceQueryItemOptions<TData>) {
    const { id, action, queryFn, meta } = options;
    if (isNil(id)) throw new Error('row id cannot empty');
    return this.$useStateData({
      queryKey: this.keyItem(id, action),
      queryFn,
      meta,
    });
  }

  view(id: TableIdentity) {
    return this.queryItem<Entity | null>({
      id,
      action: 'view',
      queryFn: async () => {
        const res = await this.$fetch.get<any, Entity>(
          this.sys.util.apiActionPathTranslate(`${this.resourceApi}/:id`, { id }),
          this.sys.util.apiActionConfigPrepare(),
        );
        return res ?? null;
      },
    });
  }

  create() {
    return this.$useMutationData<void, EntityCreate>({
      mutationKey: ['create'],
      mutationFn: async params => {
        return this.$fetch.post<any, void, EntityCreate>(
          this.sys.util.apiActionPathTranslate(this.resourceApi),
          params,
          this.sys.util.apiActionConfigPrepare(),
        );
      },
      onSuccess: () => {
        this.$invalidateQueries({ queryKey: ['select'] });
      },
    });
  }

  mutationItem<TData = void, TVariables = void>(
    options: IModelResourceMutationItemOptions<TData, TVariables>,
  ) {
    const { id, action, mutationFn, onSuccess, invalidateSelect = true } = options;
    if (isNil(id)) throw new Error('row id cannot empty');
    return this.$useMutationData<TData, TVariables>({
      mutationKey: [...this.keyItem(id, action), 'mutation'],
      mutationFn,
      onSuccess: async (data, variables, context) => {
        if (invalidateSelect) {
          this.$invalidateQueries({ queryKey: ['select'] });
        }
        this.$invalidateQueries({ queryKey: this.keyItemRoot(id) });
        await onSuccess?.(data, variables, context);
      },
    });
  }

  update(id: TableIdentity) {
    return this.mutationItem<void, EntityUpdate>({
      id,
      action: 'update',
      mutationFn: async params => {
        return this.$fetch.patch<any, void, EntityUpdate>(
          this.sys.util.apiActionPathTranslate(`${this.resourceApi}/:id`, { id }),
          params,
          this.sys.util.apiActionConfigPrepare(),
        );
      },
    });
  }

  delete(id: TableIdentity) {
    return this.mutationItem<void, EntityDelete>({
      id,
      action: 'delete',
      mutationFn: async body => {
        const apiPath = this.sys.util.apiActionPathTranslate(`${this.resourceApi}/:id`, { id });
        const apiConfig = prepareDeleteRequestConfig(this.sys.util.apiActionConfigPrepare(), body);
        return this.$fetch.delete<any, void, EntityDelete>(apiPath, apiConfig);
      },
    });
  }

  public get apiSchemasSelect() {
    return this.$sdk.createApiSchemas(this.resourceApi, 'get');
  }

  public get apiSchemasView() {
    return this.$sdk.createApiSchemas(`${this.resourceApi}/:id`, 'get');
  }

  public get apiSchemasCreate() {
    return this.$sdk.createApiSchemas(this.resourceApi, 'post');
  }

  public get apiSchemasUpdate() {
    return this.$sdk.createApiSchemas(`${this.resourceApi}/:id`, 'patch');
  }

  public get apiSchemasDelete() {
    return this.$sdk.createApiSchemas(`${this.resourceApi}/:id`, 'delete');
  }

  public getFormSchema(formMeta: IFormMeta) {
    const formScene = formMeta.formScene ?? formSceneFromFormMeta(formMeta);
    if (formScene === 'view') return this.schemaView;
    if (formScene === 'create') return this.schemaCreate;
    if (formScene === 'edit') return this.schemaUpdate;
  }

  public getFormApiSchemas(formMeta: IFormMeta) {
    const formScene = formMeta.formScene ?? formSceneFromFormMeta(formMeta);
    if (formScene === 'view') return this.apiSchemasView;
    if (formScene === 'create') return this.apiSchemasCreate;
    if (formScene === 'edit') return this.apiSchemasUpdate;
    throw new Error('invalid parameters');
  }

  public getFormMutationSubmit(formMeta: IFormMeta, id?: TableIdentity): DataMutation | undefined {
    if (formMeta.formMode !== 'edit') return;
    if (formMeta.editMode === 'create') {
      return this.create() as any;
    } else if (formMeta.editMode === 'update') {
      return this.update(id!) as any;
    }
  }

  public getFormData(
    formMeta: IFormMeta,
    id?: TableIdentity,
  ): Entity | EntityCreate | EntityUpdate | undefined {
    if (formMeta.formMode === 'edit' && formMeta.editMode === 'create') {
      return this.getQueryDataDefaultValue(this.schemaCreate);
    }
    if (isNil(id)) return undefined;
    return this.view(id).data as Entity | EntityUpdate | undefined;
  }

  public getQueryDataDefaultValue(schemaName?: SchemaObject | string): EntityCreate | undefined {
    if (!schemaName) return;
    if (typeof schemaName === 'object') {
      schemaName = schemaName[SymbolOpenapiSchemaName] as string;
    }
    return this.$sdk.getSchemaDefaultValue(schemaName) as EntityCreate | undefined;
  }

  protected keySelect(actionPath?: string, query?: ITableQuery) {
    return ['select', actionPath ?? '', hashkey(query)] as const;
  }

  protected keyItemRoot(id: TableIdentity) {
    if (isNil(id)) throw new Error('row id cannot empty');
    return ['item', id] as const;
  }

  protected keyItem(id: TableIdentity, action: string) {
    if (isNil(id)) throw new Error('row id cannot empty');
    return ['item', id, action] as const;
  }

  private async _bootstrap() {
    const queryBootstrap = await $QueryEnsureLoaded(() => this.$sdk.getBootstrap(this.resource));
    if (!queryBootstrap?.data) {
      throw new Error(`not found sdk of resource: ${this.resource}`);
    }
    this.resourceApi = this.sys.util.parseResourceApi(this.resource, queryBootstrap.data.apiPath);
  }
}
