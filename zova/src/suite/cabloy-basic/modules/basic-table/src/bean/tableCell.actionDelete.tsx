import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';

import { BeanBase } from 'zova';
import { ZIcon } from 'zova-module-a-icon';
import {
  type IJsxRenderContextTableCell,
  type ITableCellRender,
  type NextTableCellRender,
  TableCell,
} from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'basic-table:actionDelete'?: ITableCellOptionsActionDelete;
  }
}

export interface ITableCellOptionsActionDelete extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionDelete>({
  class: 'btn btn-outline btn-error join-item',
})
export class TableCellActionDelete extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionDelete,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $host } = renderContext;
    return (
      <button
        class={options.class}
        type="button"
        onClick={async () => {
          // eslint-disable-next-line no-alert
          if (!window.confirm(this.scope.locale.DeleteConfirm())) return;
          await $host.$performCommand('basic-commands:delete', options, renderContext);
        }}
      >
        <ZIcon name="::delete" width={24}></ZIcon>
      </button>
    );
  }
}
