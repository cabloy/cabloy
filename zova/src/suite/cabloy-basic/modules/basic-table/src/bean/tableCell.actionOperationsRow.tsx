import type { VNode } from 'vue';
import type {
  IResourceRenderTableActionRowOptionsAction,
  IResourceTableActionRowOptionsBase,
  TypeTableCellRenderComponent,
} from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { Comment, Fragment, isVNode, Text } from 'vue';
import { BeanBase } from 'zova';
import { IJsxRenderContextTableColumn, TableCell } from 'zova-module-a-table';

import { ZRowOperations } from '../.metadata/component/rowOperations.ts';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'basic-table:actionOperationsRow'?: ITableCellOptionsActionOperationsRow;
  }
}

export interface ITableCellOptionsActionOperationsRow extends IResourceTableActionRowOptionsBase {
  actions?: IResourceRenderTableActionRowOptionsAction[];
}

@TableCell<ITableCellOptionsActionOperationsRow>({
  class: 'join',
})
export class TableCellActionOperationsRow extends BeanBase implements ITableCellRender {
  async checkVisible(
    options: ITableCellOptionsActionOperationsRow,
    renderContext: IJsxRenderContextTableColumn,
  ): Promise<boolean> {
    const { $celScope, $host, $$table } = renderContext;
    const permissions = $celScope.permissions;
    const actions = options.actions;
    if (!actions || actions.length === 0) return false;
    // renders
    const renders: TypeTableCellRenderComponent[] = [];
    for (const action of actions) {
      const actionName = action.name;
      const actionRender = action.render;
      const permissionHint = action.options?.permission;
      if ($host.$passport.checkPermission(permissions, actionName, permissionHint)) {
        if (!actionRender) throw new Error(`should specify action render: ${actionName}`);
        renders.push(actionRender);
      }
    }
    await $$table.cellRenderPrepare(renders);
    return renders.length > 0;
  }

  render(
    options: ITableCellOptionsActionOperationsRow,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $celScope, $host, $$table } = renderContext;
    const permissions = $celScope.permissions;
    const actions = options.actions;
    if (!actions || actions.length === 0) return;
    const data = renderContext.cellContext.row.original as Record<string, unknown>;
    const domActions: VNode[] = [];
    actions.forEach((action, index) => {
      const actionName = action.name;
      const permissionHint = action.options?.permission;
      if (!$host.$passport.checkPermission(permissions, actionName, permissionHint, data)) return;
      const builtInLabel =
        action.render === 'basic-table:actionUpdate' ||
        action.render === 'basic-table:actionDelete';
      const options2 = Object.assign(
        { key: index },
        action.options,
        builtInLabel ? { showLabel: $$table.compact } : undefined,
      );
      const domAction = $$table.cellRender(action.render!, options2, renderContext);
      if (this._hasContent(domAction)) domActions.push(domAction);
    });
    if (domActions.length === 0) return;
    return (
      <ZRowOperations
        compact={$$table.compact}
        class={options.class}
        slotDefault={() => <>{domActions}</>}
      />
    );
  }

  private _hasContent(value: unknown): boolean {
    if (value === undefined || value === null || typeof value === 'boolean') return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.some(item => this._hasContent(item));
    if (!isVNode(value)) return true;
    if (value.type === Comment) return false;
    if (value.type === Text || value.type === Fragment) return this._hasContent(value.children);
    // Component renderers stay opaque: preserve their VNode and runtime ownership.
    return true;
  }
}
