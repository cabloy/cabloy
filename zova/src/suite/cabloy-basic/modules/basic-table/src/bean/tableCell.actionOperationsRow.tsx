import type {
  IResourceRenderTableActionRowOptionsAction,
  IResourceTableActionRowOptionsBase,
  TypeTableCellRenderComponent,
} from 'zova-module-a-openapi';

import { VNode } from 'vue';
import { BeanBase } from 'zova';
import {
  type IJsxRenderContextTableCell,
  IJsxRenderContextTableColumn,
  type ITableCellRender,
  type NextTableCellRender,
  TableCell,
} from 'zova-module-a-table';

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
    let actions = options.actions;
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
    const domActions: VNode[] = [];
    actions.forEach((action, index) => {
      const actionName = action.name;
      const permissionHint = action.options?.permission;
      if (!$host.$passport.checkPermission(permissions, actionName, permissionHint)) return;
      const options2 = Object.assign({ key: index }, action.options);
      domActions.push($$table.cellRender(action.render!, options2, renderContext));
    });
    return <div class={options.class}>{domActions}</div>;
  }
}
