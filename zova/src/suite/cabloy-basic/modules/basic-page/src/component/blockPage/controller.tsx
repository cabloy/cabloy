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
import { VNode } from 'vue';
import { BeanControllerBase, deepEqual } from 'zova';
import { ZovaJsx } from 'zova-jsx';
import { Controller } from 'zova-module-a-bean';
import { $QueriesAutoLoad } from 'zova-module-a-model';
import { BeanControllerTableBase } from 'zova-module-a-table';
import { ModelResource } from 'zova-module-rest-resource';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-page:blockPage'?: ControllerBlockPageProps;
  }
}

export interface ControllerBlockPageProps extends IResourceBlockOptionsBase {
  blocks?: IResourceRenderBlockOptionsBlock[];
  resource?: string;
  pageSize?: number;
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

  queryFilterData: {};
  queryPaged: ITablePaged;
  query: ITableQuery;

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
    this.queryFilterData = {};
    this.queryPaged = { pageNo: 1, pageSize: this.$props.pageSize };
    this.query = this.$computed(() => {
      return Object.assign({}, this.queryFilterData, this.queryPaged);
    });
    // load schema/data
    await $QueriesAutoLoad(
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
  }

  get resource() {
    return this.$props.resource;
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

  get schemaRow() {
    return this.$$modelResource.schemaRow;
  }

  get permissions() {
    return this.$$modelResource.permissions;
  }

  gotoPage(pageNo: number) {
    if (this.queryPaged.pageNo !== pageNo) {
      this.queryPaged.pageNo = pageNo;
    }
  }

  setPageSize(pageSize: number) {
    if (this.queryPaged.pageSize !== pageSize) {
      this.queryPaged.pageSize = pageSize;
    }
  }

  onFilter(data: any) {
    this.queryFilterData = data;
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
    return {
      resource: this.resource,
      permissions,
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
