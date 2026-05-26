import type {
  IResourceTableActionRowOptionsBase,
  ISchemaObjectExtensionField,
  ISchemaObjectExtensionFieldRest,
  TypeTableCellRenderComponent,
  TypeTableCellRenderComponentProvider,
} from 'zova-module-a-openapi';

import { celEnvBase, isNilOrEmptyString } from '@cabloy/utils';
import {
  CellContext,
  createColumnHelper,
  getCoreRowModel,
  TableOptionsWithReactiveData,
} from '@tanstack/vue-table';
import { SchemaObject } from 'openapi3-ts/oas31';
import { VNode } from 'vue';
import {
  appResource,
  beanFullNameFromOnionName,
  cast,
  deepEqual,
  deepExtend,
  objectAssignReactive,
} from 'zova';
import { isJsxComponent, ZovaJsx } from 'zova-jsx';
import { Controller } from 'zova-module-a-bean';

import type { ITableMeta, TypeColumn, TypeTableGetColumns } from '../../types/table.js';
import type {
  IDecoratorTableCellOptions,
  IJsxRenderContextTableCell,
  ITableCellRender,
} from '../../types/tableCell.js';

import { BeanControllerTableBase } from '../../lib/beanControllerTableBase.js';
import {
  ITableCellRenderColumnOptions,
  type IJsxRenderContextTableColumn,
  type ITableCellRenderColumnProps,
  type ITableCellScope,
  type ITableColumnScope,
  type ITableScope,
  type TypeTableCellRender,
} from '../../types/tableColumn.js';

export interface ControllerTableProps<TData extends {} = {}> {
  data?: TData[];
  schema?: SchemaObject;
  tableScope?: ITableScope;
  getColumns?: TypeTableGetColumns<TData>;
  slotDefault?: (table: ControllerTable<TData>) => VNode;
}

@Controller()
export class ControllerTable<TData extends {} = {}> extends BeanControllerTableBase<TData> {
  static $propsDefault = {};

  // table: TypeTable<TData>; // in BeanControllerTableBase

  properties: ISchemaObjectExtensionField[] | undefined;
  columns: TypeColumn<TData>[];
  tableMeta: ITableMeta<TData>;
  zovaJsx: ZovaJsx;
  columnCelEnv: typeof celEnvBase;

  protected async __init__() {
    this.bean._setBean('$$table', this);
    // jsx
    this.columnCelEnv = this._getColumnCelEnv();
    this.zovaJsx = this.bean._newBeanSimple(ZovaJsx, false, undefined, this.columnCelEnv);
    // properties
    this._createProperties();
    // tableMeta/columns
    await this.refreshMeta();
    // watch
    this.$watch(
      () => this.$props.schema,
      async (newValue, oldValue) => {
        if (deepEqual(newValue, oldValue)) return;
        await this.refreshMeta();
      },
    );
    // table
    this._createTable();
  }

  get schema() {
    return this.$props.schema;
  }

  get data() {
    return this.$props.data;
  }

  public async refreshMeta() {
    this.tableMeta = await this._createTableMeta();
    this.columns = await this._createColumns();
  }

  private _createTable() {
    // eslint-disable-next-line
    const self = this;
    const tableOptions: TableOptionsWithReactiveData<TData> = {
      getRowId: (row: TData) => cast(row).id,
      getCoreRowModel: getCoreRowModel(),
      renderFallbackValue: this.scope.config.renderFallbackValue,
      manualPagination: true,
      get data() {
        return self.data || [];
      },
      get columns() {
        return self.columns;
      },
    };
    this.table = this.$useTable(tableOptions);
  }

  private async _createColumns() {
    if (!this.properties) return [];
    if (!this.$props.getColumns) return await this._createColumnsMiddle(this.tableMeta.properties);
    return await this.$props.getColumns(
      async properties => {
        return await this._createColumnsMiddle(properties ?? this.tableMeta.properties);
      },
      async (
        key: string,
        render: TypeTableCellRenderComponent,
      ): Promise<TypeTableCellRender<TData, any> | undefined> => {
        // columnScope
        const columnScope = this.getColumnScope(key);
        // renderContext
        const jsxRenderContext = this.getColumnJsxRenderContext(columnScope);
        // columnProps
        const { visible, columnProps } = this.getColumnComponentPropsTop(
          key,
          columnScope,
          jsxRenderContext,
        );
        // visible
        if (visible === false) return;
        return await this._createColumnRender(render, columnProps, columnScope, jsxRenderContext);
      },
      this,
    );
  }

  private async _createColumnsMiddle(
    properties: ISchemaObjectExtensionField[],
  ): Promise<TypeColumn<TData>[]> {
    const tableMeta = this.tableMeta;
    const columnHelper = createColumnHelper<TData>();
    const columns: TypeColumn<TData>[] = [];
    for (const property of properties) {
      const key = property.key!;
      columns.push(
        columnHelper.accessor(key as any, {
          id: key,
          header: _props => {
            return property?.title || key;
          },
          cell: props => tableMeta.renders[key](props),
        }),
      );
    }
    return columns;
  }

  private _createProperties() {
    this.properties = this.$computed(() => {
      return this.$sdk.loadSchemaProperties(this.schema, 'table');
    });
  }

  private async _createTableMeta() {
    let properties: ISchemaObjectExtensionField[] = [];
    const renders: Record<string, TypeTableCellRender<TData>> = {};
    if (!this.properties) return { properties, renders };
    const promises: Promise<any>[] = [];
    for (const property of this.properties) {
      const key = property.key!;
      // columnScope
      const columnScope = this.getColumnScope(key);
      // renderContext
      const jsxRenderContext = this.getColumnJsxRenderContext(columnScope);
      // columnProps
      const { visible, render, columnProps } = this.getColumnComponentPropsTop(
        key,
        columnScope,
        jsxRenderContext,
      );
      // visible
      if (visible === false) continue;
      // property
      properties.push(property);
      // render
      promises.push(this._createColumnRender(render, columnProps, columnScope, jsxRenderContext));
    }
    let res = await Promise.all(promises);
    properties = properties.filter((_item, index) => !!res[index]);
    res = res.filter(item => !!item);
    properties.forEach((item, index) => {
      renders[item.key!] = res[index];
    });
    return { properties, renders };
  }

  public getColumnJsxRenderContext(celScope: ITableColumnScope): IJsxRenderContextTableColumn {
    return {
      app: this.app,
      ctx: this.ctx,
      $scene: 'tableColumn',
      $host: this,
      $celScope: celScope,
      $jsx: this.zovaJsx,
      $$table: this,
    };
  }

  public getCellJsxRenderContext(
    celScope: ITableCellScope,
    cellContext: CellContext<TData, any>,
  ): IJsxRenderContextTableCell {
    return {
      app: this.app,
      ctx: this.ctx,
      $scene: 'tableCell',
      $host: this,
      $celScope: celScope,
      $jsx: this.zovaJsx,
      $$table: this,
      cellContext,
    };
  }

  public async cellRenderPrepare(
    renders: TypeTableCellRenderComponent | TypeTableCellRenderComponent[],
  ) {
    if (!Array.isArray(renders)) renders = [renders];
    const renderProviders = renders.map(item => this.getRenderProvider(item));
    const promises: Promise<any>[] = renderProviders.map(renderProvider =>
      (async () => {
        if (typeof renderProvider === 'string' && renderProvider.includes('.tableCell.')) {
          return await this.sys.bean._getBean(renderProvider as any, true);
        }
      })(),
    );
    return await Promise.all(promises);
  }

  private async _createColumnRender(
    render: TypeTableCellRenderComponent | undefined,
    columnProps: ITableCellRenderColumnProps | undefined,
    columnScope: ITableColumnScope,
    renderContext: IJsxRenderContextTableColumn,
  ): Promise<TypeTableCellRender<TData, any> | undefined> {
    // renderProvider
    const renderProvider = this.getRenderProvider(render);
    // beanInstance
    let beanInstance: ITableCellRender | undefined;
    if (typeof renderProvider === 'string' && renderProvider.includes('.tableCell.')) {
      beanInstance = await this.sys.bean._getBean(renderProvider as any, true);
      const beanOptions = appResource.getBean(renderProvider as any);
      const onionOptions = beanOptions?.options as IDecoratorTableCellOptions | undefined;
      columnProps = deepExtend({}, onionOptions, columnProps);
      // should not eval jsx columnProps
      // columnProps = this.zovaJsx.renderJsxProps(columnProps as any, {}, columnScope, renderContext) as any;
      if (
        beanInstance?.checkVisible &&
        !(await beanInstance.checkVisible(columnProps as any, renderContext))
      )
        return;
    }
    return cellContext => {
      if (!cellContext) return;
      return this._cellRender(
        render,
        columnProps,
        columnScope,
        cellContext,
        renderProvider,
        beanInstance,
        undefined,
        undefined,
        undefined,
      );
    };
  }

  public cellRender(
    render: TypeTableCellRenderComponent,
    columnProps: IResourceTableActionRowOptionsBase,
    renderContext: IJsxRenderContextTableCell,
  ) {
    // render
    const cellScope = renderContext.$celScope;
    // renderProvider
    const renderProvider = this.getRenderProvider(render);
    // beanInstance
    let beanInstance: ITableCellRender | undefined;
    if (typeof renderProvider === 'string' && renderProvider.includes('.tableCell.')) {
      beanInstance = this.sys.bean._getBeanSyncOnly(renderProvider as any);
      const beanOptions = appResource.getBean(renderProvider as any);
      const onionOptions = beanOptions?.options as IDecoratorTableCellOptions | undefined;
      columnProps = deepExtend({}, onionOptions, columnProps);
      // should not eval jsx columnProps
      // columnProps = this.zovaJsx.renderJsxProps(columnProps as any, {}, renderContext.$celScope, renderContext) as any;
    }
    // const cellProps = isJsxComponent(render) ? Object.assign({}, columnProps, cast(render).props) : columnProps;
    const cellProps = columnProps;
    return this._cellRender(
      render,
      columnProps as ITableCellRenderColumnProps,
      undefined,
      renderContext.cellContext,
      renderProvider,
      beanInstance,
      cellProps,
      cellScope,
      renderContext,
    );
  }

  private _cellRender(
    render: TypeTableCellRenderComponent | undefined,
    columnProps: ITableCellRenderColumnProps | undefined,
    columnScope: ITableColumnScope | undefined,
    cellContext: CellContext<TData, any>,
    renderProvider: TypeTableCellRenderComponentProvider,
    beanInstance: ITableCellRender | undefined,
    cellProps: any | undefined,
    cellScope: ITableCellScope | undefined,
    jsxRenderContext: IJsxRenderContextTableCell | undefined,
  ) {
    return this.zovaJsx.setTransientObject(
      {
        getValue: (name: string) => {
          return cellContext.row.getValue(name);
        },
      },
      () => {
        return this._cellRenderInner(
          render,
          columnProps,
          columnScope,
          cellContext,
          renderProvider,
          beanInstance,
          cellProps,
          cellScope,
          jsxRenderContext,
        );
      },
    );
  }

  private _cellRenderInner(
    render: TypeTableCellRenderComponent | undefined,
    columnProps: ITableCellRenderColumnProps | undefined,
    columnScope: ITableColumnScope | undefined,
    cellContext: CellContext<TData, any>,
    renderProvider: TypeTableCellRenderComponentProvider,
    beanInstance: ITableCellRender | undefined,
    cellProps: any | undefined,
    cellScope: ITableCellScope | undefined,
    jsxRenderContext: IJsxRenderContextTableCell | undefined,
  ) {
    // value
    const value = cellContext.getValue();
    // renderFallbackValue
    const fallbackValue = this.table.options.renderFallbackValue;
    // cellScope
    if (!cellScope) {
      cellScope = objectAssignReactive({}, columnScope, { value, fallbackValue })!;
    }
    // render: text
    if (renderProvider === ('text' as TypeTableCellRenderComponent)) {
      return isNilOrEmptyString(value) ? fallbackValue : value;
    }
    // renderContext
    if (!jsxRenderContext) {
      jsxRenderContext = this.getCellJsxRenderContext(cellScope, cellContext);
    }
    // beanInstance
    if (beanInstance) {
      // jsx: props
      if (!cellProps) {
        // cellProps = isJsxComponent(render) ? Object.assign({}, columnProps, cast(render).props) : columnProps;
        cellProps = columnProps;
      }
      const cellProps2 = this.zovaJsx.renderJsxProps(
        cellProps,
        {},
        cellScope,
        jsxRenderContext,
      ) as any;
      if (cellProps2.class || cellProps2.style) {
        cellProps2.class = jsxRenderContext.$host.$cssMerge(
          cellProps2.class,
          jsxRenderContext.$host.$style(cellProps2.style),
        );
        delete cellProps2.style;
      }
      return beanInstance.render(cellProps2, jsxRenderContext, () => {
        const children = isJsxComponent(render) && cast(render).children;
        if (children && children.length > 0) {
          return this.zovaJsx.renderJsxChildrenDirect(children, cellScope, jsxRenderContext);
        } else {
          return value;
        }
      });
    }
    // general component
    return this.zovaJsx.render(render!, {}, cellScope, jsxRenderContext);
  }

  public getColumnProperty(name: string): ISchemaObjectExtensionField | undefined {
    if (!this.properties) return;
    return this.properties.find(item => item.key === name);
  }

  private _getColumnCelEnv(): typeof celEnvBase {
    const celEnv = celEnvBase.clone();
    celEnv.registerFunction('getProperty(string):dyn', name => {
      return this.getColumnProperty(name);
    });
    celEnv.registerFunction('getValue(string):dyn', name => {
      return this.zovaJsx.transientObject.getValue(name);
    });
    return celEnv;
  }

  public getColumnScope(name: string, scopeExtra?: {}): ITableColumnScope {
    return objectAssignReactive({}, this.$props.tableScope, {
      name,
      property: this.getColumnProperty(name),
      ...scopeExtra,
    });
  }

  public getColumnComponentPropsTop(
    name: string,
    celScope: {},
    renderContext: {},
  ): ITableCellRenderColumnOptions {
    const property = this.getColumnProperty(name);
    const rest = property?.rest;
    return this._getColumnComponentPropsTopByRest(rest, name, celScope, renderContext);
  }

  private _getColumnComponentPropsTopByRest(
    rest: ISchemaObjectExtensionFieldRest | undefined,
    name: string,
    celScope: {},
    _renderContext: {},
  ): ITableCellRenderColumnOptions {
    const visible = this.zovaJsx.evaluateExpression(rest?.visible, celScope);
    const render = rest?.render as TypeTableCellRenderComponent | undefined;
    const columnProps = Object.assign({ key: name }, cast(rest)?.columnProps);
    return { visible, render, columnProps };
  }

  // public getRenderFlattern(render: TypeTableCellRenderComponent): TypeTableCellRenderComponent {
  //   return isJsxComponent(render) ? cast(render).type : render;
  // }

  public getRenderProvider(
    render: TypeTableCellRenderComponent | undefined,
  ): TypeTableCellRenderComponentProvider {
    if (!render) return 'text';
    if (typeof render === 'string' && render.includes(':')) {
      return beanFullNameFromOnionName(render, 'tableCell');
    }
    return render;
  }
}
