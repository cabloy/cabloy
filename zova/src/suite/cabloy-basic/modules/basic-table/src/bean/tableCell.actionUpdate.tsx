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
    'basic-table:actionUpdate'?: ITableCellOptionsActionUpdate;
  }
}

export interface ITableCellOptionsActionUpdate extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionUpdate>({
  class: 'btn btn-outline btn-primary join-item',
})
export class TableCellActionUpdate extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionUpdate,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $host } = renderContext;
    return (
      <button
        class={options.class}
        type="button"
        onClick={async () => {
          await $host.$performCommand('basic-commands:edit', options, renderContext);
        }}
      >
        <ZIcon name="::draft" width={24}></ZIcon>
      </button>
    );
  }
}
