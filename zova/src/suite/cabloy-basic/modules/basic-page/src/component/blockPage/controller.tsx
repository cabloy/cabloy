import type { RowSelectionState, SortingState } from '@tanstack/vue-table';
import type { TableIdentity } from 'table-identity';
import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPage,
  IPageScope,
  IResourceBlockOptionsBase,
  IResourceRenderBlockOptionsBlock,
  ITablePaged,
  ITableQuery,
  ITableResPaged,
} from 'zova-module-a-openapi';

import { celEnvBase } from '@cabloy/utils';
import { functionalUpdate } from '@tanstack/vue-table';
import { VNode } from 'vue';
import { BeanControllerBase, deepEqual } from 'zova';
import { ZovaJsx } from 'zova-jsx';
import { Controller } from 'zova-module-a-bean';
import { $QueriesEnsureLoaded } from 'zova-module-a-model';
import { BeanControllerTableBase } from 'zova-module-a-table';
import { ModelResource } from 'zova-module-rest-resource';

import { reconcileSelection, selectionKey, selectionRowId } from '../../lib/selection.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-page:blockPage'?: ControllerBlockPageProps;
  }
}

export interface ControllerBlockPageProps extends IResourceBlockOptionsBase {
  blocks?: IResourceRenderBlockOptionsBlock[];
  resource?: string;
  pageSize?: number;
  queryFixed?: ITableQuery;
  selectionPolicy?: 'always' | 'onDemand' | false;
}

@Controller()
export class ControllerBlockPage<TData extends {} = {}> extends BeanControllerBase {
  static $propsDefault = {
    pageSize: 20,
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  tableRef: BeanControllerTableBase<TData> | undefined;
  private _tableMetaRefreshPending = false;
  private _tableMetaRefreshTask: Promise<void> | undefined;

  jsxZova: ZovaJsx;
  jsxCelScope: IPageScope;
  jsxRenderContext: IJsxRenderContextPage<TData>;

  queryFixedData: ITableQuery;
  queryFilterData: ITableQuery;
  querySortingData: ITableQuery;
  sorting: SortingState;
  queryPaged: ITablePaged;

  rowSelection: RowSelectionState;
  selectedIds: TableIdentity[];
  selectedRows: Map<string, TData>;
  selectionVisible = false;
  selectionRequiredCount = 0;

  $$modelResource: ModelResource<TData>;

  protected async __init__() {
    this.$$modelResource = await this.bean._getBeanSelector(
      'rest-resource.model.resource',
      true,
      this.resource,
    );
    // jsx
    this._prepareJsx();
    // query
    this.queryFixedData = this.$props.queryFixed ?? {};
    this.queryFilterData = {};
    this.querySortingData = {};
    this.sorting = [];
    this.rowSelection = {};
    this.selectedIds = [];
    this.selectedRows = new Map();
    this.$watch(
      () => this.$props.queryFixed,
      queryFixed => {
        this.setQueryFixed(queryFixed);
      },
    );
    this.$watch(
      () => this.$props.resource,
      (resource, oldResource) => {
        if (resource === oldResource) return;
        this.clearSelection();
        this.selectionVisible = false;
      },
    );
    this.queryPaged = { pageNo: 1, pageSize: this.$props.pageSize };
    // load schema/data
    await $QueriesEnsureLoaded(
      () => this.$$modelResource.apiSchemasSelect.sdk,
      () => this.queryData,
    );
    // watch
    this.$watch(
      () => this.permissions,
      async (newValue, oldValue) => {
        if (deepEqual(newValue, oldValue)) return;
        await this._requestTableMetaRefresh();
      },
    );
    this.$watch(
      () => this.data,
      data => {
        this._refreshSelectedRows((data ?? []) as unknown as Record<string, unknown>[]);
      },
    );
  }

  get resource() {
    return this.$props.resource;
  }

  get query() {
    const { where: whereFixed, ...queryFixed } = this.queryFixedData;
    const { where: whereFilter, ...queryFilter } = this.queryFilterData;
    return {
      ...queryFixed,
      ...queryFilter,
      ...this.querySortingData,
      where: { ...whereFilter, ...whereFixed },
      ...this.queryPaged,
    };
  }

  get queryData() {
    return this.$$modelResource.select(this.query);
  }

  get data() {
    return this.queryData.data?.list;
  }

  get paged(): ITableResPaged | undefined {
    return this.queryData.data;
  }

  get schemaFilter() {
    return this.$$modelResource.schemaFilter;
  }

  get schemaOrder() {
    return this.$$modelResource.schemaOrder;
  }

  get schemaRow() {
    return this.$$modelResource.schemaRow;
  }

  get permissions() {
    return this.$$modelResource.permissions;
  }

  get selection() {
    return {
      ids: this.selectedIds,
      rows: this.selectedIds.flatMap(id => {
        const row = this.selectedRows.get(selectionKey(id));
        return row ? [row] : [];
      }),
      count: this.selectedIds.length,
    };
  }

  get selectionAvailable() {
    const policy = this.$props.selectionPolicy;
    return (
      policy === 'always' ||
      policy === 'onDemand' ||
      (policy === undefined && this.selectionRequiredCount > 0)
    );
  }

  get selectionToggleAvailable() {
    return this.selectionAvailable && this.$props.selectionPolicy !== 'always';
  }

  get selectionEnabled() {
    const policy = this.$props.selectionPolicy;
    return policy === 'always' || (this.selectionVisible && policy !== false);
  }

  onRowSelectionChange(
    updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState),
  ) {
    const data = (this.data ?? []) as unknown as Record<string, unknown>[];
    const next = functionalUpdate(updater, this.rowSelection);
    this.rowSelection = reconcileSelection(this.rowSelection, data, next);
    this._reconcileSelectedRows(data);
  }

  clearSelection() {
    this.rowSelection = {};
    this.selectedIds = [];
    this.selectedRows = new Map();
  }

  private _refreshSelectedRows(data: readonly Record<string, unknown>[]) {
    if (this.selectedIds.length === 0) return;
    this._reconcileSelectedRows(data);
  }

  private _reconcileSelectedRows(data: readonly Record<string, unknown>[]) {
    const selectedIds = [...this.selectedIds];
    const selectedRows = new Map(this.selectedRows);
    for (const row of data) {
      const id = selectionRowId(row);
      const key = selectionKey(id);
      if (this.rowSelection[key]) {
        if (!selectedIds.some(selectedId => selectionKey(selectedId) === key)) {
          selectedIds.push(id);
        }
        selectedRows.set(key, row as TData);
      } else {
        const index = selectedIds.findIndex(selectedId => selectionKey(selectedId) === key);
        if (index !== -1) selectedIds.splice(index, 1);
        selectedRows.delete(key);
      }
    }
    this.selectedIds = selectedIds;
    this.selectedRows = selectedRows;
  }

  toggleSelection() {
    if (this.selectionVisible) {
      this.clearSelection();
    }
    this.selectionVisible = !this.selectionVisible;
  }

  setSelectionRequired(required: boolean) {
    this.selectionRequiredCount += required ? 1 : -1;
    if (this.selectionRequiredCount < 0) this.selectionRequiredCount = 0;
  }

  clearSelectionAfterMutation(ids: readonly TableIdentity[]) {
    const keys = new Set(ids.map(selectionKey));
    if (keys.size === 0) return;
    this.rowSelection = Object.fromEntries(
      Object.entries(this.rowSelection).filter(([key]) => !keys.has(key)),
    );
    this.selectedIds = this.selectedIds.filter(id => !keys.has(selectionKey(id)));
    this.selectedRows = new Map([...this.selectedRows].filter(([key]) => !keys.has(key)));
  }

  gotoPage(pageNo: number) {
    if (this.queryPaged.pageNo !== pageNo) {
      this.queryPaged.pageNo = pageNo;
    }
  }

  setPageSize(pageSize: number) {
    if (this.queryPaged.pageSize !== pageSize) {
      this.clearSelection();
      this.queryPaged.pageSize = pageSize;
      this.queryPaged.pageNo = 1;
    }
  }

  setQueryFixed(queryFixed?: ITableQuery) {
    const next = queryFixed ?? {};
    if (deepEqual(this.queryFixedData, next)) return;
    this.clearSelection();
    this.queryFixedData = next;
    this.queryPaged.pageNo = 1;
  }

  onFilter(data: ITableQuery) {
    if (deepEqual(this.queryFilterData, data)) return;
    this.clearSelection();
    this.queryFilterData = data;
    this.queryPaged.pageNo = 1;
  }

  onSortingChange(updater: SortingState | ((old: SortingState) => SortingState)) {
    const sorting = functionalUpdate(updater, this.sorting).slice(0, 1);
    if (deepEqual(this.sorting, sorting)) return;
    this.clearSelection();
    this.sorting = sorting;
    const first = this.sorting[0];
    this.querySortingData = first ? { orders: [[first.id, first.desc ? 'desc' : 'asc']] } : {};
    this.queryPaged.pageNo = 1;
  }

  public setTableRef(tableRef: BeanControllerTableBase<TData> | undefined) {
    this.tableRef = tableRef;
    if (!tableRef || !this._tableMetaRefreshPending) return;
    this._scheduleTableMetaRefresh();
  }

  private _scheduleTableMetaRefresh() {
    void this._flushTableMetaRefresh().catch(err => {
      this.$errorHandler(err, 'ControllerBlockPage.setTableRef');
    });
  }

  private async _requestTableMetaRefresh() {
    this._tableMetaRefreshPending = true;
    await this._flushTableMetaRefresh();
  }

  private async _flushTableMetaRefresh() {
    if (this._tableMetaRefreshTask) return await this._tableMetaRefreshTask;
    const task = (async () => {
      while (this._tableMetaRefreshPending) {
        const tableRef = this.tableRef;
        if (!tableRef) return;
        this._tableMetaRefreshPending = false;
        await tableRef.refreshMeta();
      }
    })();
    this._tableMetaRefreshTask = task;
    try {
      await task;
    } finally {
      this._tableMetaRefreshTask = undefined;
      if (this._tableMetaRefreshPending && this.tableRef) {
        this._scheduleTableMetaRefresh();
      }
    }
  }

  private _prepareJsx() {
    const jsxCelEnv = celEnvBase.clone();
    this.jsxZova = this.bean._newBeanSimple(ZovaJsx, false, undefined, jsxCelEnv);
    this.jsxCelScope = this._prepareJsxCelScope();
    this.jsxRenderContext = {
      app: this.app,
      ctx: this.ctx,
      $scene: 'page',
      $host: this,
      $celScope: this.jsxCelScope,
      $jsx: this.jsxZova,
      $$page: this,
    };
  }

  private _prepareJsxCelScope(): IPageScope {
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
    const selection = this.$customRef(() => {
      return {
        get() {
          return self.selection;
        },
        set(_value) {},
      };
    }) as any;
    return {
      resource: this.resource,
      permissions,
      selection,
    };
  }

  protected render() {
    return <div class={this.$props.class}>{this._renderBlocks()}</div>;
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
