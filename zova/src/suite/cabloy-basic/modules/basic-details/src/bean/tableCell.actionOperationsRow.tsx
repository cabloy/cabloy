import type {
  IResourceDetailsActionRowOptionsBase,
  IResourceRenderDetailsActionRowOptionsAction,
  TypeTableCellRenderComponent,
} from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  IJsxRenderContextTableColumn,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { VNode } from 'vue';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

import { checkPermission } from '../lib/utils.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionRowRecord {
    'basic-details:actionOperationsRow'?: ITableCellOptionsActionOperationsRow;
  }
}

export interface ITableCellOptionsActionOperationsRow extends IResourceDetailsActionRowOptionsBase {
  actions?: IResourceRenderDetailsActionRowOptionsAction[];
}

@TableCell<ITableCellOptionsActionOperationsRow>({
  class: 'join',
})
export class TableCellActionOperationsRow extends BeanBase implements ITableCellRender {
  async checkVisible(
    options: ITableCellOptionsActionOperationsRow,
    renderContext: IJsxRenderContextTableColumn,
  ): Promise<boolean> {
    const { $celScope, $$table } = renderContext;
    const actions = options.actions;
    if (!actions || actions.length === 0) return false;
    // renders
    const renders: TypeTableCellRenderComponent[] = [];
    for (const action of actions) {
      const actionName = action.name;
      const actionRender = action.render;
      const permissionHint = action.options?.permission;
      if (checkPermission($celScope.formMeta!.formScene!, permissionHint)) {
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
    const { $celScope, $$table } = renderContext;
    const actions = options.actions;
    if (!actions || actions.length === 0) return;
    const domActions: VNode[] = [];
    actions.forEach((action, index) => {
      const permissionHint = action.options?.permission;
      if (!checkPermission($celScope.formMeta!.formScene!, permissionHint)) return;
      const options2 = Object.assign({ key: index }, action.options);
      domActions.push($$table.cellRender(action.render!, options2, renderContext));
    });
    return <div class={options.class}>{domActions}</div>;
  }
}
